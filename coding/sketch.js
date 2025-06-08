let coreElements = []
let starDegree = 45
let overallTexture
let meteorLayer;
let meteors = [];
let meteorCount = 50;
let meteorSpeed = 10;
let minLength = 15;
let maxLength = 40;
let minWeight = 0.5;
let maxWeight = 2;
let angleDeg = 145;


// Starry background
let backgroundStars = [];
let numBackgroundStars = 2000;

// Main body rotation
let coreRotation = 0;
let coreRotationSpeed = 0.8; 

// central star
let middleStarSize = 5;
let sizeDirection = -1;       
let starSizeMin = 5;
let starSizeMax = 20;
let starSizeStep = 0.1;    
let starSizeTimer = 1;


function preload() {
	overallTexture = loadImage("assets/Texture.png")
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	meteorLayer = createGraphics(windowWidth, windowHeight);
	angleMode(DEGREES);
	startStarSizeTimer();

	// initialization background
	backgroundStars = [];
	for (let i = 0; i <= numBackgroundStars; i++) {
		backgroundStars.push({
			x: random(width),
			y: random(height),
			r: random(0.5, width / 350),
			baseAlpha: random(120, 255),
			twinkleAmp: random(40, 90),
		});
	}
	

	createMeteors();

	let totalR = width / 6;
	coreElements = new createMutipleCircle(0, 0, totalR);
}

function startStarSizeTimer() {
	starSizeTimer = setInterval(() => {
		middleStarSize += sizeDirection * starSizeStep;
		if (middleStarSize >= starSizeMax) {
			middleStarSize = starSizeMax;
			sizeDirection = -1;
		}
		if (middleStarSize <= starSizeMin) {
			middleStarSize = starSizeMin;
			sizeDirection = 1;
		}
	},30); 
}

function draw() {
	background(0);

	for (let s of backgroundStars) {
		noStroke();
		fill(255); 
		circle(s.x, s.y, s.r);
	}
	
	
	

	// Meteor animation
	meteorLayer.clear();
	for (let m of meteors) {
		m.x += cos(m.angle) * meteorSpeed;
		m.y += sin(145) * meteorSpeed;

		// judging out of bounds
		if (m.x > width + 50 || m.y > height + 50) {
			m.x = random(-width * 0.2, width * 1.2);
			m.y = random(-100, -20);
			m.len = random(minLength, maxLength);
			m.weight = random(minWeight, maxWeight);
			m.angle = radians(angleDeg + random(-5, 5));
		}

		// draw
		meteorLayer.push();
		meteorLayer.translate(m.x, m.y);
		meteorLayer.rotate(m.angle);
		meteorLayer.fill(255, 200);
		meteorLayer.noStroke();
		meteorLayer.ellipse(0, 0, m.weight * 1.5);
		for (let j = 0; j < m.len; j++) {
			let alpha = map(j, 0, m.len, 180, 20);
			let tailW = map(j, 0, m.len, m.weight, 0.2);
			meteorLayer.fill(255, alpha);
			meteorLayer.ellipse(j * 0.3, j, tailW);
		}
		meteorLayer.pop();
	}
	image(meteorLayer, 0, 0);

	// Main body animation
	push();
	translate(width / 2, height / 2);
	coreRotation += coreRotationSpeed;
	rotate(coreRotation);

	coreElements.drawLine();
	coreElements.diverPoint();
	coreElements.randomPoint();
	coreElements.drawTriangle(90);
	coreElements.drawTriangle(-90);
	coreElements.drawMoon();
	coreElements.lineCircle();
	coreElements.decorationCircle();

	pop();


	// Texture
	push();
	translate(width / 2, height / 2);
	rotate(coreRotation); 
	drawStar(-15, 0, middleStarSize, coreRotation);
	pop();
}

function createMeteors() {
	meteors = [];
	for (let i = 0; i < meteorCount; i++) {
		let x = random(width);
		let y = random(height);
		let len = random(minLength, maxLength);
		let weight = random(minWeight, maxWeight);
		let angle = radians(angleDeg + random(-5, 5));
		meteors.push({ x, y, len, weight, angle });
	}
}

// Event reset
function resetAllDynamic() {
	createMeteors();
	for (let s of backgroundStars) {
		s.baseAlpha = random(120, 255);
		s.twinklePhase = random(TWO_PI);
	}
	coreRotation = 0;
}

// windows confit
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	meteorLayer = createGraphics(windowWidth, windowHeight);
	setup();
}

// gradient circle
function drawRadialGradientCircle(x, y, r, innerColor, outerColor) {
	for (let i = r; i > 0; i--) {
		let t = map(i, 0, r, 1, 0);
		let c = lerpColor(outerColor, innerColor, t);
		fill(c);
		noStroke();
		ellipse(x, y, i * 2, i * 2);
	}
}

// draw star by ‘shape’
function drawStar(starX, starY, starSize, changeD) {
	noStroke()
	for (let j = 0; j < 3; j++) {
		let r = map(j, 0, 2, starSize, starSize / 3)
		if (j % 2 !== 0) {
			fill(0)
		} else {
			fill(255)
		}
		beginShape()
		for (let i = 0; i <= 8; i++) {
			let a = (i == 0 || i == 4 || i == 8) ? starSize / 3 : 0
			let bigStarX = cos(starDegree * i - 90 - changeD) * (r + a) * 3 / 2 + starX
			let bigStarY = sin(starDegree * i - 90 - changeD) * (r + a) * 3 / 2 + starY
			let circleX = cos(starDegree * i - 90 - changeD) * (starSize + a) * 1.7 + starX
			let circleY = sin(starDegree * i - 90 - changeD) * (starSize + a) * 1.7 + starY
			let smallStarX = cos(starDegree * i - 67.5 - changeD) * r / 3 + starX
			let smallStarY = sin(starDegree * i - 67.5 - changeD) * r / 3 + starY
			vertex(bigStarX, bigStarY)
			vertex(smallStarX, smallStarY)
			if (starSize / 9 < width / 300) {
				circle(circleX, circleY, starSize / 9)
			}
		}
		endShape()
	}
}

// Central composite shape
class createMutipleCircle {
	constructor(centerX, centerY, centerSize) {
		this.x = centerX
		this.y = centerY
		this.size = centerSize
	}
	drawMoon() {
		noStroke()
		for (let j = 0; j < 3; j++) {
			if (j % 2 == 0) {
				fill(0)
			} else {
				fill(255)
			}
			let smallMoon = this.size / 6
			circle(this.x - (this.size / 2 - (this.size - j * smallMoon) / 2), this.y, this.size - j * smallMoon)
		}
	}
	lineCircle() {
		for (let j = 0; j < 360 / 2; j++) {
			let lineCircleX1 = cos(j * 2) * this.size / 2 * 1.32 + this.x;
			let lineCircleX2 = sin(j * 2) * this.size / 2 * 1.32 + this.y;
			if (random() > 0.0176) {
				fill(255);
				circle(lineCircleX1, lineCircleX2, this.size / 100);
			} else {
				fill(255);
				circle(lineCircleX1, lineCircleX2, random(this.size / 25, this.size / 13));
			}
		}
	}
	decorationCircle() {
		push()
		noStroke()
		noFill()
		let zhouSize = this.size * 1.075
		circle(this.x, this.y, zhouSize)
		pop()
		push()
		strokeWeight(this.size / 200)
		stroke(255)
		noFill()
		circle(this.x, this.y, zhouSize * 0.97)
		pop()
		push()
		strokeWeight(this.size / 200)
		stroke(255)
		noFill()
		circle(this.x, this.y, zhouSize * 1.07)
		pop()
		for (let j = 0; j < 360 / 6; j++) {
			let zhouX1 = cos(j * 6) * zhouSize / 1.95 + this.x;
			let zhouY1 = sin(j * 6) * zhouSize / 1.95 + this.y;
			fill(255)
			circle(zhouX1, zhouY1, this.size / 40)
		}
	}
	drawTriangle(d) {
		noFill()
		stroke(255, 100)
		strokeWeight(this.size / 80)
		let sr = (this.size * 1.15) * 2
		let starSize = random(this.size / 4, this.size / 3);
		let points = []
		beginShape();
		for (let j = 0; j < 4; j++) {
			let sx1 = cos(120 * j - d) * (sr / 2) + this.x;
			let sy1 = sin(120 * j - d) * (sr / 2) + this.y;
			if (j < 3) {
				points.push(createVector(sx1, sy1));
			}
			vertex(sx1, sy1);
			//gradient circle
			push();
			if (d < 0) {
				let innerColor = color(255, 255, 255, 255);
				let outerColor = color(0, 0, 0, 255);
				for (let j = 0; j < 6; j++) {
					drawRadialGradientCircle(sx1, sy1, random(starSize / (j + 1) / 2 * 1.8), innerColor, outerColor);
				}
			} else {
				let innerColor1 = color(0, 0, 0, 150);
				let outerColor1 = color(255, 255, 255,);
				for (let j = 0; j < 6; j++) {
					drawRadialGradientCircle(sx1, sy1, random(starSize / (j + 1) / 2 * 1.8), innerColor1, outerColor1);
				}
			}
			pop();
		}
		endShape()
		push()
		blendMode(LIGHTEST)
		for (let pt of points) {
			drawStar(pt.x, pt.y, random(starSize / 5, starSize / 4), random(360))
		}
		pop()
	}
	drawLine() {
		let drawLineDegree = 45
		for (let j = 0; j < 8; j++) {
			for (let i = 0; i < 6; i++) {
				let b = random(0, 35)
				push()
				strokeWeight(this.size / 200)
				stroke(255, 200)
				let x1 = cos(drawLineDegree * j - 67.5 - i * random(2.5)) * this.size * random(2, 3) + this.x
				let y1 = sin(drawLineDegree * j - 67.5 - i * random(2.5)) * this.size * random(2, 3) + this.y
				line(this.x, this.y, x1, y1)
				pop()
			}
		}
		push()
		fill(0)
		noStroke()
		circle(this.x, this.y, this.size * 1.15)
		pop()
	}
	diverPoint() {
		for (let j = 0; j < 360; j++) {
			for (let i = 0; i < 6; i++) {
				let c = map(i, 0, 5, 50, 25)
				push()
				noStroke()
				fill(255)
				let pointR = this.size / 2.2
				let x1 = cos(j * 3) * pointR / 1.3 * (4 - i / 10) + this.x
				let y1 = sin(j * 3) * pointR / 1.3 * (4 - i / 10) + this.y
				circle(x1, y1, pointR / c)
				pop()
			}
		}
	}
	randomPoint() {
		push()
		fill(255, 50)
		for (let j = 1; j < 100; j++) {
			for (let i = 0; i < 360; i += j / 20) {
				let dianR = map(j, 1, 100, this.size * 2.34 / 2, this.size / 2);
				let r = random(dianR, this.size * 2.34 / 2);
				let angle = random(0, i * 360 - j);
				let dianX = cos(angle) * r + this.x;
				let dianY = sin(angle) * r + this.y;
				noStroke();
				circle(dianX, dianY, random(this.size / 200, this.size / 40));
			}
		}
		pop()
	}
}
