const ALL_POSITIONS = ["Right", "Left", "Up", "Down"];
const TOP_RIGHT = ["Left", "Down"];
const TOP_MIDDLE = ["Right", "Left", "Down"];
const TOP_LEFT = ["Right", "Down"];
const MIDDLE_RIGHT = ["Left", "Up", "Down"];
const MIDDLE = ALL_POSITIONS;
const MIDDLE_LEFT = ["Right", "Up", "Down"];
const BOTTOM_RIGHT = ["Left", "Up"];
const BOTTOM_MIDDLE = ["Left", "Up", "Right"];
const BOTTOM_LEFT = ["Right", "Up"];

const getPosition = (puzzle) => {
  let yPos, xPos;
  puzzle.forEach((array, index) => {
    const position = array.findIndex(ele => ele == 0);
    if(position >= 0) {
      yPos = index;
      xPos = position;
    }
  });

  console.log(`Found blank space on X = ${xPos} and Y = ${yPos}`);

  return [xPos, yPos];
}

const createPuzzle = (puzzle, movement) => {
  switch (movement) {
    case 'Right':
      return moveRight(puzzle);
    case 'Left':
      return moveLeft(puzzle);    
    case 'Up':
      return moveUp(puzzle);
    case 'Down':
      return moveDown(puzzle);    
    default:
      break;
  }
}

const moveRight = (puzzle) => {
  console.log("Right");
  const [x ,y] = getPosition(puzzle);
  let row = puzzle[y];
  [row[x], row[x+1]] = [row[x+1], row[x]];
  puzzle[y] = row;
  console.log(puzzle);
  return puzzle;

}

const moveLeft = (puzzle) => {
  console.log("Left");
  const [x ,y] = getPosition(puzzle);
  let row = puzzle[y];
  [row[x], row[x-1]] = [row[x-1], row[x]];
  puzzle[y] = row;
  console.log(puzzle);
  return puzzle;
}

const moveUp = (puzzle) => {
  console.log("Up");
  const [x ,y] = getPosition(puzzle);
  let [curRow, upperRow] = [puzzle[y], puzzle[y+1]];
  const aux = curRow[x];
  curRow[x] = upperRow[x];
  upperRow[x] = aux;
  puzzle[y] = curRow;
  puzzle[y+1] = upperRow;
  console.log(puzzle);
  return puzzle;
}

const moveDown = (puzzle) => {
  console.log("Down");
  const [x ,y] = getPosition(puzzle);
  console.log(puzzle);
  let [curRow, lowerRow] = [puzzle[y], puzzle[y-1]];
  const aux = curRow[x];
  curRow[x] = lowerRow[x];
  lowerRow[x] = aux;
  puzzle[y] = curRow;
  puzzle[y-1] = lowerRow;
  console.log(puzzle);
  return puzzle;
}

const solve = () => {
  
}

class Puzzle {
  constructor(start, goal) {
    this.start = start;
    this.goal = goal;
    this.current = start;
    this.open = [];
    this.closed = [];
    this.height = 0;
  }

  solve() {
    if(JSON.stringify(this.start) == JSON.stringify(this.goal)) {
      return true;
    }

    this.open.push(this.start);
    // Check if they're equal
    this.movePiece();
    // if Open is not lenght 0
  }

  checkPossibleMovements(positions) {
    let possibleMovements;
    switch (JSON.stringify(positions)) {
      case JSON.stringify([0,0]):
        possibleMovements = TOP_LEFT;
        break;
      case JSON.stringify([1,0]):
        possibleMovements = TOP_MIDDLE;
        break;
      case JSON.stringify([2,0]):
        possibleMovements = TOP_RIGHT;
        break;
      case JSON.stringify([0,1]):
        possibleMovements = MIDDLE_LEFT;
        break;
      case JSON.stringify([1,1]):
        possibleMovements = MIDDLE;
        break;
      case JSON.stringify([2,1]):
        possibleMovements = MIDDLE_RIGHT;
        break;
      case JSON.stringify([0,2]):
        possibleMovements = BOTTOM_LEFT;
        break;
      case JSON.stringify([1,2]):
        possibleMovements = BOTTOM_MIDDLE;
        break;
      case JSON.stringify([2,2]):
        possibleMovements = BOTTOM_RIGHT;
        break;
      default:
        console.log("ERROR");
        break;
    }

    return possibleMovements;
  }

  createChildren(movements) {
    console.log("This", this);
    const children = {
      puzzle: createPuzzle(this.current, movements[0]),
      height: this.height
    };
    console.log("This", this);
    console.log("Children", children);
    // for (let index = 0; index < movements.length; index++) {
    //   children.push(new Node(current, movements[index], this.height, this.goal));
    //   console.log(children[index].puzzle);
    // }
    // const possibleNodes = this.open.map();
  }

  movePiece() {
    const blankStartPosition = getPosition(this.start);
    const movements = this.checkPossibleMovements(blankStartPosition);
    
    if(!movements) {
      console.log("movePiece Error"); 
    }

    this.createChildren(movements);
  }
}

const start = [ 
  [1, 2, 3],
  [4, 5, 0],
  [6, 7, 8]
];

const goal = [
  [1, 2, 3],
  [4, 0, 5],
  [6, 7, 8],
];

const eightPuzzle = new Puzzle(start, goal);
eightPuzzle.solve();