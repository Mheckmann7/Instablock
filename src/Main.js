import React, { Component} from 'react';

class Main extends Component {
    render() {
        return (
            <div>
            <div style={{border: '5px solid white', padding: '0 20rem 50px 20rem', margin: '30px'}}>
                <h2>Create a Post</h2>
              
                <form onSubmit={(event) => {
                    event.preventDefault()
                    const description = this.postDescription.value
                    this.props.uploadPost(description)
                }} >
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <input type='file' accept='.jpg, .jpeg, .png, .gif' onChange={this.props.captureFile} />
                    <input id="postDescription" type="text" ref={(input) => { this.postDescription = input }} placeholder="Say something!" required style={{margin: "20px 0", padding: "10px 0"}}/>
                    <button type="submit">Upload</button>
                    </div>
                </form>
          
            
                </div>
                {
                    this.props.posts.map((post, key) => {
                        return (
                            <div key={key}>
                                <img alt={post.description} src={`https://ipfs.infura.io/ipfs/${post.hash}`} width='50%' style={{margin: '20px'}}/>
                                <p>{post.description}</p>
                            </div>
                        )
                    })
                }
                </div>
        )
    }

}

export default Main