import { readFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(__dirname, "input.txt").replace("dist", "src");
const inputArray = readFileSync(filePath).toString().split("\n");

const getSumArray = (input: string[]) => {
  const sumArray: number[] = [];
  for (const record of input) {
    for (let i = 0; i < record.length; i++) {
      let currentSum = sumArray[i] || 0;
      if (record[i] === "0") {
        currentSum--;
      } else {
        currentSum++
      }
      sumArray[i] = currentSum;
    }
  }
  return sumArray;
}

const partOne = (input: string[]) => {
  const sumArray = getSumArray(input);
  let gamma = "";
  let epsilon = "";
  for (let j = 0; j < sumArray.length; j++) {
    if (sumArray[j] < 0){
      gamma += "0";
      epsilon += "1";
    } else {
      gamma += "1";
      epsilon += "0";
    }
  }
  return parseInt(gamma, 2) * parseInt(epsilon, 2);
} 

const partTwo = (input: string[]) => {
  let pos = 0;
  let oxygenArray = [...input];
  let co2Array = [...input];
  while (oxygenArray.length > 1 || co2Array.length > 1) {
    if (oxygenArray.length > 1) {
      const oxygenSumArray = getSumArray(oxygenArray);
      const commonOxygen = oxygenSumArray[pos] >= 0 ? "1" : "0";
      oxygenArray = oxygenArray.filter((record) => record[pos] === commonOxygen);
    }
    if (co2Array.length > 1) {
      const co2SumArray = getSumArray(co2Array);
      const commonCo2 = co2SumArray[pos] < 0 ? "1" : "0";
      co2Array = co2Array.filter((record) => record[pos] === commonCo2);
    }
    pos++;
  }
  return parseInt(oxygenArray[0], 2) * parseInt(co2Array[0], 2);
} 

console.log("====== PART 1 ======")
console.log("Result: ", partOne(inputArray));
console.log("====== PART 2 ======")
console.log("Result: ", partTwo(inputArray));