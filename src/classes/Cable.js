import { Graphics } from "pixi.js"

export class Cable {
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