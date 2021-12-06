import { readFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(__dirname, "input.txt").replace("dist", "src");
const inputArray = readFileSync(filePath).toString().split(",").map(fish => parseInt(fish));

const partOne = (input: number[]) => {
  let fishArray: number[] = input;
  for (let i = 0; i < 80; i++) {
    let newFishCount = 0;
    fishArray = fishArray.map(fish => {
      if (fish < 1) {
        newFishCount++;
        return 6;
      } else {
        return fish - 1;
      }
    });
    for (let j = 0; j < newFishCount; j++) {
      fishArray.push(8);
    }
  }
  return fishArray.length;
} 

const partTwo = (input: number[]) => {
  let fishArray: number[] = Array(9).fill(0);
  for (const fish of input) {
    fishArray[fish] ??= 0;
    fishArray[fish]++;
  }
  for (let i = 0; i < 256; i++) {
    const readyToBirth = fishArray.shift() || 0;
    fishArray[6] += readyToBirth;
    fishArray[8] = readyToBirth;
  }
  return fishArray.reduce((count, fish) => count+fish, 0);
} 

console.log("====== PART 1 ======")
console.log("Result: ", partOne(inputArray));
console.log("====== PART 2 ======")
console.log("Result: ", partTwo(inputArray));