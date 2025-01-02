import { Application } from "pixi.js";
import { Vector } from "/src/classes/Vector.js"
import { Cable } from "/src/classes/Cable.js"
import { Battery } from "/src/classes/Battery.js"
import { CircuitFinder } from "/src/classes/CircuitFinder.js"

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
        new Cable(app, new Vector(100, 100), new Vector(200, 100))
    ];

    finder.search(cables);

    app.ticker.add((time) => {
        battery.updatePosition();
        finder.updateGraphics();
    });
    

    document.body.appendChild(app.canvas);
})();