/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  //create an obj to keep track of previous locations
  var locObj = {}
  //create a count var
  var count = 0;
  //create a new Board with n
  var board = new Board({n:n});
  //create an innerFunc that loops input (row)
  function loopRecurse (row){
    var fullRow = board.get(row);
    //inside the function create a loop to n
    for (var column = 0; column < n; column++){
      //if row + 1, column 3 ===1
      if(row+1 < n) {
        if (board.get(row+1)[fullRow.length-1] === 1) {
          board.togglePiece(row+1, fullRow.length-1)
        }
      }
      //toggle piece at row, i
      //check our obj to see if we already placed a piece on the row
        //Untoggle previous pieces
        var compare = locObj[row];
        if (compare) {
          var rowCompare = compare[0]
          var colCompare = compare[1]
          if (board.get(rowCompare)[colCompare] === 1){
            board.togglePiece(rowCompare, colCompare);
          }
        }
      board.togglePiece(row, column);
      //check for colColision
      if (board.hasColConflictAt(column) || board.hasRowConflictAt(row)) {
        //if colColision True
        //untoggle piece, continue
        board.togglePiece(row, column);
        continue;
      } else {
        //if colColision False
        //if row+1 > n
        //count++ continue
        if (row+1 === n){
          board.togglePiece(row, column)
          count++;
          continue;
        }
        //call inneFunc with (row+1)
        //add the successfully placed piece to out obj
        locObj[row] = [row, column]
        loopRecurse(row+1);
      }
    }
  }
  console.log(board)
  var solution = board; //fixme

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};
  // // input => n (creates an n*n board)
  // //output => n*n size board with n pieces on it. no conflicts d
  // var board = new Board({'n': n});
  // //put a 1 at 0,0
  // board.togglePiece(0,0);
  // var innerFunction = function (row, col) {
  //   var currentRow = row;
  //   var currentCol = col;
  //   board.togglePiece(currentRow, currentCol);
  //   if (currentRow === board.get(currentRow).length - 1 && currentCol === board.get(currentRow).length - 1) {
  //     return;
  //   }
  //   //put a 1 at 0,0++
  //   if (board.hasRowConflictAt(currentRow) || board.hasColConflictAt(currentCol)) {
  //     board.togglePiece(currentRow, currentCol);
  //     if (currentCol === board.get(currentRow).length -1) {
  //       currentRow++;
  //       currentCol = 0;
  //       innerFunction(currentRow, currentCol);
  //     } else {
  //       innerFunction(currentRow, ++currentCol);
  //     }
  //   }
  //   // if currentcol equals board.lenght => add one to row, reset col to 0
  //   //check for conflicts
  //   //if there is a conflict, put a 1 at 0++,current
  //   return board;
  // }
  // //Search through the board for existing 1s
  // //log the last location incountered.
  // //pass in that location on the next call
  // // innerFunction(0,1)

  // var rounds = 1;
  // while (rounds < n) {
  //   var startPos = this.findLastPos(board);
  //   innerFunction(...startPos);
  //   rounds++;
  // }

window.findLastPos = function(board) {
  var startPos = [];
  for (var rowCheck = 0; rowCheck < board.get(0).length; rowCheck++) {
    for (var loc = 0; loc < board.get(0).length; loc++){
      var currentPos = board.get(rowCheck)[loc];
      if (currentPos === 1)
      startPos = [rowCheck, loc+1];
    }
  }
  return startPos;
}

//if row === key and kay[value] === 1 untoggle keyvalue


// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  //create an obj to keep track of previous locations
  var locObj = {}
  //create a count var
  var count = 0;
  //create a new Board with n
  var board = new Board({n:n});
  //create an innerFunc that loops input (row)
  function loopRecurse (row){
    var fullRow = board.get(row);
    //inside the function create a loop to n
    for (var column = 0; column < n; column++){
      //if row + 1, column 3 ===1
      if(row+1 < n) {
        if (board.get(row+1)[fullRow.length-1] === 1) {
          board.togglePiece(row+1, fullRow.length-1)
        }
      }
      //toggle piece at row, i
      //check our obj to see if we already placed a piece on the row
        //Untoggle previous pieces
        var compare = locObj[row];
        if (compare) {
          var rowCompare = compare[0]
          var colCompare = compare[1]
          if (board.get(rowCompare)[colCompare] === 1){
            board.togglePiece(rowCompare, colCompare);
          }
        }
      board.togglePiece(row, column);
      //check for colColision
      if (board.hasColConflictAt(column) || board.hasRowConflictAt(row)) {
        //if colColision True
        //untoggle piece, continue
        board.togglePiece(row, column);
        continue;
      } else {
        //if colColision False
        //if row+1 > n
        //count++ continue
        if (row+1 === n){
          board.togglePiece(row, column)
          count++;
          continue;
        }
        //call inneFunc with (row+1)
        //add the successfully placed piece to out obj
        locObj[row] = [row, column]
        loopRecurse(row+1);
      }
    }
  }
  loopRecurse(0);
  // return count;
  var solutionCount = count; //fixme

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
