import { Graphics } from "pixi.js"
import { Vector, subtractVectors, setMagnitudeVector, distanceBetweenVectors } from "/src/classes/Vector.js"

export class Electron {
    constructor(app) {
        this.position = new Vector(0, 0);
        this.movement = new Vector(0, 0);
        this.movementCount = 0;

        this.graphics = new Graphics();
        this.graphics.circle(0, 0, 5); // Everythings breaks if you touch the default position
        this.graphics.fill(0xfffa00);

        app.stage.addChild(this.graphics);
    }

    followCable(cable, time) {
        this.movement = subtractVectors(cable.end, cable.start);
        this.movement = setMagnitudeVector(this.movement, 2);

        const distanceToEnd = distanceBetweenVectors(this.position, cable.end);
        
        if (distanceToEnd > 2) {
            this.position.x = cable.start.x + this.movement.x * this.movementCount;
            this.position.y = cable.start.y + this.movement.y * this.movementCount;
    
            this.movementCount += 1;
        }
    }

    updateGraphics() {
        this.graphics.x = this.position.x;
        this.graphics.y = this.position.y;
    }
}