import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    constructor(props){
        super(props);
        this.state={
            activeNode:[],
            parentNode:'',
            level:0,
            noOfAdjacentNodes:4
        }
    }
    componentDidMount(){
        
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
    componentDidUpdate(){
        let {level,parentNode,activeNode} = this.state;
        this.refs[`nL-${level}-${parentNode}`].scrollIntoView({block: 'start', behavior: 'smooth'});
    }
    showNodes(){
        let {activeNode,relate,subjects,noOfAdjacentNodes} = this.state;
        
        let aN = activeNode.length;
        return activeNode.map((mN,i)=>{
            let elements = Object.values(relate[mN]).sort((a,b)=>{return (b.score||0) - (a.score||0)});
            elements = elements.slice(0,noOfAdjacentNodes);
            return(
                <div className={i==aN-1?"nodeCnt fade":"nodeCnt"} key={`nL-${i}-${mN}`} style={{animationDelay:'0.25s'}}>

                    <div className="main-nd-cnt">
                        <div className="mainNode" 
                                onClick={()=>{
                                    let {activeNode} = this.state;
                                    if(activeNode.lastIndexOf(mN)!==0 && i==aN-1)
                                        activeNode.splice(activeNode.lastIndexOf(mN),1);
                                    if(i==aN-1){
                                        this.setState({
                                            activeNode,
                                            parentNode:activeNode[activeNode.length-1],
                                            level:i-1
                                        })
                                    }
                                }}
                            >
                            
                            <div className={i==aN-1 ? "active-ele": "non-active-ele"} ref={`nL-${i}-${mN}`}>
                                {subjects[mN].name}
                            </div>
                        </div>
                        <div className={i==aN-1 ? "border-line-main": "border-line-down"}/>
                        {i!==aN-1 && <div className="arrow-down "/>}
                    </div>
                    <div className="childnodeCnt">
                    {i==aN-1 && 
                        elements.map((r)=>{
                            return(
                                <div className="node"
                                        
                                        onClick={(event)=>{
                                            let {activeNode,parentNode} = this.state;
                                            if(parentNode==mN){
                                                activeNode.push(r.EID);
                                                this.setState({
                                                    activeNode,
                                                    parentNode:r.EID,
                                                    level:i+1
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
