import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// var subjects = require('./subjects.json');

class App extends Component {
    constructor(props){
        super(props);
        this.state={
            activeNode:[],
            parentNode:''
        }
    }
    componentDidMount(){
        // fetch('./related.json').then(response => response.json())
        // .then(data =>{
        //     let fN = Object.keys(data)[0];
        //     this.setState({
        //         relate:data,
        //         activeNode:[fN],
        //         parentNode:fN
        //     })
        // })
        Promise.all([fetch('./related.json').then(el=>el.json()),fetch('./subjects.json').then(el=>el.json())]).then(data=>{
            let fN = Object.keys(data[0])[0];
            this.setState({
                    relate:data[0],
                    subjects:data[1],
                    activeNode:[fN],
                    parentNode:fN
                })
        })
    }

    showNodes(){
        let {activeNode,relate,subjects} = this.state;
        
        return activeNode.map((mN)=>{
            let elements = Object.values(relate[mN]);
            return(
                <div className="nodeCnt" key={mN}>
                    <div className="main-nd-cnt">
                        <div className="mainNode" 
                                onClick={()=>{
                                    let {activeNode} = this.state;
                                    if(activeNode.indexOf(mN)!==0)
                                        activeNode.splice(activeNode.indexOf(mN),1);
                                    this.setState({
                                        activeNode,
                                        parentNode:activeNode[activeNode.length-1]
                                    })
                                }}
                            >
                            
                            {subjects[mN].name}
                        </div>
                        <div className="border-line-main"/>
                    </div>
                    <div className="childnodeCnt">
                    {
                        elements.map((r)=>{
                            return(
                                <div className="node"
                                        onClick={(event)=>{
                                            let {activeNode,parentNode} = this.state;
                                            if(parentNode==mN){
                                                activeNode.push(r.EID);
                                                this.setState({
                                                    activeNode,
                                                    parentNode:r.EID
                                                })
                                            }
                                        }} >
                                    
                                    <div className="border-line">{r.score}</div>
                                    <div className="node-el">{subjects[r.EID].name}</div>
                                </div>
                            )
                        })
                    }
                    </div>
                </div>
            )
        })
    }
  
    render() {
        return (
          <div className="App">
            {this.showNodes()}
          </div>
        );
    }
}

export default App;
