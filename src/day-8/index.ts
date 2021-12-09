import { readFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(__dirname, "input.txt").replace("dist", "src");
const inputArray = readFileSync(filePath).toString().split("\n");

const partOne = (input: string[]) => {
  let counter = 0;
  const validLengths = [2, 3, 4, 7];
  for (const entry of input) {
    const digits = entry.split(" | ")[1].split(" ")
    for (const digit of digits) {
      if (validLengths.includes(digit.length)){
        counter++;
      }
    }
  }
  return counter;
} 

const partTwo = (input: string[]) => {
  const numbers = new Array(10).fill("");
  let result = 0;
  for (const entry of input) {
    const patternList = entry.split(" | ")[0].trim().split(" ");
    numbers[1] = patternList.find(pattern => pattern.length === 2)!; 
    numbers[4] = patternList.find(pattern => pattern.length === 4)!; 
    numbers[7] = patternList.find(pattern => pattern.length === 3)!; 
    numbers[8] = patternList.find(pattern => pattern.length === 7)!;
    numbers[9] = patternList.find(pattern => pattern.length === 6 && getCoincidences(pattern, numbers[4]) === 4)!;
    numbers[0] = patternList.find(pattern => pattern.length === 6 && pattern !== numbers[9] && getCoincidences(pattern, numbers[7]) === 3)!;
    numbers[6] = patternList.find(pattern => pattern.length === 6 && pattern !== numbers[9] && pattern !== numbers[0])!;
    numbers[5] = patternList.find(pattern => pattern.length === 5 && getCoincidences(pattern, numbers[6]) === 5)!;
    numbers[3] = patternList.find(pattern => pattern.length === 5 && pattern !== numbers[5] && getCoincidences(pattern, numbers[7]) === 3)!;
    numbers[2] = patternList.find(pattern => pattern.length === 5 && pattern !== numbers[3] && pattern !== numbers[5])!;
    
    const digits = entry.split(" | ")[1].trim().split(" ");
    const value = digits.reduce((accum, digit) => {
      const found = numbers.findIndex(pattern => pattern.length === digit.length && getCoincidences(pattern, digit) === pattern.length);
      return accum + found;
    }, "");
    result += parseInt(value);
  }
  return result;
} 

const getCoincidences = (pattern1: string, pattern2: string) => {
  let count = 0;
  for (let i = 0; i < pattern1.length; i++) {
    if (pattern2.includes(pattern1[i])) {
      count++;
    }
  }
  return count;
}

console.log("====== PART 1 ======")
console.log("Result: ", partOne(inputArray));
console.log("====== PART 2 ======")
console.log("Result: ", partTwo(inputArray));