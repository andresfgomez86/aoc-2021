import { readFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(__dirname, "input.txt").replace("dist", "src");
const inputArray = readFileSync(filePath).toString().split("\n");

const findRepeated = (input: string[], countDiagonals = false) => {
  const matrix: number[][] = [];
  const repeated = new Set();
  for (const line of input) {
    const [p1, p2] = line.trim().split(" -> ");
    const [y1, x1] = p1.split(",").map((value: string) => parseInt(value));
    const [y2, x2] = p2.split(",").map((value: string) => parseInt(value));
    if(x1 === x2) {
      const lower = Math.min(y1, y2);
      const higher = Math.max(y1, y2);
      for (let i = lower; i <= higher; i++) {
        matrix[x1] ??= [];
        matrix[x1][i] ??= 0;
        matrix[x1][i]++;
        if (matrix[x1][i] > 1) {
          repeated.add(`${x1},${i}`);
        }
      }
    } else if (y1 === y2) {
      const lower = Math.min(x1, x2);
      const higher = Math.max(x1, x2);
      for (let i = lower; i <= higher; i++) {
        matrix[i] ??= [];
        matrix[i][y1] ??= 0;
        matrix[i][y1]++;
        if (matrix[i][y1] > 1) {
          repeated.add(`${i},${y1}`);
        }
      }
    } else if (countDiagonals) {
      const lowerX = Math.min(x1, x2);
      const higherX = Math.max(x1, x2);
      const lowerY = Math.min(y1, y2);
      const higherY = Math.max(y1, y2);
      const xDiff = higherX-lowerX;
      const yDiff = higherY-lowerY;
      const xIcrement = x2 >= x1;
      const yIcrement = y2 >= y1;
      if (xDiff === yDiff) {
        let xPos = x1;
        let yPos = y1;
        for (let i = 0; i <= xDiff; i++) {
          matrix[xPos] ??= [];
          matrix[xPos][yPos] ??= 0;
          matrix[xPos][yPos]++;
          if (matrix[xPos][yPos] > 1) {
            repeated.add(`${xPos},${yPos}`);
          }
          if (xIcrement) {
            xPos++;
          } else {
            xPos--;
          };
          if (yIcrement) {
            yPos++;
          } else {
            yPos--;
          };
        }
      }
    }
  }
  return repeated;
}

const partOne = (input: string[]) => {
  return findRepeated(input).size;
} 

const partTwo = (input: any) => {
  return findRepeated(input, true).size;
} 

console.log("====== PART 1 ======")
console.log("Result: ", partOne(inputArray));
console.log("====== PART 2 ======")
console.log("Result: ", partTwo(inputArray));