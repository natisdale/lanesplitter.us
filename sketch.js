/**
Author: Nathan Tisdale
File: sketch.js (depends on rider.js, car.js, and road.js)
Description:
  Motorcyclist splitting lanes on highway (updated with Class/Instance)
  Use left and right arrow keys to move
  Press r to ride again after crashing
**/
let cars = []; // list of car objects
let rider;
let horizon;
let road;
let instructions = document.getElementById("instructions");
let gameContainer = document.getElementById("game-container");
let instructionText = { "movement":"Tap, click, or use left and right arrow keys to move",
                        "crash":"Press R or tap crash site to ride again"
};

// Initial rider position is in recommended lane splitting area
function setup() {
  // Calculate available space for canvas
  let header = document.querySelector('header');
  let footer = document.querySelector('footer');
  let headerHeight = header ? header.offsetHeight : 80;
  let footerHeight = footer ? footer.offsetHeight : 40;
  let canvasHeight = windowHeight - headerHeight - footerHeight;

  let cnv = createCanvas(windowWidth, canvasHeight);
  cnv.parent("game-container");
  rider = new Rider();
  road = new Road();
  horizon = min(300, height / 3);
}

function draw() {
  background(130);
  drawSky();
  road.drawRoadLines();

  if (rider.riding) {
    // Update Score
    rider.score += 1;
    noStroke();
    fill(50);
    textSize(24);
    text(`SCORE: ${rider.score}`, 10, 30);

    // Create a cars every 60 frames, if game is active
    if (frameCount % 60 === 0) {
      cars.splice(0, 0, new Car(Car.leftLane));
    }

    // Player can move left or right using arrow keys
    if (keyIsDown(LEFT_ARROW) && rider.position > 0) {
      rider.moveLeft();
    }
    if (keyIsDown(RIGHT_ARROW) && rider.position < width) {
      rider.moveRight();
    }

    // Player can move left or right using mouse/touch
    if ((mouseIsPressed || touches.length > 0) && rider.position > 0 && rider.position < width) {
      let inputX = touches.length > 0 ? touches[0].x : mouseX;
      if (inputX < rider.position) {
        rider.moveLeft();
      } else if (inputX > rider.position) {
        rider.moveRight();
      }
    }
  }

  // draw each car
  for (let car of cars) {
    car.show();
    // reposition each car if game is active
    if (rider.riding) {
      car.move();
    }
  }

  // Remove car if has traveled off canvas
  let prune = false;
  if (cars.length > 0) {
    let car = cars[cars.length - 1];
    if (car.y > height + height / 3) {
      prune = true;
    }
    if (prune) {
      cars.pop();
    }
  }

  // check for collision
  for (let car of cars) {
    if (car.collision()) {
      rider.riding = false;
      rider.crashed = true;
      instructions.textContent = instructionText.crash;
      break; // Stop checking after first collision
    }
  }

  // draw helmeted rider or a crash bubble
  rider.show();
}

// Draw basic sky
function drawSky() {
  push();
  noStroke();
  fill(150, 190, 230);
  rect(0, 0, width, horizon);
  pop();
}


// Generate a Random color with 100% opacity
function randomColor() {
  return color(random(0, 256), random(0, 256), random(0, 256));
}


/***
Save Gif by pressing 's'
Restart game after crashing by pressing 'r'
***/
function keyPressed() {
  if (key === "r" || key === "R") {
    if (rider.crashed) {
      resetGame();
    }
  } else if (key === "s" || key === "S") {
    saveGif("lanesplitting", 5);
  }
}

function mousePressed() {
  checkCrashReset(mouseX, mouseY);
}

function touchStarted() {
  if (touches.length > 0) {
    checkCrashReset(touches[0].x, touches[0].y);
  }
}

function checkCrashReset(x, y) {
  if (rider.crashed) {
    // Check if click/tap is near the rider
    let distance = dist(x, y, rider.position, height);
    if (distance < 300) { // Within 100 pixels of rider
      resetGame();
    }
  }
}

function resetGame() {
  cars = [];
  rider.reset();
}
