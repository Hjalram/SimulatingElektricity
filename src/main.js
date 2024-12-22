import { Application, Graphics } from "pixi.js";

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getLength() {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
}

function subtractVectors(vec1, vec2) {
    let result = new Vector();

    result.x = vec1.x - vec2.x;
    result.y = vec1.y - vec2.y;

    return result;
}

function setMagnitudeVector(vector, magnitude) {
    let result = new Vector();
    const scalar = vector.getLength();

    result.x = vector.x / scalar * magnitude;
    result.y = vector.y / scalar * magnitude;

    return result;
}

function distanceBetweenVectors(vec1, vec2) {
    const xDistance = Math.abs(vec1.x - vec2.x);
    const yDistance = Math.abs(vec1.y - vec2.y);

    return Math.sqrt(xDistance*xDistance + yDistance*yDistance);
}

class Electron {
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

class Cable {
    constructor(app, start, end) {
        this.start = start;
        this.end = end;

        this.debugLine = new Graphics();
        this.debugLine.moveTo(this.start.x, this.start.y);
        this.debugLine.lineTo(this.end.x, this.end.y);
        this.debugLine.stroke({color: 0x000000, pixelLine: true});

        app.stage.addChild(this.debugLine);
    }
}

(async () => {
    const app = new Application();

    await app.init({
        resizeTo: window,
        background: 0x00aaff
    });


    const cable = new Cable(app, new Vector(100, 100), new Vector(400, 200));
    const cable1 = new Cable(app, new Vector(400, 210), new Vector(200, 700));

    const electron = new Electron(app);

    app.ticker.add((time) => {

        electron.followCable(cable, time);
        electron.updateGraphics();

    });
    

    document.body.appendChild(app.canvas);
})();