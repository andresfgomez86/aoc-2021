import { readFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(__dirname, "input.txt").replace("dist", "src");
const inputArray = readFileSync(filePath).toString().split("\n").map(value => parseInt(value));

const partOne = (input: number[]) => {
  let previousDepth = 0;
  const result = input.reduce((count, value, index) => {
    let newCount = count;
    if (value > previousDepth && index > 0) {
      newCount++;
    }
    previousDepth = value;
    return newCount;
  }, 0);
  return result;
}

const partTwo = (input: number[]) => {
  let count = 0;
  let previousWindow = 0;
  for (let i = 0; i < input.length - 2; i++) {
    const windowSum = input[i] + input[i+1] + input[i+2];
    if (windowSum > previousWindow && i > 0) {
      count++;
    }
    previousWindow = windowSum;
  }
  return count;
}

console.log("====== PART 1 ======")
console.log("Result: ", partOne(inputArray));
console.log("====== PART 2 ======")
console.log("Result: ", partTwo(inputArray));