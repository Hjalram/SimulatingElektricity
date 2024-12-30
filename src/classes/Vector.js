import { Graphics } from "pixi.js"

export function subtractVectors(vec1, vec2) {
    let result = new Vector();

    result.x = vec1.x - vec2.x;
    result.y = vec1.y - vec2.y;

    return result;
}

export function setMagnitudeVector(vector, magnitude) {
    let result = new Vector();
    const scalar = vector.getLength();

    result.x = vector.x / scalar * magnitude;
    result.y = vector.y / scalar * magnitude;

    return result;
}

export function distanceBetweenVectors(vec1, vec2) {
    const xDistance = Math.abs(vec1.x - vec2.x);
    const yDistance = Math.abs(vec1.y - vec2.y);

    return Math.sqrt(xDistance*xDistance + yDistance*yDistance);
}

export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.debugPoint = new Graphics()
            .circle(0, 0, 4)
            .fill(0x000000);
    }

    isConnected(cables) {
        let connections = [];

        cables.forEach(cable => {
            let thisVector = new Vector(this.x, this.y);

            if (distanceBetweenVectors(thisVector, cable.start) < 0.1) {
                connections.push({
                    cable: cable,
                    vector: cable.start,
                    type: "start"
                });
            }
            
            if (distanceBetweenVectors(thisVector, cable.end) < 0.1) {
                connections.push({
                    cable: cable,
                    vector: cable.end,
                    type: "end"
                });
            }
        });

        return connections;
    }

    getLength() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    showDebugPoint(app) {
        app.stage.addChild(this.debugPoint);
    }

    updateGraphics() {
        this.debugPoint.x = this.x;
        this.debugPoint.y = this.y;
    }
}