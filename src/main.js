import { Application, Graphics } from "pixi.js";

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

class Vector {
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

class Battery {
    constructor(app) {
        this.voltage = 2;

        this.position = new Vector(400, 400);
        this.size = new Vector(200, 100);

        this.negPoint = new Vector(this.position.x, this.position.y + this.size.y/2);
        this.posPoint = new Vector(this.position.x + this.size.x, this.position.y + this.size.y/2);

        this.graphicsRect = new Graphics()
            .rect(0, 0, this.size.x, this.size.y)
            .fill(0xAAAAAA);

        app.stage.addChild(this.graphicsRect);

        this.negPoint.showDebugPoint(app);
        this.posPoint.showDebugPoint(app);

        this.electrons = [
            new Electron(app),
            new Electron(app),
            new Electron(app),
            new Electron(app),
            new Electron(app)
        ];

        for (let i = 0; i < this.electrons.length; i++) { // Moves the electrons based on battery position
            const elektron = this.electrons[i];

            elektron.position.x = this.position.x + this.size.x / 4;
            elektron.position.y = this.position.y + this.size.y / 2;
        }
    }

    isCircuit(cables) { // Returns true if the battery is connected in a circuit

    }

    updatePosition() {
        this.negPoint.x = this.position.x; 
        this.negPoint.y = this.position.y + this.size.y/2;

        this.posPoint.x = this.position.x + this.size.x;
        this.posPoint.y = this.position.y + this.size.y/2;

        this.electrons.forEach(electron => {
            electron.position.x = this.position.x;
            electron.position.y = this.position.y;
        }); 
        

        // Update the positions of the graphics
        this.negPoint.updateGraphics();
        this.posPoint.updateGraphics();

        this.graphicsRect.x = this.position.x;
        this.graphicsRect.y = this.position.y;

        this.electrons.forEach(electron => {
            electron.graphics.x = electron.position.x;
            electron.graphics.y = electron.position.y;
        });  
    }
}

class CircuitFinder { // An electron like thing whose job is to search for circuits
    constructor(app, battery) {
        this.startPos = battery.negPoint;
        this.endPos = battery.posPoint;
        this.position = new Vector(this.startPos.x, this.startPos.y);
        this.position.showDebugPoint(app);
    }

    search(cables) {
        for (let i = 0; i < 50; i++) {

            if (distanceBetweenVectors(this.position, this.endPos) > 0.1) {

                const connections = this.position.isConnected(cables);
    
                if (connections.length > 0) {
                    // Calulating connections of type "start"
                    let startConnections = [];
                    connections.forEach(connection => {
                        if (connection.type == "start") {
                            startConnections.push(connection);
                        }
                    });
    
                    if (startConnections.length > 0) {
                        this.position.x = startConnections[0].cable.end.x;
                        this.position.y = startConnections[0].cable.end.y;
                    }
                }
    
                console.log(connections);
                console.log(this.position);
                console.log("");
                console.log("");

            }
            else {
                console.log("Circuit");
            }


        }
    }

    updateGraphics() {
        this.position.updateGraphics();
    }
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
        this.debugLine.stroke({color: 0xffffff, pixelLine: true});

        app.stage.addChild(this.debugLine);
    }
}

(async () => {
    const app = new Application();

    await app.init({
        resizeTo: window,
        background: 0x00aaff
    });


    const battery = new Battery(app);
    battery.position.x = 400;
    battery.position.y = 600;
    battery.updatePosition();

    const finder = new CircuitFinder(app, battery);

    

    const cables = [
        new Cable(app, new Vector(battery.negPoint.x, battery.negPoint.y), new Vector(300, 300)),
        new Cable(app, new Vector(300, 300), new Vector(700, 300)),
        new Cable(app, new Vector(700, 300), new Vector(battery.posPoint.x, battery.posPoint.y)),
    ];

    finder.search(cables);

    app.ticker.add((time) => {

        cables.forEach(cable => {
        }); 

        battery.updatePosition();

        finder.updateGraphics();
    });
    

    document.body.appendChild(app.canvas);
})();