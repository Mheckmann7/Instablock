import React, { Component} from 'react';
import Web3 from 'web3';
import Instablock from './abis/Instablock.json'
import './App.css';

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

  constructor(props) {
    super(props)
    this.state = {
      account: '',
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>Account: {this.state.account}</p>
        </header>
      </div>
    );
  }
}


export default App;
