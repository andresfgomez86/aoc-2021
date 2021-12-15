import { readFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(__dirname, "input.txt").replace("dist", "src");
const inputArray = readFileSync(filePath).toString().split("\n").map(row => row.split("").map(item => parseInt(item)));

const flashOctopus = (grid: number[][], xPos: number, yPos: number, flashedOctopuses: Set<string>): number => {
  let flashCount = 1;
  grid[yPos][xPos] = 0;
  flashedOctopuses.add(`${yPos},${xPos}`);
  for (let i = yPos -1; i < yPos + 2; i++) {
    for (let j= xPos -1; j < xPos + 2; j++) {
      const current = grid[i] && grid[i][j];
      if (typeof(current) != 'undefined' && !flashedOctopuses.has(`${i},${j}`) && !(i === yPos && j === xPos)) {
        const newValue = current + 1;
        if (newValue > 9) {
          flashCount += flashOctopus(grid, j, i, flashedOctopuses);
        } else {
          grid[i][j] = newValue;
        }
      }
    }
  }
  return flashCount;
}

const partOne = (input: number[][]) => {
  let flashCount = 0;
  for(let step = 0; step < 100; step++) {
    const flashedOctopuses = new Set<string>();
    for (let i = 0; i < input.length; i++) {
      for (let j= 0; j < input[i].length; j++) {
        const current = input[i][j];
        if (!flashedOctopuses.has(`${i},${j}`)) {
          const newValue = current + 1;
          if (newValue > 9) {
            flashCount += flashOctopus(input, j, i, flashedOctopuses);
          } else {
            input[i][j] = newValue;
          }
        }
      }
    }
  }
  return flashCount;
} 

const partTwo = (input: number[][]) => {
  let flashCount = 0;
  let step;
  let allSynchronized = false
  for(step = 1; !allSynchronized; step++) {
    const flashedOctopuses = new Set<string>();
    for (let i = 0; i < input.length; i++) {
      for (let j= 0; j < input[i].length; j++) {
        const current = input[i][j];
        if (!flashedOctopuses.has(`${i},${j}`)) {
          const newValue = current + 1;
          if (newValue > 9) {
            flashCount += flashOctopus(input, j, i, flashedOctopuses);
          } else {
            input[i][j] = newValue;
          }
        }
      }
    }
    allSynchronized = flashedOctopuses.size === input[0].length * input.length;
  } 
  return step - 1;
} 

console.log("====== PART 1 ======")
console.log("Result: ", partOne(inputArray));
console.log("====== PART 2 ======")
console.log("Result: ", partTwo(inputArray));