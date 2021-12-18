import { readFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(__dirname, "input.txt").replace("dist", "src");
const inputArray = readFileSync(filePath).toString().split(": ")[1];

const tryVelocity = (xVel: number, yVel: number, minX: number, maxX: number, minY: number, maxY: number): number[] => {
  let x = 0;
  let y = 0;
  let maxHeight = 0;
  let currentXVel = xVel;
  let currentYVel = yVel;

  while(true) {
    x += currentXVel;
    y += currentYVel;

    if (y >= maxHeight) {
      maxHeight = y;
    }

    if (x >= minX && x <= maxX && y >= minY && y <= maxY) {
      return [maxHeight];
    }

    if (x > maxX || y < minY) {
      return []
    }

    if (currentXVel > 0) {
      currentXVel--;
    }
    currentYVel--;
  }
}

const partOne = (input: string) => {
  const [xData, yData] = input.split(", ").map(data => data.split("=")[1]);
  const [minX, maxX] = xData.split("..").map(value => parseInt(value));
  const [minY, maxY] = yData.split("..").map(value => parseInt(value));
  const maxHeights: number[] = [];
  for (let xVel = 1; xVel <= maxX; xVel++) {
    for (let yVel = minY; yVel <= 1000; yVel++) {
      maxHeights.push(...tryVelocity(xVel, yVel, minX, maxX, minY, maxY));
    }
  }

  return maxHeights.sort((a, b) => b - a)[0];
} 

const partTwo = (input: string) => {
  const [xData, yData] = input.split(", ").map(data => data.split("=")[1]);
  const [minX, maxX] = xData.split("..").map(value => parseInt(value));
  const [minY, maxY] = yData.split("..").map(value => parseInt(value));
  const maxHeights: number[] = [];
  for (let xVel = 1; xVel <= maxX; xVel++) {
    for (let yVel = minY; yVel <= 1000; yVel++) {
      maxHeights.push(...tryVelocity(xVel, yVel, minX, maxX, minY, maxY));
    }
  }

  return maxHeights.length;
} 

console.log("====== PART 1 ======")
console.log("Result: ", partOne(inputArray));
console.log("====== PART 2 ======")
console.log("Result: ", partTwo(inputArray));