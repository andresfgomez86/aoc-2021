import { readFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(__dirname, "input.txt").replace("dist", "src");
const inputArray = readFileSync(filePath).toString().split("\n\n");

const getPixelValue = (image: string[], y: number, x: number, defaultPixel: string = ".") => {
  if (image[y] && image[y][x]) {
    return image[y][x];
  }
  return defaultPixel;
}

const partOne = (input: string[], totalTimes = 2) => {
  const algo = input[0];
  let image = input[1].split("\n");
  let litCount = 0;
  let defaultPixel = ".";
  for (let times = 0; times < totalTimes; times++) {
    let emptyRow = "";
    image = image.map(row => `${defaultPixel}${row}${defaultPixel}`);
    for (let i = 0; i < image[0].length; i++) {
      emptyRow += defaultPixel;
    }
    image.unshift(emptyRow);
    image.push(emptyRow);
    const enhanced = image.map(row => row.split(""));
    litCount = 0;
    for (let i = 0; i < image.length; i++) {
      for (let j = 0; j < image[0].length; j++) {
        const up = getPixelValue(image, i - 1, j - 1, defaultPixel) + getPixelValue(image, i - 1, j, defaultPixel) + getPixelValue(image, i - 1, j + 1, defaultPixel);
        const middle = getPixelValue(image, i, j - 1, defaultPixel) + getPixelValue(image, i, j, defaultPixel) + getPixelValue(image, i, j + 1, defaultPixel);
        const down = getPixelValue(image, i + 1, j - 1, defaultPixel) + getPixelValue(image, i + 1, j, defaultPixel) + getPixelValue(image, i + 1, j + 1, defaultPixel);
        const binary = (up + middle + down).replace(/\./g, "0").replace(/\#/g, "1");
        const algoPos = parseInt(binary, 2);
        let pixel = algo[algoPos];
        enhanced[i][j] = pixel;
        if (pixel === "#") {
          litCount++;
        }
      }
    }
    if (times % 2 && algo[algo.length - 1] === ".") {
      defaultPixel = algo[algo.length - 1];
    } else if (!(times % 2) && algo[0] === "#") { 
      defaultPixel = algo[0];
    }
    image = enhanced.map(row => row.join(""));
  }
  return litCount;
} 

const partTwo = (input: string[]) => {
  return partOne(input, 50);
} 

console.log("====== PART 1 ======")
console.log("Result: ", partOne(inputArray));
console.log("====== PART 2 ======")
console.log("Result: ", partTwo(inputArray));