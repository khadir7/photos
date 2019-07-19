import React, {Component} from 'react';
import {get} from "axios"; 
import './App.css';

class App extends Component{
  constructor(props){
    super(props);
    this.state = {}
    this.onClickHandler = this.onClickHandler.bind(this);
    this.onCloseHandler = this.onCloseHandler.bind(this);
    this.onChangeHandler = this.onChangeHandler.bind(this);
  }

  onChangeHandler(e){
    let {picArray} = this.state;
    let filteredArray = []
    if(e.target.value){
      filteredArray = picArray.filter((item, index) => (
        (item.data.name.match(e.target.value)) ? true : false
      ))
    }
    this.setState({
      filteredArray: e.target.value ? filteredArray : picArray
    })
  }

  onClickHandler(item){
    this.setState({
      showModal: true,
      item
    })
  }

  onCloseHandler(){
    this.setState({
      showModal: false
    })
  }

  componentDidMount(){
    get("https://www.reddit.com/r/pics/.json?jsonp=")
      .then((response) => {
        console.log(response);
        this.setState({
          picArray: response.data.data.children || [],
          filteredArray: response.data.data.children || []
        })
      })
      .catch(e => console.log(e))
  }

  render(){
    let {filteredArray=[], showModal=false, item} = this.state;
    return(
      <div className="App">
        <div>Search : <input type="text" placeholder="search using title..." onChange={this.onChangeHandler}/></div>
        {filteredArray.map((item, index) => (
          <div className="imageContainer" key={index} onClick={() => this.onClickHandler(item)}>
            <img className="image" src={(item.data.thumbnail).match(".jpg") ? item.data.thumbnail : "https://b.thumbs.redditmedia.com/RSoPKll3LyzXaEMYZBPESysGehQGPA2Nsbrhwji3ZHg.jpg"} alt=""/>
            <div>{item.data.name}</div>
          </div>
        ))}
        {
          showModal && <Modal item={item} onCloseHandler={this.onCloseHandler}/>
        }
      </div>
    )
  }
}

const Modal = ({item, onCloseHandler}) => {
  return (
    <React.Fragment>
      <div className="modal">
        <img src={(item.data.url).match(".jpg") ? item.data.url : "https://i.redd.it/o9g6665tx5b31.jpg"} alt=""/>      
        <div>Title : {item.data.name}</div>
        <div>Author : {item.data.author}<button onClick={() => onCloseHandler()}>Close</button></div>
      </div>
    </React.Fragment>
  )
}

export default App;
