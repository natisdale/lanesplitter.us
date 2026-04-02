/**
Author: Nathan Tisdale
File: car.js
Description: car object for lane splitter game
**/
class Car {
  static leftLane() {return 1;}
  static middleLane() {return 2;}
  static rightLane() {return 3;}
  constructor() {
    this.lane = floor(random(1, 4));
    if (this.lane === Car.leftLane()) {
      this.x = width * 0.25;
    } else if (this.lane === Car.middleLane()) {
      this.x = width * 0.5;
    } else {
      this.x = width * 0.75;
    }
    this.x += (floor(random(-width/50,width/50)));
    this.y = horizon - width/20;
    this.color = randomColor();
    this.size = (width / 3) * 0.7;
  }
  show() {
    stroke("black");
    // Left Wheel
    push();
    translate(this.x - this.size / 3, this.y + this.size / 4);
    scale(0.9);
    fill("black");
    rectMode(CENTER);
    rect(0, 0, this.size / 5, this.size / 5);
    pop();
    // Right Wheel
    push();
    translate(this.x + this.size / 3, this.y + this.size / 4);
    scale(0.9);
    fill("black");
    rectMode(CENTER);
    rect(0, 0, this.size / 5, this.size / 5);
    pop();
    // body
    push();
    translate(this.x, this.y);
    scale(0.9);
    rectMode(CENTER);
    fill(this.color);
    rect(0, 0, this.size, this.size / 2.5);
    beginShape();
    vertex(-this.size / 2, -this.size / 5);
    vertex(-this.size / 2 + this.size / 10, -this.size / 2);
    vertex(this.size / 2 - this.size / 10, -this.size / 2);
    vertex(this.size / 2, -this.size / 5);
    endShape(CLOSE);
    pop();
    // Window
    push();
    translate(this.x, this.y);
    scale(0.9);
    fill("silver");
    beginShape();
    vertex(-this.size / 2 + this.size / 20, -this.size / 5 - this.size / 20);
    vertex(
      -this.size / 2 + (this.size / 10 + this.size / 20),
      -this.size / 2 + this.size / 20
    );
    vertex(
      this.size / 2 - this.size / 10 - this.size / 20,
      -this.size / 2 + this.size / 20
    );
    vertex(this.size / 2 - this.size / 20, -this.size / 5 - this.size / 20);
    endShape(CLOSE);
    pop();
    // License Plate
    push();
    fill(235);
    translate(this.x, this.y);
    scale(0.9);
    rectMode(CENTER);
    rect(0, this.size / 15, this.size / 3, this.size / 6);
    pop();
    // Left Tail Light
    push();
    translate(this.x - this.size / 2.5, this.y - this.size / 20);
    scale(0.9);
    fill(200, 0, 0);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.size / 8, this.size / 5);
    pop();
    // Right Tail Light
    push();
    translate(this.x + this.size / 2.5, this.y - this.size / 20);
    scale(0.9);
    fill(200, 0, 0);
    noStroke();
    rectMode(CENTER);
    rect(0, 0, this.size / 8, this.size / 5);
    pop();
  }
  move() {
    this.y += 2;

    // Calculate progress along the road
    let progress = (this.y - horizon) / (height - horizon);
    progress = constrain(progress, 0, 1);

    // Scale from 70% to 90% of 1/3 width based on progress
    this.size = lerp((width / 3) * 0.7, (width / 3) * 0.9, progress);

    if (this.lane === Car.leftLane()) {
      this.x = lerp(width * 0.25, width * 0.1, progress);
    } else if (this.lane === Car.rightLane()) {
      this.x = lerp(width * 0.75, width * 0.90, progress);
    }
    // Middle lane travels straight down (no x change)
  }
  collision() {
    // Check if car is near the bottom where rider is positioned
    if (this.y > height * 0.9 && this.y < height) {
      // Calculate actual distance between car and rider (including Y position)
      let riderY = height - 16; // Rider's Y position from rider.js
      let distance = dist(rider.position, riderY, this.x, this.y);

      // Collision if distance is less than half the car's size
      return distance < this.size * .6;
    }
    return false;
  }
}
