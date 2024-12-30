import { Graphics } from "pixi.js"
import { Vector, subtractVectors, setMagnitudeVector, distanceBetweenVectors } from "/src/classes/Vector.js"

export class CircuitFinder { // An electron like thing whose job is to search for circuits
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