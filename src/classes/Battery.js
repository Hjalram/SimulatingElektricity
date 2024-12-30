import { Graphics } from "pixi.js"
import { Vector } from "/src/classes/Vector.js"
import { Electron } from "/src/classes/Electron.js"

export class Battery {
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