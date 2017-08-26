import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={ props.onClick }>
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {

  var renderedSquares = [];
  for (let i = 0; i < 3; i++) {
    var currentRow = [];
    for (let j = 0; j < 3; j++) {
      currentRow.push(<span>{this.renderSquare(i * 3 + j)}</span>);
    }
    renderedSquares.push(<div className='board-row'>{ currentRow }</div>)
  }

    return (
        <div> {renderedSquares} </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state={
      history: [
        {
        squares: Array(9).fill(null),
        clickedSquare: [null, null],
        }
      ],
      xIsNext: true,
      stepNumber: 0,
      ascendingOrder: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([
        {
          squares: squares,
          clickedSquare: [Math.floor((i % 3) + 1), Math.floor((i / 3) + 1)],
        }
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    });
  }

  jumpTo(move) {
    this.setState({
      stepNumber: move,
      xIsNext: (move % 2) === 0
    });
  }

  toggleOrder() {
    this.setState({
      ascendingOrder: !this.state.ascendingOrder,
    });
  }

  undo() {
    if (this.state.stepNumber) {
      this.setState({
        stepNumber: this.state.stepNumber - 1,
        xIsNext: !this.state.xIsNext,
      });
    };
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const bold = { fontWeight: 'bold' };
    const normal = { fontWeight: 'normal' };

    // Create new array to map over
    const moves = history.map((values, move) => {
      const desc = move ? "Move #" + move + " at (" + values.clickedSquare + ")" : "Game start";

      return (
        <li key={move}>
          <a href="#" style={this.state.stepNumber === move ? bold : normal}
            onClick={() => this.jumpTo(move)}>{desc}
          </a>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner + '!';
    }
    else if (this.state.stepNumber === 9) {
      status = 'Tie Game!'
    }
    else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    };

    if (!this.state.ascendingOrder) {
      moves.reverse();
    };

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="status">{ status }</div>
          <ol id="moveList">{ moves }</ol>
        </div>
        <div className="game-buttons">
          <button onClick={ () => this.toggleOrder() }>
            { this.state.ascendingOrder ? "Toggle Descending" : "Toggle Ascending" }
          </button>
          <button onClick={ () => this.undo() }>Undo</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
