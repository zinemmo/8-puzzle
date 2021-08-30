class Node {
  constructor(puzzle, level, fval) {
    this.puzzle = puzzle;
    this.level = level;
    this.fval = fval;
  }

  generate_child() {
    const { i, j } = this.find(this.puzzle);
    const availablePositions = [
      [i, j - 1],
      [i, j + 1],
      [i - 1, j],
      [i + 1, j],
    ];
    const children = [];
    availablePositions.forEach((element, index) => {
      const child = this.shuffle(this.puzzle, i, j, element[0], element[1]);
      if (child) {
        const child_node = new Node(child, this.level + 1, 0);
        children.push(child_node);
      }
    });
    return children;
  }

  shuffle(puzzle, x1, y1, x2, y2) {
    let temp_puzzle, aux;
    if (
      x2 >= 0 &&
      x2 < this.puzzle.length &&
      y2 >= 0 &&
      y2 < this.puzzle.length
    ) {
      temp_puzzle = puzzle;
      aux = temp_puzzle[x2][y2];
      temp_puzzle[x2][y2] = temp_puzzle[x1][y1];
      temp_puzzle[x1][y1] = aux;
      return temp_puzzle;
    }

    return null;
  }

  find(initialState) {
    // Search for initial position of the blank square
    let i, j;
    for (i = 0; i < 3; i++) {
      for (j = 0; j < 3; j++) {
        if (initialState[i][j] == null)
          return {
            i,
            j,
          };
      }
    }
  }
}

class Puzzle {
  constructor(size) {
    this.size = size;
    this.open = [];
    this.closed = [];
  }

  accept() {
    let i, j;
    const puz = [];
    for (i = 0; i < this.size; i++) {
      // TODO: break user input, as this will be done in Vue or react I don't know whats the best option
        
    }
  }

  f(start, goal) {
    return this.h(start.puzzle, goal) + start.level;
  }

  h(start, goal) {
    let temp = 0,
      i,
      j;
    for (i = 0; i < this.size; i++) {
      for (j = 0; j < this.size; j++) {
        if (start[i][j] != goal[i][j] && start[i][j] != null) {
          temp++;
        }
      }
    }
    return temp;
  }

  process() {
    let start = [
      [ 0, 1, 2],
      [4, null, 6],
      [5, 7, 8]
    ];
    let goal = [
      [ 0, 1, 2],
      [4, null, 5],
      [6, 7, 8]
    ];

    start = new Node(start,0,0);
    start.fval = this.f(start, goal);
    this.open.push(start);
    let cur = this.open[0];
    console.log("CURRENT - ", cur);
    if(this.h(cur.puzzle, goal) == 0) {
      console.log("CAIU FORA");
    }

    const newChild = cur.generate_child();
    newChild.forEach(ele => {
      console.log(ele)
    })
  }
}

const puz = new Puzzle(3);
puz.process();