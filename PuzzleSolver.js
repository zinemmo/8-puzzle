const _ = require('lodash');
const uuid = require('uuid');

const ALL_POSITIONS = new Array('Right', 'Left', 'Up', 'Down');
const TOP_RIGHT = new Array('Left', 'Down');
const TOP_MIDDLE = new Array('Right', 'Left', 'Down');
const TOP_LEFT = new Array('Right', 'Down');
const MIDDLE_RIGHT = new Array('Left', 'Up', 'Down');
const MIDDLE = ALL_POSITIONS;
const MIDDLE_LEFT = new Array('Right', 'Up', 'Down');
const BOTTOM_RIGHT = new Array('Left', 'Up');
const BOTTOM_MIDDLE = new Array('Left', 'Up', 'Right');
const BOTTOM_LEFT = new Array('Right', 'Up');

const getPosition = (puzzle, value = 0) => {
  let yPos, xPos;
  puzzle.forEach((array, index) => {
    const position = array.findIndex((ele) => ele == value);
    if (position >= 0) {
      yPos = index;
      xPos = position;
    }
  });

  console.log(`Found blank space on X = ${xPos} and Y = ${yPos}`);

  return [xPos, yPos];
};

class Node {
  constructor(level, current, movement, goal, initial, father) {
    this.level = level;
    if (!initial) {
      this.puzzle = this.createNode(current, movement);
    } else {
      this.puzzle = current;
    }
    this.goal = goal;
    this.distance = this.heuristic();
    // For children nodes
    this.id = uuid.v4();
    this.father = father;
  }

  createNode(currentPuzzle, movement) {
    switch (movement) {
      case 'Right':
        return this.moveRight(currentPuzzle);
      case 'Left':
        return this.moveLeft(currentPuzzle);
      case 'Up':
        return this.moveUp(currentPuzzle);
      case 'Down':
        return this.moveDown(currentPuzzle);
      default:
        break;
    }
  }

  moveRight(currentPuzzle) {
    console.log('Right');
    const [x, y] = getPosition(currentPuzzle);
    let row = currentPuzzle[y];
    [row[x], row[x + 1]] = [row[x + 1], row[x]];
    currentPuzzle[y] = row;
    console.log('Move', currentPuzzle);
    return currentPuzzle;
  }

  moveLeft(currentPuzzle) {
    console.log('Left');
    const [x, y] = getPosition(currentPuzzle);
    let row = currentPuzzle[y];
    [row[x], row[x - 1]] = [row[x - 1], row[x]];
    currentPuzzle[y] = row;
    console.log('Move', currentPuzzle);
    return currentPuzzle;
  }

  moveUp(currentPuzzle) {
    console.log('Up');
    const [x, y] = getPosition(currentPuzzle);
    let curRow = currentPuzzle[y];
    let lowerRow = currentPuzzle[y - 1];
    const aux = curRow[x];
    curRow[x] = lowerRow[x];
    lowerRow[x] = aux;
    console.log('Move', currentPuzzle);
    return currentPuzzle;
  }

  moveDown(currentPuzzle) {
    console.log('Down');
    const [x, y] = getPosition(currentPuzzle);
    console.log(currentPuzzle);
    let curRow = currentPuzzle[y];
    let upperRow = currentPuzzle[y + 1];
    const aux = curRow[x];
    curRow[x] = upperRow[x];
    upperRow[x] = aux;
    console.log('Move', currentPuzzle);
    return currentPuzzle;
  }

  heuristic() {
    return this.distanceFunction();
  }

  distanceFunction() {
    let i,
      j,
      cont = 0,
      x,
      y;
    for (i = 0; i < 3; i++) {
      for (j = 0; j < 3; j++) {
        if (this.puzzle[i][j] != this.goal[i][j] && this.puzzle[i][j] != 0) {
          [x, y] = getPosition(this.goal, this.puzzle[i][j]);
          cont += Math.abs(x - j) + Math.abs(y - i);
        }
      }
    }
    return cont;
  }
}

class Puzzle {
  constructor(start, goal) {
    // Main values
    this.start = start;
    this.goal = goal;
    this.current = start;
    this.open = [];
    this.closed = [];
    this.repeatedDistance = [];
    this.height = 0;
    // Aux values
    this.solved = null;
    this.children = [];
    this.fatherOpened = [];
  }

  solve() {
    // Check if start is equal to goal
    if (_.isEqual(this.current, this.goal)) {
      return new Node(
        this.height,
        _.cloneDeep(this.start),
        null,
        _.cloneDeep(this.goal),
        true
      );
    }

    // If start is different than goal crete node and insert into open array
    this.open.push(
      new Node(
        this.height,
        _.cloneDeep(this.start),
        null,
        _.cloneDeep(this.goal),
        true
      )
    );

    let onlyDistances,
      lowestFIndex,
      blankPosition,
      possibleMovements,
      nodesFound,
      lowestValue,
      lowestValueArray,
      father,
      fatherCheck;

    while (this.solved < 1000) {
      this.height++;
      // Reset variables
      this.children = null;
      nodesFound = [];
      this.current = null;
      // Find the node with the lowest distance
      onlyDistances = this.open.map((ele) => ele.distance);
      lowestValue = Math.min(...onlyDistances);
      lowestFIndex = onlyDistances.indexOf(lowestValue);
      lowestValueArray = onlyDistances.reduce(
        (acc, ele, i) => (ele === lowestValue ? acc.concat(i) : acc),
        []
      );
      // If there are open nodes with the same distance we should iterate through them
      if (lowestValueArray.length > 1) {
        this.fatherOpened = [];
        // TODO: Put bigger fValues on the open list
        // Create an array with only the equal values
        father = this.open.filter((ele) => ele.distance == lowestValue);
        // Create all children from the parents, push fathers to the closed list
        father.forEach((ele) => {
          if (_.isEqual(ele.puzzle, this.goal)) {
            this.current = _.cloneDeep(ele);
          }
          this.closed.push(_.cloneDeep(ele));
          _.remove(this.open, (openEle) =>
            _.isEqual(ele.puzzle, openEle.puzzle)
          );
          blankPosition = getPosition(ele.puzzle);
          possibleMovements = this.checkPossibleMovements(blankPosition);
          this.fatherOpened.push(
            this.createChildren(
              possibleMovements,
              _.cloneDeep(this.goal),
              _.cloneDeep(ele.puzzle),
              _.cloneDeep(this.height),
              ele.id
            )
          );
        });

        if (this.current) {
          break;
        }
        // Get what puzzles exist on children that will be removed by the filter
        console.log('Before filter', this.open);
        this.fatherOpened.forEach((ele) => {
          if (ele.length > 1) {
            ele.forEach((element) => {
              if (
                this.closed.some((closeEle) =>
                  _.isEqual(closeEle.puzzle, element.puzzle)
                )
              ) {
                nodesFound.push(element.puzzle);
              }
            });
          } else {
            if (
              this.closed.some((closeEle) =>
                _.isEqual(closeEle.puzzle, element.puzzle)
              )
            ) {
              nodesFound.push(element.puzzle);
            }
          }
        });

        if (nodesFound.length > 0) {
          let aux = [];
          // Remove all closed occurrences
          this.fatherOpened.forEach((element) => {
            aux.push(
              element.filter((ele) =>
                nodesFound.some(
                  (nodeEle) =>
                    JSON.stringify(ele.puzzle) !== JSON.stringify(nodeEle)
                )
              )
            );
          });
          // Put all on the open list
          if (aux.length > 0) {
            aux.forEach((ele) => {
              ele.forEach((element) => {
                this.open.push(_.cloneDeep(element));
              });
            });
          }
        }

        console.log('After filter', this.open);
      } else {
        console.log('Lowest distance index', lowestFIndex);
        // Copy the lowest distance to the current node
        this.current = _.cloneDeep(this.open[lowestFIndex]);
        // Verify if the current is equal as the goal
        if (_.isEqual(this.current.puzzle, this.goal)) {
          // If is equal, than we found a solution
          this.closed.push(this.current);
          break;
        }
        // If is not equal we need to move the pieces and create more nodes
        // Get the position of the blank value
        blankPosition = getPosition(this.current.puzzle);
        // Get the possible movements from the blank value position
        possibleMovements = this.checkPossibleMovements(blankPosition);
        // Generate children nodes based on possible movements
        this.children = this.createChildren(
          possibleMovements,
          _.cloneDeep(this.goal),
          _.cloneDeep(this.current.puzzle),
          _.cloneDeep(this.height)
        );
        // Add current to the closed array
        this.closed.push(_.cloneDeep(this.current));
        // Add children to the open list
        this.open = _.cloneDeep(this.children);

        // Filter open list to remove occurrences of closed list
        console.log('Before filter', this.open);
        this.open.forEach((ele) => {
          if (
            this.closed.some((closeEle) =>
              _.isEqual(closeEle.puzzle, ele.puzzle)
            )
          ) {
            nodesFound.push(ele.puzzle);
          }
        });

        if (nodesFound.length > 0) {
          this.open = this.open.filter((ele) =>
            nodesFound.some(
              (nodeEle) =>
                JSON.stringify(ele.puzzle) !== JSON.stringify(nodeEle)
            )
          );
        }
        console.log('After filter', this.open);
      }
      console.log(this.height);
    }

    return this.closed;
  }

  selectCurrent(height, children) {
    children;
  }

  createChildren(movements, goal, currentPuzzle, height, father) {
    const newNodes = movements.map(
      (movement) =>
        new Node(
          height,
          _.cloneDeep(currentPuzzle),
          movement,
          goal,
          false,
          father
        )
    );

    return newNodes;
  }

  checkPossibleMovements(positions) {
    let possibleMovements;
    switch (JSON.stringify(positions)) {
      case JSON.stringify([0, 0]):
        possibleMovements = TOP_LEFT;
        break;
      case JSON.stringify([1, 0]):
        possibleMovements = TOP_MIDDLE;
        break;
      case JSON.stringify([2, 0]):
        possibleMovements = TOP_RIGHT;
        break;
      case JSON.stringify([0, 1]):
        possibleMovements = MIDDLE_LEFT;
        break;
      case JSON.stringify([1, 1]):
        possibleMovements = MIDDLE;
        break;
      case JSON.stringify([2, 1]):
        possibleMovements = MIDDLE_RIGHT;
        break;
      case JSON.stringify([0, 2]):
        possibleMovements = BOTTOM_LEFT;
        break;
      case JSON.stringify([1, 2]):
        possibleMovements = BOTTOM_MIDDLE;
        break;
      case JSON.stringify([2, 2]):
        possibleMovements = BOTTOM_RIGHT;
        break;
      default:
        console.log('ERROR');
        break;
    }

    return possibleMovements;
  }
}

// EASY
// const start = [
//   [1, 3, 4],
//   [8, 6, 2],
//   [0, 7, 5],
// ];

// MEDIUM
const start = [
  [2, 8, 1],
  [0, 4, 3],
  [7, 6, 5],
];

const goal = [
  [1, 2, 3],
  [8, 0, 4],
  [7, 6, 5],
];

// Puzzle correctly done: EASY

const solver = new Puzzle(start, goal);
console.log(solver.solve());
