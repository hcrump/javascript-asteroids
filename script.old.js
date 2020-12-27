let ship;
let rock;
let rocks = [];
let score;
const FPS = 60;
const MAX_ROCKS = 10;
const MAX_WIDTH = 480;
const MAX_HEIGHT = 480;
const MIN_SPEED_X = 1;
const MIN_SPEED_Y = 1;
const MAX_SPEED_X = 10;
const MAX_SPEED_Y = 10;
const SPEED_COEF = 0.1;
let rightPressed = false;
let leftPressed = false;
let upPressed = false;
let downPressed = false;

function startGame() {
	// generateRocks(1, MAX_ROCKS);
	makeShip();
	console.log(rocks[0]);

	score = new component("30px", "Arial", "black", 280, 40, "text");
	myGameArea.start();
}

let myGameArea = {
	canvas: document.createElement("canvas"),
	start: function () {
		this.canvas.width = MAX_WIDTH;
		this.canvas.height = MAX_HEIGHT;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.canvas.style =
			"position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; margin: auto; border:2px solid blue";

		this.interval = setInterval(updateGameArea, 1000 / FPS);
		window.addEventListener("keydown", keyDownHandler, false);
		window.addEventListener("keyup", keyUpHandler, false);
	},
	clear: function () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
};

function component(width, height, color, x, y, type = "rock", speedX = 0, speedY = 0) {
	this.type = type;
	this.score = 0;
	this.width = width;
	this.height = height;
	this.color = color;
	this.speedX = speedX;
	this.speedY = speedY;
	this.speed = 0;
	this.x = x;
	this.y = y;
	this.angle = 0;
	this.moveAngle = 0;

	// careful. the fillrect x,y is based on either the canvas 0,0 or if you use a
	// ctx.translate to set the origin to somewhere, like this.x. Time for Seppuku!
	this.update = () => {
		ctx = myGameArea.context;
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		ctx.fillStyle = this.color;
		ctx.fillRect(this.width / -2, this.height / -2, this.width, this.height);
		ctx.restore();
		console.log(this.x, this.height);
	};
	this.bounds = () => {
		if (this.x < 0 - this.width) {
			this.x = MAX_WIDTH;
		}
		if (this.x > MAX_WIDTH) {
			this.x = 0;
		}
		if (this.y < 0 - this.height) {
			this.y = MAX_HEIGHT;
		}
		if (this.y > MAX_HEIGHT) {
			this.y = 0;
		}
	};
	this.setMoveAngle = () => {
		if (this.type == "ship") {
			if (leftPressed) {
				// console.log("leftPressed");
				this.moveAngle -= 1 % 360;
			} else if (rightPressed) {
				// console.log("rightPressed");
				this.moveAngle += 1 % 360;
			}
			if (upPressed) {
				// console.log("upPressed");
				this.speed = 1;
			} else if (downPressed) {
				// console.log("downPressed");
				this.speed = -1;
			}
		}
	};
	this.newPos = () => {
		if (leftPressed) {
			// console.log("leftPressed");
			this.moveAngle = -1;
		} else if (rightPressed) {
			// console.log("rightPressed");
			this.moveAngle = 1;
		}
		if (upPressed) {
			// console.log("upPressed");
			this.speed = 1;
		} else if (downPressed) {
			// console.log("downPressed");
			this.speed = -1;
		}

		this.angle += (this.moveAngle * Math.PI) / 180;

		this.x += this.speed * Math.sin(this.angle);
		this.y -= this.speed * Math.cos(this.angle);
		this.moveAngle = 0;
	};
}

function updateGameArea() {
	myGameArea.clear();
	updateRocks();
}

function updateRocks() {
	for (let i = 0; i < rocks.length; i++) {
		rocks[i].update();
		rocks[i].newPos();
		rocks[i].bounds();
	}
}

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function makeShip() {
	rocks.push(new component(50, 50, "green", MAX_WIDTH / 2, MAX_HEIGHT / 2, "ship", 0, 0));
}

function generateRocks(min, max) {
	let num = getRandomIntInclusive(min, max);
	console.log("generated", num, "rocks");
	for (let i = 0; i < num; i++) {
		let randX = getRandomIntInclusive(10, MAX_WIDTH - 10);
		let randY = getRandomIntInclusive(10, MAX_HEIGHT - 10);
		let length = getRandomIntInclusive(10, 50);
		let dirX = Math.random() < 0.5 ? -1 : 1;
		let dirY = Math.random() < 0.5 ? -1 : 1;
		let speedX = getRandomIntInclusive(MIN_SPEED_X, MAX_SPEED_X) * dirX * SPEED_COEF;
		let speedY = getRandomIntInclusive(MIN_SPEED_Y, MAX_SPEED_Y) * dirY * SPEED_COEF;
		console.log("speedX:", speedX, "speedY", speedY);
		rocks.push(new component(length, length, "red", randX, randY, "rock", speedX, speedY));
	}
}
function keyUpHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = false;
	} else if (e.keyCode == 37) {
		leftPressed = false;
	}
	if (e.keyCode == 40) {
		downPressed = false;
	} else if (e.keyCode == 38) {
		upPressed = false;
	}
}
function keyDownHandler(e) {
	if (e.keyCode == 39) {
		rightPressed = true;
	} else if (e.keyCode == 37) {
		leftPressed = true;
	}
	if (e.keyCode == 40) {
		downPressed = true;
	} else if (e.keyCode == 38) {
		upPressed = true;
	}
}

startGame();
