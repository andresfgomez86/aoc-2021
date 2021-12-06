import { readFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(__dirname, "input.txt").replace("dist", "src");
const inputArray = readFileSync(filePath).toString().split("\n");

const partOne = (input: String[]) => {
  let x = 0;
  let depth = 0;
  const movements: {[key: string]: (number: number) => void} = {
    forward: (number: number) => x += number,
    up: (number: number) => depth -= number,
    down: (number: number) => depth += number
  }
  for (const movement of input) {
    const [action, value] = movement.split(" ");
    movements[action](parseInt(value));
  }
  return x * depth;
} 

const partTwo = (input: String[]) => {
  let aim = 0;
  let x = 0;
  let depth = 0;
  const movements: {[key: string]: (number: number) => void} = {
    forward: (number: number) => {
      x += number;
      depth += aim * number;
    },
    up: (number: number) => {
      aim -= number
    },
    down: (number: number) => {
      aim += number
    }
  }
  for (const movement of input) {
    const [action, value] = movement.split(" ");
    movements[action](parseInt(value));
  }
  return x * depth;
} 

console.log("====== PART 1 ======")
console.log("Result: ", partOne(inputArray));
console.log("====== PART 2 ======")
console.log("Result: ", partTwo(inputArray));