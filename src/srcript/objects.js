import Draggable from './draggable.js';

export class Deskpad extends Draggable {

    constructor({ width, height }) {
        const img = new URL("../images/Lttstore_NorthernLightsDeskPad_TransparencyFile_700x_crop.webp", import.meta.url); // pretend we are using width and height to get the actual image image
        super(width, height, 0.5, 0.5, 0, img);
    }
}

export class Monitor extends Draggable {

    constructor() {
        const img = new URL("../images/niceMonitor.png", import.meta.url);
        super(500, 200, 0.5, 0.4, 0, img);
    }
}

export class Keyboard extends Draggable {

    constructor() {
        const img = new URL("../images/niceKeyboard.png", import.meta.url);
        super(400, 150, 0.5, 0.7, 0, img);
    }
}

export class Mouse extends Draggable {

    constructor() {
        const img = new URL("../images/niceMouse.png", import.meta.url);
        super(100, 150, 0.7, 0.7, 0, img);
    }
}