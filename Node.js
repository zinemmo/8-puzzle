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
      console.log(element, index);
      const child = this.shuffle(this.puzzle, i, j, element[0], element[1]);
      if (child) {
        child_node = Node(child, this.level + 1, 0);
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
      temp_puzzle = this.copy(puzzle);
      aux = temp_puzzle[x2][y2];
      temp_puzzle[x2][y2] = temp_puzzle[x1][y1];
      temp_puzzle[x1][y1] = aux;
      return temp_puzzle;
    }

    return null;
  }

  copy(root) {
    // TODO: Refactor and review this function as it may not be necessary in JS
    let i, j;
    const aux = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];
    for (i = 0; i < 3; i++) {
      let t = [];
      for (j = 0; j < 3; j++) {
        t.push(j);
      }
      aux.push(t);
    }
    return aux;
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
        if (start[i][j] != goal[i][j] && start[i][j] != '') {
          temp++;
        }
      }
    }
    return temp;
  }
}
