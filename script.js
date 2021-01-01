// Globals
let ship;
let rocks = [];
let missiles = [];
let score;
const FPS = 60;
const MAX_ROCKS = 10;
const MAX_WIDTH = window.innerWidth - 10;
const MAX_HEIGHT = window.innerHeight - 10;
const CENTER_X = MAX_WIDTH / 2;
const CENTER_Y = MAX_HEIGHT / 2;
const MIN_SPEED_X = 1;
const MIN_SPEED_Y = 1;
const MAX_SPEED_X = 10;
const MAX_SPEED_Y = 10;
const MAX_ROCK_SIZE = 50;
const SPEED_COEF = 0.1;
const TURN_COEF = 3;
const SHIP_W = 40;
const SHIP_H = 40;
const MAX_SHIP_SPEED = 4;
const MISSILE_LIFE = 100;
const MISSILE_SPEED_COEF = 7;
const MISSILE_SIZE = 30;
const ship_image = "rocket.svg";
const rock_images = ["rock1.svg", "rock2.svg", "rock3.svg"];
const rock_dir_path = "images/";
const rock_image = "rock1.svg";
const missile_image = "missile.svg";
const flame_image = "flame.svg";
let flame = new Image();
flame.src = flame_image;
let shootCount = 0;
const SHOOT_DELAY = 8;

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

class SpaceThing {
	constructor(image, x, y, h, w, vx = 0, vy = 0, angle = 0, life = 0) {
		this.img = new Image();
		this.img.src = image;
		this.x = x;
		this.y = y;
		this.height = h;
		this.width = w;
		this.vx = vx;
		this.vy = vy;
		this.angle = angle;
		this.speed = 0;
		this.rotation = 0;
		this.life = life;
		this.thrust = false;
		this.radius = this.width / 2;
	}
	draw() {
		let ctx = myGameArea.context;
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		ctx.drawImage(this.img, this.width / -2, this.height / -2, this.width, this.height);
		// ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		ctx.restore();
	}
	update() {
		this.angle += this.rotation;
		this.x += this.vx;
		this.y += this.vy;
		if (this.life > 0) {
			this.life--;
		}
		// console.log("x:", this.x, "y:", this.y);
	}
	// tried using % MAX_WIDTH in update() but js % isn't actually modulus
	// it is remainder and gives negative values, buh.
	bounds() {
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
	}
}

function getSpeed(num1, num2) {
	let x = Math.sqrt(num1 ** 2 + num2 ** 2);
	return x;
}

class SpaceShip extends SpaceThing {
	draw() {
		let ctx = myGameArea.context;
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.angle);
		ctx.drawImage(this.img, this.width / -2, this.height / -2, this.width, this.height);
		// ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		if (this.thrust) {
			ctx.rotate(Math.PI);
			ctx.drawImage(
				flame,
				this.width / -2,
				this.height / -2 - this.height,
				this.width,
				this.height
			);
		}
		ctx.restore();
	}
	update() {
		this.setRotation();
		this.angle += (this.rotation * Math.PI) / 180;
		this.x += this.speed * Math.sin(this.angle);
		this.y -= this.speed * Math.cos(this.angle);
		// console.log(this.speed, this.vx, this.vy);
		// this.speed = getSpeed(this.vx, this.vy);
		this.rotation = 0;
	}
	setRotation() {
		if (state.pressedKeys.left) {
			// console.log("leftPressed");
			this.rotation = -TURN_COEF;
		} else if (state.pressedKeys.right) {
			// console.log("rightPressed");
			this.rotation = TURN_COEF;
		}
		if (state.pressedKeys.up) {
			// console.log("upPressed");
			if (this.speed <= MAX_SHIP_SPEED) {
				this.speed += SPEED_COEF;
			}
			this.thrust = true;
		} else if (state.pressedKeys.down) {
			// console.log("downPressed");
			if (this.speed >= -MAX_SHIP_SPEED) {
				this.speed -= SPEED_COEF;
			}
			this.thrust = true;
		} else {
			this.thrust = false;
		}
		if (state.pressedKeys.spacebar) {
			ship.shoot();
			// state.pressedKeys.spacebar = false;
		}
	}
	shoot() {
		// this.angle += (this.rotation * Math.PI) / 180;
		let mX = ship.x;
		let mY = ship.y;
		let mW = MISSILE_SIZE;
		let mH = MISSILE_SIZE;
		let mVx = ship.vx + Math.sin(ship.angle) * MISSILE_SPEED_COEF;
		let mVy = ship.vy - Math.cos(ship.angle) * MISSILE_SPEED_COEF;
		let mAngle = ship.angle;
		let mLife = MISSILE_LIFE;

		if (shootCount == 0) {
			missiles.push(new SpaceThing(missile_image, mX, mY, mW, mH, mVx, mVy, mAngle, mLife));
			shootCount = SHOOT_DELAY;
		} else {
			shootCount--;
		}
		// state.pressedKeys.spacebar = false; tyring to slow it down.
		// maybe try  acounter if x < 1 shoot
	}
}

function startGame() {
	console.log("startGame()");
	// clearFinishScreen();
	// clearSplashScreen();

	createObjects();
	myGameArea.start();
}
// function clearSplashScreen() {
// 	let splash = document.querySelector("#splash");
// 	splash.style.display = "none";
// }
// function clearFinishScreen() {
// 	let finish = document.querySelector("#finish");
// 	finish.style.display = "none";
// }
// function showFinishScreen() {
// 	let splash = document.querySelector("#finish");
// 	finish.style.display = "block";
// }
// function showSplashScreen() {
// 	let splash = document.querySelector("#splash");
// 	splash.style.display = "block";
// }
function gameOver() {
	// let canvas = myGameArea.canvas;
	// canvas.style.display = "none";
	clearInterval(myGameArea.interval);
	rocks = [];
	ship = "";
	missiles = [];
	startGame();
	// showFinishScreen();
}

function createObjects() {
	createShip();
	createRocks();
}

function createShip() {
	console.log("createShip()");
	ship = new SpaceShip(
		ship_image,
		CENTER_X,
		CENTER_Y,
		// CENTER_X - SHIP_W / 2, //ship x center of screen
		// CENTER_Y - SHIP_H / 2, //ship y center of screen
		SHIP_W, //ship width
		SHIP_H //ship height
	);
}

function createRocks() {
	console.log("createRocks()");
	let randNum = getRandomIntInclusive(1, MAX_ROCKS);
	console.log("generated", randNum, "rocks");
	let excludeRangeXLeft = parseInt(MAX_WIDTH / 3);
	let excludeRangeXRight = parseInt((MAX_WIDTH / 3) * 2);
	let excludeRangeYTop = parseInt(MAX_HEIGHT / 3);
	let excludeRangeYBottom = parseInt((MAX_HEIGHT / 3) * 2);
	let randX;
	let randY;
	for (let i = 0; i < MAX_ROCKS; i++) {
		let found = false;

		// rocks spawn only in left and right 1/3 of screen
		while (!found) {
			randX = getRandomIntInclusive(5, MAX_WIDTH - 5);
			if (randX > excludeRangeXRight || randX < excludeRangeXLeft) {
				found = true;
			}
		}
		// rocks spawn only in top and bottom 1/3 of screen
		found = false;
		while (!found) {
			randY = getRandomIntInclusive(5, MAX_HEIGHT - 5);
			if (randY > excludeRangeYBottom || randY < excludeRangeYTop) {
				found = true;
			}
		}
		let length = getRandomIntInclusive(10, MAX_ROCK_SIZE);

		let [speedX, speedY] = rockSpeed(length);

		let r = rock_dir_path + rock_images[i % rock_images.length];
		let szX = length;
		let szY = length;

		rocks.push(new SpaceThing(r, randX, randY, szX, szY, speedX, speedY));
	}
}

function updateGameArea() {
	// console.log("updateGameArea()");

	myGameArea.clear();
	drawObjects();
	updateObjects();
	processObjects();
}

function updateObjects() {
	ship.update();
	ship.bounds();

	for (let i = 0; i < rocks.length; i++) {
		rocks[i].update();
		rocks[i].bounds();
	}

	for (let i = 0; i < missiles.length; i++) {
		missiles[i].update();
		missiles[i].bounds();
	}
}
function drawObjects() {
	ship.draw();
	drawRocks();
	drawMissiles();
}
function drawRocks() {
	for (let i = 0; i < rocks.length; i++) {
		rocks[i].draw();
	}
}
function drawMissiles() {
	for (let i = 0; i < missiles.length; i++) {
		missiles[i].draw();
	}
}

function processObjects() {
	checkShipCollision();
	checkMissileCollisions();
	cleanUp();
}

function checkShipCollision() {
	for (let i = 0; i < rocks.length; i++) {
		let dist = distance(rocks[i].x, rocks[i].y, ship.x, ship.y);
		if (dist <= rocks[i].radius + ship.radius) {
			rocks.splice(i, 1);
			gameOver();
			return;
		}
	}
}

function checkMissileCollisions() {
	for (let i = 0; i < rocks.length; i++) {
		for (let j = 0; j < missiles.length; j++) {
			let dist = distance(rocks[i].x, rocks[i].y, missiles[j].x, missiles[j].y);
			if (dist <= rocks[i].radius + missiles[j].radius - 10) {
				rocks.splice(i, 1);
				missiles.splice(j, 1);
				return;
			}
		}
	}
}

function cleanItems(index, array1) {
	array1.splice(index, 1);
}

function cleanUp() {
	let i = missiles.length;
	while (i--) {
		if (missiles[i].life <= 0) {
			missiles.splice(i, 1);
		}
	}
}

function keyUpHandler(e) {
	let key = keyMap[e.keyCode];
	state.pressedKeys[key] = false;
}

function keyDownHandler(e) {
	let key = keyMap[e.keyCode];
	state.pressedKeys[key] = true;
}

let state = {
	pressedKeys: {
		left: false,
		right: false,
		up: false,
		down: false,
		spacebar: false,
	},
};

let keyMap = {
	37: "left",
	39: "right",
	38: "up",
	40: "down",
	32: "spacebar",
};

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function rockSpeed(size) {
	let dirX = Math.random() < 0.5 ? -1 : 1;
	let dirY = Math.random() < 0.5 ? -1 : 1;
	let speedX = getRandomIntInclusive(MIN_SPEED_X, MAX_SPEED_X) * dirX * SPEED_COEF;
	let speedY = getRandomIntInclusive(MIN_SPEED_Y, MAX_SPEED_Y) * dirY * SPEED_COEF;
	speedX *= MAX_ROCK_SIZE / size;
	speedY *= MAX_ROCK_SIZE / size;
	return [speedX, speedY];
}
function distance(px, py, qx, qy) {
	return Math.sqrt((px - qx) ** 2 + (py - qy) ** 2);
}
startGame();

// let canvas = document.createElement("canvas");
// document.body.appendChild(canvas);
// let ctx = canvas.getContext("2d");
// let img = new Image();
// img.src = "https://via.placeholder.com/300/09f/fff.png";
// img.src = "rocket.svg";
