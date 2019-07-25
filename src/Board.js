// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var row = this.get(rowIndex);
      //set a count variable to count number of pieces
      var count = 0;
      //loop through the array
      for (var i = 0; i < row.length; i++) {
        //if the count hits 2 return false
        if (row[i] === 1)  {
          count++;
        }
      }
      if (count === 2) {
        return true;
      }
      //otherwise return true
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      // use .rows to access all arrays
      var allRows = this.rows(); // array of arrays
      var boolean = false;
      for (var i = 0; i < allRows.length; i++){
        if (this.hasRowConflictAt(i)) {
          boolean = true;
        }
      }
      return boolean; // fixme
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      // check index at colindex only
      //loop through each row and only check the index at colindex
      var row = this.rows();
      //set a count variable to count number of pieces
      var count = 0;
      //loop through the array
      for (var i = 0; i < row.length; i++) {
        //if the count hits 2 return false
        if (row[i][colIndex] === 1)  {
          count++;
        }
      }
      if (count > 1) {
        return true;
      }
      //otherwise return true
      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      // set a varible with an object
      var colObj = {};
      var board = this.rows();
      // loop through each row
      for (var row = 0; row < board.length; row++) {
        for (var col = 0; col < board[row].length; col++) {
          if (colObj.hasOwnProperty(col)) {
            // create a key with each index with value =+ index value
            colObj[col] += board[row][col];
          } else {
            colObj[col] = board[row][col];
          }
        }
      }
      for (var key in colObj) {
        if (colObj[key] > 1) {
          return true;
        }
      }
      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      // input => a single index in the first row.
      // output => boolean if there are any other 1s on diagonals.
      // checks negative
        // if arg is negative => start at row Math.abs
      var startRow = 0;
      var startCol = majorDiagonalColumnIndexAtFirstRow
      var count = 0;
      if (majorDiagonalColumnIndexAtFirstRow < 0) {
        startRow = Math.abs(majorDiagonalColumnIndexAtFirstRow);
        startCol = 0
      }
      var context = this;
      function innerFunction (row, col) {
        //get the first row.
        var currentRow = context.get(row);
        // base case: when we count 2
        count += currentRow[col];
        if (count > 1) {
          return true;
        }
        //go to the value at single column on the first row.
        //count the number
        if (row < currentRow.length - 1 /*|| col < currentRow.length - 1*/) {
          return innerFunction(++row, ++col);
        }
      }
      return innerFunction(startRow, startCol) || false; // fix me
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var results = [];
      // determine size of the board with .length
      var boardSize = this.rows().length
      //loop "length" number of times and call hasmajordiagonalconflict(i)
      for (var i = 0; i < boardSize; i++) {
        // push results to an array
        results.push(this.hasMajorDiagonalConflictAt(i));
      }
      //loop again but call on i * -1
      for (var j = 0; j < boardSize; j++) {
        // push results to an array
        results.push(this.hasMajorDiagonalConflictAt(-j));
      }
      //return any true
      return results.includes(true);
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var startRow = 0;
      var startCol = minorDiagonalColumnIndexAtFirstRow
      var count = 0;
      var rowLength = this.get(0).length - 1;
      if (startCol > rowLength) {
        startRow = startCol - (rowLength);
        startCol = rowLength;
      }
      var context = this;
      function innerFunction (row, col) {
        //get the first row.
        var currentRow = context.get(row);
        // base case: when we count 2
        count += currentRow[col];
        if (count > 1) {
          return true;
        }
        //go to the value at single column on the first row.
        //count the number
        if (row < currentRow.length - 1 /*|| col < currentRow.length - 1*/) {
          return innerFunction(++row, --col);
        }
      }
      return innerFunction(startRow, startCol) || false; // fix me
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var results = [];
      // determine size of the board with .length
      var boardSize = (this.rows().length - 1) * 2
      //loop "length" number of times and call hasmajordiagonalconflict(i)
      for (var i = 0; i < boardSize; i++) {
        // push results to an array
        results.push(this.hasMinorDiagonalConflictAt(i));
      }
      return results.includes(true);
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
