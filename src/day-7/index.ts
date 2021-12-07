import { readFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(__dirname, "input.txt").replace("dist", "src");
const inputArray = readFileSync(filePath).toString().split(",").map(value => parseInt(value));

const getCheapestPosition = (input: number[], costCalculator: (diff: number) => number) => {
  const min = Math.min(...input);
  const max = Math.max(...input);
  const costs: {[key: number]: number} = {};
  for (let i = min; i <= max; i++) {
    for (const crab of input) {
      const lower = Math.min(i, crab);
      const higher = Math.max(i, crab);
      const diff = higher - lower;
      costs[i] ??= 0;
      costs[i] += costCalculator(diff); 
    }
  }
  let cheapest = Infinity;
  for (const key in costs) {
    if(costs[key] <= cheapest) {
      cheapest = costs[key];
    }
  }
  return cheapest;
}

const partOne = (input: number[]) => {
  const calculator = (diff: number) => diff;
  return getCheapestPosition(input, calculator);
} 

const partTwo = (input: any) => {
  const calculator = (diff: number) => (diff * (diff + 1)) / 2;
  return getCheapestPosition(input, calculator);
} 

console.log("====== PART 1 ======")
console.log("Result: ", partOne(inputArray));
console.log("====== PART 2 ======")
console.log("Result: ", partTwo(inputArray));