var view = { //view object updates screen as required
  displayMessage: function (msg) {
    var messageArea = document.getElementById("message-area");
    messageArea.innerHTML = msg;
  },

  displayHit: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },

  displayMiss: function (location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  },
};

var model = { //handles the logic of the game
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,

  ships: [
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
    { locations: [0, 0, 0], hits: ["", "", ""] },
  ],

  fire: function (guess) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);
      if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("HIT!");
        if (this.isSunk(ship)) {  //check to see if ship is sunk
          view.displayMessage("You sank my battleship!");
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("You missed.");
    return false;
  },

  isSunk: function (ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },
        //mount ships to board locations after verifying its cells are not already taken by other ships
  generateShipLocations: function () {
    var locations;
    for (var i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    }
  },

  generateShip: function () {
      //randomly set direction of ship mount
    var direction = Math.floor(Math.random() * 2);
    var row;
    var col;

    if (direction === 1) {
        //set origin for horizontal mount
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * ((this.boardSize - 3) + 1));
    } else {
        //set origin for vertical mount
      row = Math.floor(Math.random() * ((this.boardSize - 3) + 1));
      col = Math.floor(Math.random() * this.boardSize);
    }

    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
          //locations for horizontal mount
        newShipLocations.push(row + "" + (col + i));
      } else {
          //locations for vertical mount
        newShipLocations.push(row + i + "" + col);
      }
    }
    return newShipLocations;
  },
        //Prevent two or more ships from occupying the same cell
  collision: function (locations) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      for (j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
  },
};

var controller = {
  guesses: 0,

  processGuess: function (guess) {
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage(
          "You sank all my battleships, in " + this.guesses + " guesses."
        );
      }
    }
  },
};

function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

  if (guess === null) {
    alert("Oops, please enter a letter and a number on the board.");
  } else {
    var firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)) {
      alert("Oops, that isn't on the board.");
    } else if (
      row < 0 ||
      row >= model.boardSize ||
      column < 0 ||
      column >= model.boardSize
    ) {
      alert("Oops, that's off the board!");
    } else {
      return row + column;
    }
  }
  return null;
}

function init() {
  var fireButton = document.getElementById("fire-button");
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById("guess-input");
  guessInput.onkeypress = handleKeyPres;

  model.generateShipLocations();
  view.displayMessage("Ready for battle? Enter co-ordinates and press fire button to begin your attack!");
}

function handleFireButton() {
  var guessInput = document.getElementById("guess-input");
  var guess = guessInput.value;
  controller.processGuess(guess);
  guessInput.value = "";
}

function handleKeyPres(e) {
  var fireButton = document.getElementById("fire-button");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}

window.onload = init;