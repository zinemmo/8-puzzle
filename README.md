# 8-Puzzle Solver using A* Algorithm and Manhattan Distance
This program was developed for a Artificial Intelligence class of the Computer Engineering class for PUCRS. 
You probably are asking yourself why on earth I chose Javascript for the development of this program, as it is way slower than C, C++ and Python. 
The reason is simple, I don't know Python and as the program use a lot of Objects I didn't want to lose time with pointers.

## Isn't Javascript a pass by reference language?
Yes, however using the `Lodash` library we can use the `cloneDeep` method to change the reference of the receiving variable to the value of the passing variable or data. 
This way we can always guarantee that what is going to be stored is the value not the reference to memory.

## How to run this program?
First of all, clone this repository and download `Node.js` if you don't have it. You can find the download of `Node.js` by [clicking here](https://nodejs.org/en/), please install the latest stable version (v14.17.6). 
The version that the program was made is v.14.17.3, however it should not make any difference. I **strongly** recommend using a good IDE for this, for example, **Visual Studio Code**.
Visual Studio Code enables the possibility to run the code with a Debugger attached.

After clonning the repository and installing node, open the project with your favorite IDE and open its terminal or navigate to the clonned repository with your machine terminal and insert the following command:
```
npm install
```
This command will download all the necessary dependencies of this project.
### Running without a Debugger
To run this program without a debugger simply uncomment the desired puzzle (**only one variable named start should be uncommented**) that you wish to be solved or add/alter 
the value of one to your desired initial puzzle state and run the following command on the Terminal:
```
node PuzzleSolver.js
```
The variables that you need to uncomment are available on lines 404 to 430, just as an example to run the easy puzzle configuration your code should look something like this:
```javascript
// EASY
const start = [
   [1, 3, 4],
   [8, 6, 2],
   [0, 7, 5],
];

// MEDIUM
// const start = [
//   [2, 8, 1],
//   [0, 4, 3],
//   [7, 6, 5],
// ];

// HARD
// const start = [
//   [2, 8, 1],
//   [4, 6, 3],
//   [0, 7, 5],
// ];

// WORST
// const start = [
//   [5, 6, 7],
//   [4, 0, 8],
//   [3, 2, 1],
// ];

const goal = [
  [1, 2, 3],
  [8, 0, 4],
  [7, 6, 5],
];

const solver = new Puzzle(start, goal);
console.log(solver.solve());
```
### Running with a Debuger
To run this program with a debugger you need to configure your IDE debugger to run with Node as the default program and follow uncomment the desired initial puzzle state or add/alter one.
Your code should look like this:
```javascript
// EASY
const start = [
   [1, 3, 4],
   [8, 6, 2],
   [0, 7, 5],
];

// MEDIUM
// const start = [
//   [2, 8, 1],
//   [0, 4, 3],
//   [7, 6, 5],
// ];

// HARD
// const start = [
//   [2, 8, 1],
//   [4, 6, 3],
//   [0, 7, 5],
// ];

// WORST
// const start = [
//   [5, 6, 7],
//   [4, 0, 8],
//   [3, 2, 1],
// ];

const goal = [
  [1, 2, 3],
  [8, 0, 4],
  [7, 6, 5],
];

const solver = new Puzzle(start, goal);
console.log(solver.solve());
```
