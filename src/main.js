import { Application, Graphics} from "pixi.js";

class Electron extends Graphics {
    constructor() {
        // super(  whatever the class needs  )


    }
}

(async () => {
    const app = new Application();

    await app.init({
        resizeTo: window,
        background: 0x00aaff
    });



    const electron = new Electron();



    document.body.appendChild(app.canvas);
})();