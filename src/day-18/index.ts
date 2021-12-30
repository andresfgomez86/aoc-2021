import { readFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(__dirname, "input.txt").replace("dist", "src");
const inputArray = readFileSync(filePath).toString().split("\n");

const OPEN = "[";
const CLOSE = "]";
const COMMA = ",";

const addSnails = (a: string, b: string): string[] => {
  const sum = `[${a},${b}]`;
  return sum.split("");
}

const getRightNumberIndex = (array: string[], index: number) => {
  for (let i = index + 1; i < array.length; i++) {
    //@ts-ignore
    if (!isNaN(array[i])) {
      return i;
    }
  }
  return -1;
}

const getLeftNumberIndex = (array: string[], index: number) => {
  let lastIndex  = -1;
  for (let i = 0; i < index; i++) {
    //@ts-ignore
    if (!isNaN(array[i])) {
      lastIndex = i;
    }
  }
  return lastIndex;
}

const reduce = (snailNumber: string[]) => {
  const sum = [...snailNumber];
  let isFirst = true;
  let wasReduced = false;
  while (isFirst || wasReduced) {
    let level = 0;
    let explodeIndex = -1;
    let splitIndex = -1;
    isFirst = false;
    wasReduced = false;
    for (let i = 0; i < sum.length; i++) {
      const element = sum[i];
      if (element === OPEN) {
        level++;
        continue;
      }
      if (element === CLOSE) {
        level--;
        continue;
      }
      if (element === COMMA) {
        continue;
      }
      const num = parseInt(element)
      if (level === 5) {
        explodeIndex = i;
        break;
      }

      // @ts-ignore
      if (splitIndex === -1 && !isNaN(element) && parseInt(element) > 9) {
        splitIndex = i;
      }
    }
    if (explodeIndex > -1) {
      const a = sum[explodeIndex];
      const b = sum[explodeIndex + 2];

      const leftIndex = getLeftNumberIndex(sum, explodeIndex);
      const rightIndex = getRightNumberIndex(sum, explodeIndex + 2);

      if (leftIndex > -1) {
        sum[leftIndex] = `${parseInt(sum[leftIndex]) + parseInt(a)}`;
      }

      if (rightIndex > -1) {
        sum[rightIndex] = `${parseInt(sum[rightIndex]) + parseInt(b)}`;
      }

      sum.splice(explodeIndex - 1, 5, "0");

      wasReduced = true;
      continue;
    }
    if (splitIndex > -1) {
      const elementToSplit = parseInt(sum[splitIndex]);
      const a = `${Math.floor(elementToSplit / 2)}`;
      const b = `${Math.ceil(elementToSplit / 2)}`;

      sum.splice(splitIndex, 1, OPEN, a, COMMA, b, CLOSE);
      wasReduced = true
    }
  }
  return sum;
}

const getMagnitude = (snailNumber: string[]) => {
  const num = [...snailNumber];
  while (num.includes(CLOSE)) {
    const firstClose = num.indexOf(CLOSE);
    const pairOpen = num.lastIndexOf(OPEN, firstClose);
    let a = parseInt(num[pairOpen + 1]);
    let b = parseInt(num[firstClose - 1]);

    const currentMagnitude = 3 * a + 2 * b;

    num.splice(pairOpen, 5, `${currentMagnitude}`)
  }
  return parseInt(num[0]);
}

const partOne = (input: string[]) => {
  let current = input[0];
  for (let i = 1; i < input.length; i++) {
    const nextNumber = input[i];
    const sum = addSnails(current, nextNumber);
    current = reduce(sum).join("");
  }
  return getMagnitude(current.split(""));
}

const partTwo = (input: string[]) => {
  const combinations = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = i + 1; j < input.length; j++) {
      combinations.push([input[i], input[j]]);
    }
  }
  
  let maxMagnitude = -Infinity;
  for (let combination of combinations) {
    const sum1 = addSnails(combination[0], combination[1]);
    const result1 = reduce(sum1).join("");
    const magnitude1 = getMagnitude(result1.split(""));
    const sum2 = addSnails(combination[1], combination[0]);
    const result2 = reduce(sum2).join("");
    const magnitude2 = getMagnitude(result2.split(""));

    maxMagnitude = Math.max(magnitude1, magnitude2, maxMagnitude);
  }
  return maxMagnitude;
} 

console.log("====== PART 1 ======")
console.log("Result: ", partOne(inputArray));
console.log("====== PART 2 ======")
console.log("Result: ", partTwo(inputArray));