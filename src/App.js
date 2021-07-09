import React, { Component} from 'react';
import Web3 from 'web3';
import Instablock from './abis/Instablock.json'
import Main from './Main'
import './App.css';

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({host: 'ipfs.infura.io', port: 5001, protocol: 'https'})

class App extends Component {

  // const [web3, setWeb3] = useState(undefined);
  // const [account, setAccount] = useState('');
  // const [contract, setContract] = useState(undefined);

  // useEffect(() => {
  //   const init = async () => {
  //     try {
  //       const web3 = await getWeb3();
  //       // const account = await web3.eth.getAccount();
  //       // const networkId = await web3.eth.net.getId();
  //       setWeb3(web3);

  //     } catch (err) {
  //       alert ( 'Failed to load web3'. console.log(err))
  //     };

  //   }
  // }, [])

  // useEffect(() => {
  //   if(typeof web3 != 'undefined')
  // }, [web3])

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }
  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask.')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    // fetch first account
    this.setState({ account: accounts[0] })
    // network ID 
    const networkId = await web3.eth.net.getId()
    const networkData = Instablock.networks[networkId]
    if (networkData) {
      const instablock = new web3.eth.Contract(Instablock.abi, networkData.address)
      this.setState({ instablock })
      const postCount = await instablock.methods.postCount().call()
      this.setState({ postCount })
      this.setState({loading: false})
    } else {
      window.alert('Instablock contract not deployed to your network')
    }
  }

  captureFile = event => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  }

  uploadPost = description => {
    console.log('img to ipfs')
    ipfs.add(this.state.buffer, (err, result) => {
      console.log(result)
      if (err) {
        console.log(err)
        return
      }
      this.setState({ loading: true })
      this.state.instablock.methods.uploadPost(result[0].hash, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({loading: false})
      })
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      instablock: null,
      posts: [],
      loading: true,
    }
  }

  render() {
    return (
      <div className="App">
        <p>Account: {this.state.account}</p>
        <header className="App-header">
        {this.state.loading
          ? <p>Loading...</p>
            : <Main captureFile={this.captureFile}/>

        }
        </header>
  
      </div>
    );
  }
}


export default App;
