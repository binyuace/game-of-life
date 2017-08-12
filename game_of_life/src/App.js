import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// import PropTypes from 'prop-types';
// import 'typeface-roboto';
import Button from 'material-ui/Button';

class Header extends Component {
  render() {
    return (
      <div>
      <h1> 
        Game of Life
      </h1>
      <Button color ="primary" onClick ={this.props.startClick}>
        Start
      </Button>
      <Button color ="primary" onClick ={this.props.pauseClick}>
        Pause
      </Button>
      <Button color ="primary" onClick ={this.props.clearClick}>
        Clear
      </Button>
      <p>
      {this.props.generations} generations
      </p>
      </div>
      )
  }
}
class Grid extends Component {
  render() {
    let life = this.props.life
    let x = this.props.x
    let y = this.props.y
    let color = ""
    if (life === 0) {
      color = "dead"
    } else {
      color = life === 1?"young":"old"
    }
    return (
      <div className = {"grid "+ color} onClick = {this.props.gridClick}>

      </div>
    )
  }
}
class Board extends Component {
  renderGrids() {
    let grids = []
    for (let i = 0; i < 50; i++) {
      for (let j = 0; j < 80; j++) {
          var click = ()=>this.props.handleClick(i,j)
          grids.push((<Grid 
            key = {i*80+j}
            life = {this.props.board[i][j]}
            gridClick = {click}
            />))
      }
    }
    return grids
  }
  render() {
    const grids = this.renderGrids();
    return (
    <div className = "board">
      {grids}
    </div>
    )
  }  
}

class App extends Component {
  createRandomBoard(){
      let initial = Array(50).fill(Array(80).fill(0))
      return initial.map(arr => arr.map(item => Math.floor(Math.random()*1.2)))
    }
  constructor() {
    super()
    this.state = {
      board : this.createRandomBoard(),
      doUpdate:true,
      generations:0,
    }
    this.gridClick = this.gridClick.bind(this)
    this.startClick = this.startClick.bind(this)
    this.clearClick = this.clearClick.bind(this)
    this.pauseClick = this.pauseClick.bind(this)
    this.update = this.update.bind(this)
  }

  start() {
    let This = this
    var game = setInterval(function(){
        if(This.state.doUpdate ){
            This.update()
        }
      },100)
    return game
  }
  game = this.start()
  gridClick(i,j) {
    let tempboard = this.state.board.map(function(arr) {
      return arr.slice();
    })
    tempboard[i][j] = this.state.board[i][j]?0:1
    this.setState({board:tempboard})
  }
  update() {
    let copyBoard = this.state.board.map(function(arr){return arr.slice();});
    copyBoard.push(Array(80).fill(0))
    copyBoard.unshift(Array(80).fill(0))
    copyBoard.map(function(arr){
      arr.push(0)
      arr.unshift(0)
      return arr
      }
    )
    // let tboard = this.state.board.map(function(arr) {
    //   return arr.slice();
    // })
    let tboard = this.createRandomBoard()
    function countNeighbors(m,n,prev) {
      function f(x,prev){
        return x > 0?1:0
      }
      let count = 0
      for (let a = -1;a<2;a++){
        for (let b = -1;b<2;b++){
          count += f(prev[m+a][n+b])
        }
      }
      count -= f(prev[m][n])
      return count
    }
    for (let i = 1; i < 51; i++) {
      for (let j = 1; j < 81; j++) {
          // When it's alive
          if (copyBoard[i][j] > 0){
            if (countNeighbors(i,j,copyBoard) < 2
                  || countNeighbors(i,j,copyBoard) > 3) {
              tboard[i-1][j-1] = 0
            }
            else {
              tboard[i-1][j-1] = 2
            }
          } else {
           // when it's dead
            if (countNeighbors(i,j,copyBoard) === 3) {
              tboard[i-1][j-1] = 1
            } else {
              tboard[i-1][j-1] = 0
            }
          }
      }
    }
    let newgene = this.state.generations + 1
    this.setState({board:tboard,generations:newgene})
  }
  startClick() {
    this.setState({doUpdate:true})
  }
  pauseClick() {
    this.setState({doUpdate:false})
  }
  clearClick() {
    this.setState({
      generations:0,
      board: Array(50).fill(Array(80).fill(0)),
      doUpdate : false,

    })
  }
  render() {
    const board = this.state.board
    var gridClick = (i,j)=> this.gridClick(i,j)
    let startClick = this.startClick
    let pauseClick = this.pauseClick
    let clearClick = this.clearClick      

    return (
      <div className="App">
        <div className="App-header">
          <Header
          generations = {this.state.generations}
          startClick = {startClick}
          pauseClick = {pauseClick}
          clearClick = {clearClick}
          />
        </div>
        <div className="container">
          <Board
          board = {board}
          handleClick = {gridClick}
          />
        </div>
        <div className ="App-footer">
          Never fill an array with array

        </div>
      </div>  
    )
  }
}

export default App;
