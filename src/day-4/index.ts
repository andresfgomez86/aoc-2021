import { readFileSync } from "fs";
import { resolve } from "path";

const filePath = resolve(__dirname, "input.txt").replace("dist", "src");
const inputArray = readFileSync(filePath).toString().split("\n");

const getBoards = (input: string[]) => {
  const boards: {rows: Set<string>[], columns: Set<string>[]}[] = [];
  let currentBoard = 0;
  let currentRow = 0;
  for (let i = 0; i < input.length; i++) {
    const row = input[i].trim().replace(/  +/g, ' ');
    if (row === "") {
      currentRow = 0;
      currentBoard++;
      continue;
    }
    const rowNumbers = row.split(" ");
    for (let j = 0; j < rowNumbers.length; j++) {
      const currentNumber = rowNumbers[j];
      // Initialize data structures if not yet created
      boards[currentBoard] = boards[currentBoard] || {rows: [], columns: []};
      boards[currentBoard].rows[currentRow] = boards[currentBoard].rows[currentRow] || new Set();
      boards[currentBoard].columns[j] = boards[currentBoard].columns[j] || new Set();

      // Store number in its column and row
      boards[currentBoard].rows[currentRow].add(currentNumber)
      boards[currentBoard].columns[j].add(currentNumber)
    }
    currentRow++;
  }
  return boards;
}

const partOne = (input: string[]) => {
  const drawArray = input[0].split(",");
  const boards = getBoards(input.slice(2));
  let bingo = false;
  let currentDraw = "";
  let currentBoard = -1;
  for (let i = 0; i < drawArray.length && !bingo; i++) {
    currentBoard = 0;
    currentDraw = drawArray[i];
    for (let j = 0; j < boards.length && !bingo; j++) {
      const board = boards[j];
      for (let k = 0; k < board.rows.length; k++) {
        const row = board.rows[k];
        row.delete(currentDraw);
        if (!row.size){
          bingo = true;
          break;
        }
      }
      for (let k = 0; k < board.columns.length; k++) {
        const column = board.columns[k];
        column.delete(currentDraw);
        if (!column.size){
          bingo = true;
          break;
        }
      }
      if(!bingo) {
        currentBoard++;
      }
    }
  }

  const winningBoard = boards[currentBoard];
  let count = 0;
  for (const row of winningBoard.rows) {
    for (const number of row.values()) {
      count += parseInt(number);
    }
  }
  return count * parseInt(currentDraw);
} 

const partTwo = (input: any) => {
  const drawArray = input[0].split(",");
  const boards = getBoards(input.slice(2));
  let finishedBoards: Set<number> = new Set();
  let draw = "";
  let currentBoard = -1;
  for (let i = 0; i < drawArray.length && finishedBoards.size < boards.length; i++) {
    currentBoard = 0;
    draw = drawArray[i];
    for (let j = 0; j < boards.length && finishedBoards.size < boards.length; j++) {
      if (finishedBoards.has(j)) {
        currentBoard++;
        continue;
      }
      const board = boards[j];
      for (let k = 0; k < board.rows.length; k++) {
        const row = board.rows[k];
        row.delete(draw);
        if (!row.size){
          finishedBoards.add(currentBoard);
          break;
        }
      }
      for (let k = 0; k < board.columns.length; k++) {
        const column = board.columns[k];
        column.delete(draw);
        if (!column.size){
          finishedBoards.add(currentBoard);
          break;
        }
      }
      if(finishedBoards.size < boards.length) {
        currentBoard++;
      }
    }
  }

  const winningBoard = boards[currentBoard];
  let count = 0;
  for (const row of winningBoard.rows) {
    for (const number of row.values()) {
      count += parseInt(number);
    }
  }
  return count * parseInt(draw);
} 

console.log("====== PART 1 ======")
console.log("Result: ", partOne(inputArray));
console.log("====== PART 2 ======")
console.log("Result: ", partTwo(inputArray));