//**********************************************//
var model = {
  
  width: Math.floor(document.getElementById('content-wrapper').clientWidth / 35),
	height: Math.floor(document.getElementById('content-wrapper').clientWidth / 35),
	minesNum: 10,
	mineLocations: [], 
  generateMines: function() {
    	locations = [];
    	for (let i = 0; i < this.width*this.height-1; i++ ) {
    		locations.push(i);
    	}
    	for (let m = 0; m < this.minesNum; m++) {
    		locIndex = Math.floor(Math.random() * (locations.length));
    		model.mineLocations.push(locations[locIndex]);
    		locations.splice(locIndex,1);  
    	}
  },
	idToCoord: function(id) {
		var x = Math.floor(id / this.width);
		var y = id - (x * this.width);
		return [x,y];
	},
	listNeighborMines: function(id) {
		var coord = this.idToCoord(id);
		var x = coord[0];
		var y = coord[1];
		var legalNeighbors = [];
		var neighbors = [
							[x-1, y-1],[x-1, y],[x-1, y+1],
							[x, y-1],           [x, y+1],
							[x+1, y-1],[x+1, y],[x+1,y+1]
						];
		for (i = 0; i < neighbors.length; i++){
			if (neighbors[i][0] >= 0 && neighbors[i][1] >= 0 && neighbors[i][0] <= model.height - 1 && neighbors[i][1] <= model.width -1 ) {
				locId = neighbors[i][0]*model.width + neighbors[i][1];
				legalNeighbors.push(locId);
			}
		}	
		return legalNeighbors;
	},

	countNeighborMines: function(guessId) {
		count = 0;
		legalNeighbors = this.listNeighborMines(guessId);
		for (i = 0; i < legalNeighbors.length; i++){
			if (model.mineLocations.indexOf(legalNeighbors[i]) >= 0) {
			count++;
			}
		}
		return count;			
	}
};

var view = {
	createOverlay: function() {
		var overlay = document.getElementById("overlay");
		overlay.style.display = "inline-block";
	},
	showTimer: function() {
			seconds++;
			document.getElementById("timer").innerHTML = seconds;
		},
	generateBoardView: function () {
		var	 gameBoard = document.getElementById("board");
    for (let x = 0; x < model.height; x++) {
      var row = document.createElement("tr");
      gameBoard.appendChild(row);
      for (let y = 0; y < model.width; y++) {
        var td = document.createElement("td");
        var id = x*model.width + y;
        td.id = id;
        row.appendChild(td);
      }
    }

	},
	gameOver: function() {
			for (let i = 0; i < model.mineLocations.length; i++) {
				var mines = document.getElementById(model.mineLocations[i]);
				while (mines.hasChildNodes()) {
					mines.removeChild(mines.childNodes[0]);
				}
				mineImg = document.createElement("img");
				mineImg.src = "bombi.jpg";
				mineImg.width = "30";
				mineImg.height = "30";
				mines.appendChild(mineImg);
				mines.childNodes[0].setAttribute("pointer-events", "none");


			}
			alert("BOOM!! MUERTO...!!!  ADIOS..!!!");
			clearInterval(showTimerView);
			view.createOverlay();
	},
	gameWin: function() {
		//console.log("You WIN");
		alert("YEAH!! FELICIDADES...!!! CHELAS..!!!");
		clearInterval(showTimerView);
		view.createOverlay();
	},

	revealCell: function(loc, val) {
		var cellOpen = document.getElementById(loc);
		cellOpen.textContent = val;
		cellOpen.classList.add("clicked");
	},
  mark: function(event) {
		event.preventDefault();
		event.stopPropagation();
		if (event.target.classList.contains("flagged")) {
			
			event.target.parentNode.classList.remove("marked","clicked");
	 		var parent = event.target.parentNode;
	 		while (parent.hasChildNodes()) {
	 			parent.removeChild(parent.childNodes[0]);			
	 		}
	 		
		} else {
			event.target.classList.remove("clicked");
			event.target.classList.add("marked");
			var flagImg = document.createElement("img");
			flagImg.src = "bombi.jpg";
			flagImg.width = "30";
			flagImg.height = "30";
			flagImg.classList.add("flagged");
			event.target.appendChild(flagImg);
		}
		return false;		
	},
	reveal: function(event) {
		controller.revealUnopen(event.target.id);	
	},
};


var controller = {
	safeGuess: 0,
	revealUnopen: function(cell) {
		cellInt = parseInt(cell);
		if (document.getElementById(cell) && !document.getElementById(cellInt).classList.contains("clicked")) {
			if (model.mineLocations.indexOf(cellInt) >= 0) {
				view.gameOver();
			}	else if (document.getElementById(cell).classList.length == 0) {
				var x = model.countNeighborMines(cell);
				view.revealCell(cell,x);
				controller.safeGuess++;
				if (controller.safeGuess == 1) {
					showTimerView = setInterval(view.showTimer, 1000);
				}
				document.getElementById("counter").innerHTML = (model.width * model.height - model.minesNum) - controller.safeGuess;
				if (controller.safeGuess == (model.width*model.height - model.minesNum)) {
					view.gameWin();
				}	
				if (x==0){
					var neighbors = model.listNeighborMines(cell);
					for (let i = 0; i < neighbors.length; i++) {
						if (document.getElementById(neighbors[i]).classList.length == 0) {
						controller.revealUnopen(neighbors[i]);	
						}
					}	
				}

			}
		}			
	}
	};

var showTimerView;
var seconds = 0;

function init() {
	seconds = 0;
	document.getElementById("counter").innerHTML = model.width * model.height - model.minesNum;
	var boardTable = document.getElementById("board");
	boardTable.innerHTML = "";
	var overlay = document.getElementById("overlay");
	overlay.style.backgroundColor = "red";
	overlay.style.height = "\"" + document.getElementById("board").clientHeight + "\"";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.bottom = 0;
  overlay.style.right = 0;
  overlay.style.position ="absolute";
  overlay.style.opacity = "0.5";
  overlay.style.display = "none";

	view.generateBoardView();
	model.mineLocations = [];
	model.generateMines();
	controller.safeGuess = 0;
	document.getElementById("timer").innerHTML = seconds;
	var resetbutton = document.getElementById("reset-btn");
	resetbutton.addEventListener("click", init);
	for (let i = 0; i < model.width*model.height; i++) {
		var cell = document.getElementById(i);
    cell.addEventListener("mouseup", cellClicked);

    function cellClicked(event) {
    	event.preventDefault();
    	if (event.which === 3 || event.button === 2) {
    		view.mark(event);
    		return false;
    	} else if (event.button === 0) {
    		view.reveal(event);
    		return false;
    	}
    }
	}
}

window.onload = init;