import { Graphics } from "pixi.js"
import { Vector, subtractVectors, setMagnitudeVector, distanceBetweenVectors } from "/src/classes/Vector.js"

export class CircuitFinder { // An electron like thing whose job is to search for circuits
    constructor(app, battery) {
        this.startPos = battery.negPoint;
        this.endPos = battery.posPoint;
        this.position = new Vector(this.startPos.x, this.startPos.y);
        this.position.showDebugPoint(app);
    }

    runConnection(connection) {
        if (connection.type === "start") {
            this.position.x = connection.cable.end.x;
            this.position.y = connection.cable.end.y;
            return {
                cable: connection.cable,
                vector: connection.cable.end,
                type: "end"
            };
        }
        else if (connection.type === "end") {
            this.position.x = connection.cable.start.x;
            this.position.y = connection.cable.start.y;
            return {
                cable: connection.cable,
                vector: connection.cable.start,
                type: "start"
            };
        }
    }

    search(cables) {
        let ignoredConnection;

        for (let i = 0; i < cables.length + 1; i++) {

            if (distanceBetweenVectors(this.position, this.endPos) > 0.1) {

                const connections = this.position.isConnected(cables);

                console.log(connections);
                console.log(this.position);
                
                if (connections.length === 1) {

                    if (ignoredConnection === undefined) {
                        ignoredConnection = this.runConnection(connections[0]);
                    }

                }
                else if (connections.length === 2) {
                    
                    // Removes the current connection from the list
                    const ignoredConnectionIndex = connections.indexOf(ignoredConnection);

                    connections.forEach(connection => {
                        if (connection.cable.end.x = ignoredConnection.cable.end.x) {
                            console.log("cables match");
                        }
                    }); 

                    console.log(ignoredConnectionIndex);
                    console.log(ignoredConnection);
                    console.log(connections);

                    if (ignoredConnectionIndex > -1) {
                        connections.splice(ignoredConnectionIndex, 1);
                        console.log("remove")
                    }

                    ignoredConnection = this.runConnection(connections[0]);


                }

                console.log("");
                console.log("");

    
                /*if (connections.length > 0) {
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
                */
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