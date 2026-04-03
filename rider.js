/**
Author: Nathan Tisdale
File: rider.js
Description: rider object for lane splitter game
**/
class Rider {
  constructor(riding = false, position = width / 2) {
    this._riding = true;
    this._position = position;
    this._score = 0;
    this._crashed = false;
    this._lean = 0; // -1 = left, 0 = none, 1 = right
  }

  get riding() {
    return this._riding;
  }
  set riding(value) {
    this._riding = value;
  }

  get score() {
    return this._score;
  }
  set score(value) {
    this._score = value;
  }

  get position() {
    return this._position;
  }
  set position(value) {
    this._position = value;
  }

  get lean() {
    return this._lean;
  }
  set lean(value) {
    this._lean = value;
  }
  
  get crashed() {
    return this._crashed;
  }
  set crashed(value) {
    if (!value) {
      instructions.textContent = instructionText.movement;
    }
    this._crashed = value;
  }
  show() {
    try {
      let scaleAmount = width / 400; // Scale factor based on width

      if (this.crashed) {
        push();
        try {
          scale(scaleAmount);
          fill("red");
          ellipse(this.position / scaleAmount, height / scaleAmount, 200, 200);
          fill("black");
          noStroke();
          let crashMessage = "YOU CRASHED!";
          textSize(14);
          text(
            crashMessage,
            this.position / scaleAmount - 2 * textWidth(crashMessage / 2),
            height / scaleAmount - 10
          );
        } finally {
          pop();
        }
      } else {
        if (keyIsDown(LEFT_ARROW)) {
          this.lean = -1;
        } else if (keyIsDown(RIGHT_ARROW)) {
          this.lean = 1;
        } else {
          this.lean = 0;
        }
        if (mouseIsPressed) {
          if (mouseX < rider.position) {
            this.lean = -1;
          } else if (mouseX > rider.position) {
            this.lean = 1;
          } else {
            this.lean = 0;
          }
        }
        push();
        try {
          scale(scaleAmount);
          translate(this.position / scaleAmount, height / scaleAmount - 16);
          rotate((this.lean * PI) / 40);
          // handlebars
          stroke("black");
          strokeWeight(2);
          line(-16, 0, 0, -5);
          line(16, 0, 0, -5);
          // left mirror
          stroke("black");
          strokeWeight(1);
          line(-17, 0, -17, -10);
          fill("silver");
          ellipse(-17, -7, 5);
          // right mirror
          line(17, 0, 17, -10);
          ellipse(17, -7, 5);

          // arms
          stroke("brown");
          strokeWeight(4);
          line(-14, -1, -5, 20);
          line(14, -1, 5, 20);
          // helmet
          fill("white");
          stroke("white");
          ellipse(0, 0, 15);
          stroke("orange");
          line(0, -7, 0, 7);
          // body
          fill("brown");
          stroke("brown");
          rectMode(CENTER);
          rect(0, 16, 20, 20, 5);
        } finally {
          pop();
        }
      }
    } catch (error) {
      console.error("Error in Rider.show():", error);
    }
  }
  moveLeft() {
    if (this.position > 0) {
      this.position -= 3;
    }
  }
  moveRight() {
    if (this.position < width) {
      this.position += 3;
    }
  }

  reset() {
    this.score = 0;
    this.riding = true;
    this.crashed = false;
  }
}
