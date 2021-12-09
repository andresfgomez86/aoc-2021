import { readFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(__dirname, "input.txt").replace("dist", "src");
const inputArray = readFileSync(filePath).toString().split("\n");

const visited = new Set();

const findLowPoints = (input: string[]) => {
  const lowPoints: {x: number, y: number}[] = [];
  let risk = 0;
  for (let i = 0; i < input.length; i++) {
    const row = input[i];
    const prevRow = input[i - 1];
    const nextRow = input[i + 1];
    for (let j = 0; j < row.length; j++) {
      const current = parseInt(row[j]);
      const up = prevRow ? parseInt(prevRow[j]) : 10;
      const down = nextRow ? parseInt(nextRow[j]) : 10;
      const left = j > 0 ? parseInt(row[j-1]) : 10;
      const right = j < row.length -1 ? parseInt(row[j+1]) : 10;
      if (current < up && current < down && current < left && current < right) {
        risk += current+1;
        lowPoints.push({x: j, y: i});
      }
    }
  }
  return {risk, lowPoints};
};

const exploreBasin = (heightMap: string[], x: number, y: number): number => {
  const current = parseInt(heightMap[y][x]);
  visited.add(`${x},${y}`);
  const up = heightMap[y-1] && heightMap[y-1][x] && parseInt(heightMap[y-1][x]) > current && parseInt(heightMap[y-1][x]) < 9 && !visited.has(`${x},${y-1}`) ? exploreBasin(heightMap, x, y-1) : 0;
  const down = heightMap[y+1] && heightMap[y+1][x] && parseInt(heightMap[y+1][x]) > current && parseInt(heightMap[y+1][x]) < 9 && !visited.has(`${x},${y+1}`) ? exploreBasin(heightMap, x, y+1) : 0;
  const left = heightMap[y][x-1] && parseInt(heightMap[y][x-1]) > current && parseInt(heightMap[y][x-1]) < 9 && !visited.has(`${x-1},${y}`) ? exploreBasin(heightMap, x-1, y) : 0;
  const right = heightMap[y][x+1] && parseInt(heightMap[y][x+1]) > current && parseInt(heightMap[y][x+1]) < 9 && !visited.has(`${x+1},${y}`) ? exploreBasin(heightMap, x+1, y) : 0;
  return 1 + up + down + left + right;
}

const partOne = (input: string[]) => {
  return findLowPoints(input).risk;
}

const partTwo = (input: any) => {
  const lowPoints = findLowPoints(input).lowPoints;
  const sizes: number[] = [];
  for (const point of lowPoints) {
    const value = input[point.y][point.x];
    const size = exploreBasin(input, point.x, point.y);
    sizes.push(size);
  }
  const sortedSizes = sizes.sort((a, b) => {
    return b - a;
  });
  return sortedSizes[0] * sortedSizes[1] * sortedSizes[2];
} 

console.log("====== PART 1 ======")
console.log("Result: ", partOne(inputArray));
console.log("====== PART 2 ======")
console.log("Result: ", partTwo(inputArray));