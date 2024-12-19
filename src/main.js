import { Application } from "pixi.js";

(async () => {
    const app = new Application();

    await app.init({
        resizeTo: window,
        background: 0x00aaff
    });

    document.body.appendChild(app.canvas);
})();