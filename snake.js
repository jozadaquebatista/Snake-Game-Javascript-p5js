// global variables
let map;
let point;
let food;
let snake;
let events;

let MULTIPLIER;
let WINDOW_WIDTH;
let WINDOW_HEIGHT;

// p5.js functions
function setup() {

	MULTIPLIER = 40;

	map = new Map();
	point = new Point();
	snake = new Snake();

	events = new Events({ player: snake });

	WINDOW_WIDTH = point.width * MULTIPLIER;
	WINDOW_HEIGHT = point.width * MULTIPLIER;

	food = new Food();

	createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);

	for(let i=0; i < 15; i++, snake.eat());

	textFont('Orbitron');
	textSize(32);
}

function draw() {
  background(100,200,0);

  events.handle();

  map.draw();
  food.draw().ifCollisionWith(snake).clear();
  snake.draw();

  fill(0, 244, 63);
  text('Score: ' + '000000000'.slice(0,-Score.value.toString().length).concat(Score.value), 30, 750, 655, 100);
}

// class entities

class Point /* The Point class will be used both for snake and food */
{
	constructor(x = 0, y = 0, width = 20, height = 20)
	{
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.id = Math.round(Math.random() * 999999);
		this.cor = {
			r: (Math.round(Math.random()*1) === 1 ? Math.round(Math.random()*255) : 0),
			g: (Math.round(Math.random()*1) === 1 ? Math.round(Math.random()*255) : 0),
			b: (Math.round(Math.random()*1) === 1 ? Math.round(Math.random()*255) : 0),
		};

		this.parent = null;
		this.child = null;
	}

	draw()
	{
		fill(Math.round(Math.random()*255), Math.round(Math.random()*255), Math.round(Math.random()*255));
		rect(this.x, this.y, this.width, this.height);
	}
}

class Food
{
	constructor()
	{
		this.x = snake.head.width * Math.round(Math.random() * WINDOW_WIDTH / 50);
		this.y = snake.head.height * Math.round(Math.random() * WINDOW_HEIGHT / 50);
		this.width = snake.head.width;
		this.height = snake.head.height;
		this.collided = false;
	}

	draw()
	{
		if(this.collided) this.seed();

		fill(255,200,0);
		rect(this.x, this.y, this.width, this.height);

		return this;
	}

	seed()
	{
		this.x = snake.head.width * Math.round(Math.random() * WINDOW_WIDTH / 50);
		this.y = snake.head.height * Math.round(Math.random() * WINDOW_HEIGHT / 50);

		return this;
	}

	ifCollisionWith(player)
	{
		let hasCollided = Math.abs(this.x - player.head.x) === 0 && Math.abs(this.y - player.head.y) === 0;

		if(hasCollided) this.collided = true;

		return this;
	}

	clear()
	{
		if(this.collided)
		{
			this.seed();
			this.collided = false;
			snake.eat();
			Score.increase();
		}

		return this.collided;
	}
}

class Snake
{
	constructor(point = new Point())
	{
		this.head = point;
		this.axisDirection = { x:false, y:false };
	}

	eat(point = this.head)
	{
		if(point.child) return this.eat(point.child); 

		point.child = new Point();
		point.child.parent = point;

		return food.clear();
	}

	draw(point = this.head)
	{
		//fill(120, 255, 100);
		fill(point.cor.r, point.cor.g, point.cor.b);
		rect(point.x, point.y, point.width, point.height);

		if(point.child) this.draw(point.child);

		if(point.parent)
		{
			// console.log(point.id, '->', this.head.id, point.x, this.head.x, point.y, this.head.y);

			if(Math.abs(point.x - this.head.x) === 0 && Math.abs(point.y - this.head.y) === 0)
			{
				// console.error('COLIDIU CONSIGO MESMO!');
				// setup();

				setTimeout(() => {
					window.location = window.location;
					Score.reset();
				}, 2000);

				throw 'player loose';
			}

			point.x = point.parent.x;
			point.y = point.parent.y;
		}
	}
}

class Map
{
	draw()
	{
		for(let row = 0; row < MULTIPLIER; row++)
		{
			for(let column = 0; column < MULTIPLIER; column++)
			{
				let mapSquareX = point.width * column;
				let mapSquareY = point.height * row;

				fill(15,20,0);
				rect(mapSquareX, mapSquareY, point.width, point.height);
			}
		}
	}
}

class Collision
{
	static detect(objectA, objectB)
	{
		let deltaX = objectA.x - objectB.x;
		let deltaY = objectA.y - objectB.y;

		return deltaX === 0 && deltaY === 0;
	}
}

class Events
{
	constructor(data)
	{
		this.data = data;

		this.input = {
			// UP
			87: () => {
				snake.axisDirection.y = true;

				if(this.data.player.head.y === 0)
				{
					this.data.player.head.y = WINDOW_HEIGHT;
				} else {
					this.data.player.head.y -= this.data.player.head.height;
				}
			},
			// DOWN
			83: () => {
				snake.axisDirection.y = true;

				if(this.data.player.head.y === WINDOW_HEIGHT)
				{
					this.data.player.head.y = 0;
				} else {
					this.data.player.head.y += this.data.player.head.height;
				}
			},
			// LEFT
			65: () => {
				snake.axisDirection.x = true;

				if(this.data.player.head.x === 0)
				{
					this.data.player.head.x = WINDOW_WIDTH;
				} else {
					this.data.player.head.x -= this.data.player.head.width;
				}
			},
			// RIGHT
			68: () => {
				snake.axisDirection.x = true;

				if(this.data.player.head.x === WINDOW_WIDTH)
				{
					this.data.player.head.x = 0;
				} else {
					this.data.player.head.x += this.data.player.head.width;
				}
			},
			// DEFAULT(RIGHT)
			0: () => {
				snake.axisDirection.x = true;

				if(this.data.player.head.x === WINDOW_WIDTH)
				{
					this.data.player.head.x = 0;
				} else {
					this.data.player.head.x += this.data.player.head.width;
				}
			},
		};
	}

	handle()
	{
		let isConfiguredInput = Object.keys(this.input).map(code => Number(code)).some(code => code === keyCode);

		// if(!isConfiguredInput) return;

		keyCode = !isConfiguredInput ? 68 : keyCode;

		snake.axisDirection.x = false;
		snake.axisDirection.y = false;

		try {
			this.input[keyCode]();
		} catch(e) {
			console.error(e.toString());
		}
	}
}

class Score {

	static value = 0;

	static increase()
	{
		Score.value++;
	}

	static reset()
	{
		Score.value = 0;
	}
}
