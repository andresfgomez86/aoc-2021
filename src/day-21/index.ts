import { readFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(__dirname, "input.txt").replace("dist", "src");
const inputArray = readFileSync(filePath).toString().split("\n");

let boardSize = 10;
let dieValue = 1000;

const rollDie = () => {
  if (dieValue === 1000) {
    dieValue = 1;
  } else {
    dieValue ++;
  }
  return dieValue;
}

const getNewPosition = (current: number, roll: number) => {
  const sum = current + roll;
  const a = Math.floor(sum / boardSize);
  const extra = a * boardSize;
  return sum - extra || 10;
}

const partOne = (input: string[]) => {
  const playersPositions: number[] = input.map(row => parseInt(row.split(": ")[1]));
  const scores: number[] = (new Array(playersPositions.length)).fill(0);
  let rollCount = 0;
  let gameOver = false;
  while (!gameOver) {
    for (const key in playersPositions) {
      const rollSum = rollDie() + rollDie() + rollDie();
      const newPos = getNewPosition(playersPositions[key], rollSum);
      playersPositions[key] = newPos;
      scores[key] += newPos;
      rollCount += 3;
      if (scores[key] >= 1000) {
        gameOver = true;
        break;
      }
    }
  }
  return scores.sort((a,b) => a - b)[0] * rollCount;
}

const memo: { [key: string]: number[] } = {};

const combinations: number[] = [];
for (let first = 1; first <= 3; first++){
  for (let second = 1; second <= 3; second++){
    for (let third = 1; third <= 3; third++){
      const sum = first + second + third;
      combinations[sum] = combinations[sum] ? combinations[sum] + 1 : 1;
    }
  }
}

const play = (positionP1: number, scoreP1: number, positionP2: number, scoreP2: number, p1Turn = true) => {
	if(memo[`${positionP1}, ${scoreP1}, ${positionP2}, ${scoreP2}, ${p1Turn}`] !== undefined) {
		return memo[`${positionP1}, ${scoreP1}, ${positionP2}, ${scoreP2}, ${p1Turn}`];
  }
	if(scoreP1 >= 21){
		memo[`${positionP1}, ${scoreP1}, ${positionP2}, ${scoreP2}, ${p1Turn}`] = [1,0];
		return [1,0];
	}
	if(scoreP2 >= 21){
		memo[`${positionP1}, ${scoreP1}, ${positionP2}, ${scoreP2}, ${p1Turn}`] = [0,1];
		return [0,1];
	}
  let winCount = [0, 0];
  for (let rollSum = 3; rollSum <= 9; rollSum++) {
    let currentWins = [0, 0];
    if (p1Turn) {
      const newPos = getNewPosition(positionP1, rollSum);
      currentWins = play(newPos, scoreP1 + newPos, positionP2, scoreP2, false);
    } else {
      const newPos = getNewPosition(positionP2, rollSum);
      currentWins = play(positionP1, scoreP1, newPos, scoreP2 + newPos, true);
    }
    winCount = [winCount[0] + currentWins[0] * combinations[rollSum], winCount[1] + currentWins[1] * combinations[rollSum]];
  }
	memo[`${positionP1}, ${scoreP1}, ${positionP2}, ${scoreP2}, ${p1Turn}`] = winCount;
  return winCount;
}

const partTwo = (input: string[]) => {
  const playersPositions: number[] = input.map(row => parseInt(row.split(": ")[1]));
  const winCount = play(playersPositions[0], 0, playersPositions[1], 0)
  return Math.max(...winCount);
} 

console.log("====== PART 1 ======")
console.log("Result: ", partOne(inputArray));
console.log("====== PART 2 ======")
console.log("Result: ", partTwo(inputArray));