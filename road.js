/**
Author: Nathan Tisdale
File: road.js
Description: road object for lane splitter game
**/
class Road {
  constructor() {
    // Road initialization if needed
  }

  // Draw the road lines with perspective
  drawRoadLines() {
    stroke("#FFB500");

    // Calculate total road height
    let roadHeight = height - horizon;

    // Define lane line endpoints
    let leftStartX = width / 2 - width / 8;
    let leftEndX = width * 0.35;
    let rightStartX = width / 2 + width / 8;
    let rightEndX = width * 0.65;

    // Draw left lane line as dashed segments
    push();
    rotate(PI/60); // Rotate to align with road perspective
    this.drawDashedLaneLine(leftStartX, leftEndX, horizon, height, roadHeight);
    pop();
    // Draw right lane line as dashed segments
    push();
    rotate(-PI/60); // Rotate to align with road perspective
    this.drawDashedLaneLine(rightStartX, rightEndX, horizon, height, roadHeight);
    pop();
  }

  // Draw dashed lane lines with perspective scaling
  drawDashedLaneLine(startX, endX, startY, endY, roadHeight) {
    try {
      // Calculate total distance along the slope
      let deltaX = endX - startX;
      let deltaY = endY - startY;
      let slopeLength = sqrt(deltaX * deltaX + deltaY * deltaY);

      // Draw exactly 5 lines
      for (let i = 0; i < 5; i++) {
        push();
        try {
          // Calculate progress position for this line (evenly distribute 5 lines)
          let lineProgress = (i + 0.5) / 5; // Center each line in its segment
          let segmentIndex = i;

          // Scale line length based on depth (increased by 100%)
          let lineLength = (20 + segmentIndex * 10) * 2;

          // Set stroke weight based on depth
          strokeWeight(2 + segmentIndex * 0.5);

          // Calculate start and end positions for this dash
          let dashDistance = lineProgress * slopeLength;
          let halfLineLength = lineLength / 2;

          let startDistance = dashDistance - halfLineLength;
          let endDistance = dashDistance + halfLineLength;

          // Ensure we stay within bounds
          startDistance = max(0, startDistance);
          endDistance = min(slopeLength, endDistance);

          let startProgress = startDistance / slopeLength;
          let endProgress = endDistance / slopeLength;

          let dashStartX = startX + deltaX * startProgress;
          let dashStartY = startY + deltaY * startProgress;
          let dashEndX = startX + deltaX * endProgress;
          let dashEndY = startY + deltaY * endProgress;

          line(dashStartX, dashStartY, dashEndX, dashEndY);
        } finally {
          pop();
        }
      }
    } catch (error) {
      console.error("Error in Road.drawDashedLaneLine():", error);
    }
  }
}