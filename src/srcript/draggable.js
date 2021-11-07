import state from './state.js';
import { rotate, reset } from "./cursor.js";

const HANDLE_WIDTH = 16;

export default class Draggable {

    handleEl

    #width;
    #height;
    #widthPx;
    #heightPx;

    #xPx; /** x Coordinate in pixels, relative to top left corner of canvas */
    #yPx;
    #x;
    #y;

    #startingAngle;

    #img;
    #r;

    #startX;
    #startY;

    #dragMouseMoveFunction;

    #handleMouseDownFuncion;
    #handleMouseMoveFunction;

    #isHandleMoveing = false;

    #renderIsQueued;

    constructor(width, height, x, y, r, img) {

        this.handleEl = document.createElement("DIV");
        this.element = document.createElement("DIV");
        this.handleEl.draggable = false;
        this.element.draggable = false;
        this.handleEl.ondragstart = () => false;
        this.element.ondragstart = () => false;

        this.handleEl.appendChild(this.element);
        this.element.style.transform = `translate(${ HANDLE_WIDTH }px, ${ HANDLE_WIDTH }px)`;

        this.width = width;
        this.height = height;

        this.x = x * state.table.width - width / 2;
        this.y = y * state.table.height - height / 2;

        this.#img = img;
        this.#r = r;

        this.element.style.backgroundImage = `url(${this.#img})`;
        this.element.classList.add("draggable");
        this.handleEl.classList.add("draggable-handle");

        state.static.containerEl.appendChild(this.handleEl);
        this.#initEventListeners();

        state.elements.push(this);
    }

    move(x, y) {
        this.#xPx += x;
        this.#yPx += y;

        this.#queUpdate();
    }

    #initEventListeners() {
        this.element.addEventListener('mousedown', this.#onMouseDown.bind(this));
    }

    #onMouseDown(e) {
        if (this.#dragMouseMoveFunction) this.#onMouseUp();

        this.select();

        this.#startX = e.clientX - this.#xPx;
        this.#startY = e.clientY - this.#yPx;

        this.element.style.willChange = "transform"; // bug: setting willchange slightly changes the size of the element

        document.addEventListener('mousemove', this.#dragMouseMoveFunction = this.#onMouseMove.bind(this));
        document.addEventListener('mouseup', this.#onMouseUp.bind(this), {
            once: true
        });
    }

    #onMouseMove(e) {
        this.x = (e.clientX - this.#startX) / state.scale;
        this.y = (e.clientY - this.#startY) / state.scale;
    }

    #onMouseUp() {
        this.element.style.willChange = "";
        document.removeEventListener('mousemove', this.#dragMouseMoveFunction);
        this.#dragMouseMoveFunction = null;
    }

    #queUpdate() {
        if (this.#renderIsQueued) return;
        this.#renderIsQueued = true;
        requestAnimationFrame(this.#update.bind(this));
    }

    #update() {
        window.centerX = this.centerX
        window.centerY = this.centerY;

        this.#renderIsQueued = false;

        this.handleEl.style.transform = `translate(${ this.#xPx - HANDLE_WIDTH }px, ${ this.#yPx - HANDLE_WIDTH }px) rotate(${ this.#r }deg)`;
        this.element.style.width = this.#widthPx + "px";
        this.element.style.height = this.#heightPx + "px";
    }

    select() {
        if (state.selected === this) return;

        state.selected?.unselect();
        state.selected = this;

        this.handleEl.classList.add("selected");

        this.handleEl.style.width = this.#widthPx + HANDLE_WIDTH * 2 + "px";
        this.handleEl.style.height = this.#heightPx + HANDLE_WIDTH * 2 + "px";

        this.#setupHandleListeners();
    }

    unselect() {
        this.handleEl.classList.remove("selected");

        this.handleEl.style.width = 0;
        this.handleEl.style.height = 0;

        this.#removeHandleListeners();
    }

    #setupHandleListeners() {
        this.handleEl.addEventListener('mousedown', this.#handleMouseDownFuncion = this.#onHandleMouseDown.bind(this));
        document.addEventListener("mousemove", this.#handleMouseMoveFunction = this.#onHandleMouseMove.bind(this));
    }

    #removeHandleListeners() {
        this.handleEl.removeEventListener('mousedown', this.#handleMouseDownFuncion);
        document.removeEventListener("mousemove", this.#handleMouseMoveFunction);
    }

    /* Problem, onHandleMouseDown is relative to the document while onHandleMouseMove is relative to the container */
    #onHandleMouseDown(e) {
        if (e.target !== this.handleEl) return;
        this.#isHandleMoveing = true;

        this.#startingAngle = -this.#r + Math.atan2(e.clientY - this.globalCenterY, e.clientX - this.globalCenterX) * 180 / Math.PI;

        document.addEventListener('mouseup', this.#onHandleMouseUp.bind(this), {
            once: true,
        });
    }

    #onHandleMouseUp(e) {
        this.#isHandleMoveing = false;
        reset();
    }

    #onHandleMouseMove(e) {

        if (this.#isHandleMoveing) {
            const angle = Math.atan2(e.clientY - this.globalCenterY, e.clientX - this.globalCenterX) * 180 / Math.PI;
            const delta = angle - this.#startingAngle;

            this.r = delta;

        } else {
            if (e.target !== this.handleEl) return;

            const width = this.#widthPx + HANDLE_WIDTH * 2;
            const height = this.#heightPx + HANDLE_WIDTH * 2;

            const { offsetX, offsetY } = e;

            /*
                UNUSED Code for scaling
                I am sorry for this block of unreadable code.
                Basically it devides the handle area (for resize and rotate) into 16 different areas and assignes each one a different pointer.
            */

            // if ((offsetX < HANDLE_WIDTH && offsetY < HANDLE_WIDTH / 2) || (offsetX < HANDLE_WIDTH / 2 && offsetY < HANDLE_WIDTH)) this.handleEl.style.cursor = "help";
            // else if ((offsetX < HANDLE_WIDTH && offsetY > height - HANDLE_WIDTH / 2) || (offsetX < HANDLE_WIDTH / 2 && offsetY > height - HANDLE_WIDTH)) this.handleEl.style.cursor = "pointer";
            // else if ((offsetX > width - HANDLE_WIDTH && offsetY < HANDLE_WIDTH / 2) || (offsetX > width - HANDLE_WIDTH / 2 && offsetY < HANDLE_WIDTH)) this.handleEl.style.cursor = "progress";
            // else if ((offsetX > width - HANDLE_WIDTH && offsetY > height - HANDLE_WIDTH / 2) || (offsetX > width - HANDLE_WIDTH / 2 && offsetY > height - HANDLE_WIDTH)) this.handleEl.style.cursor = "wait";

            // else if (offsetX < HANDLE_WIDTH / 2) this.handleEl.style.cursor = "cell";
            // else if (offsetY < HANDLE_WIDTH / 2) this.handleEl.style.cursor = "crosshair";
            // else if (offsetX > width - HANDLE_WIDTH / 2) this.handleEl.style.cursor = "text";
            // else if (offsetY > height - HANDLE_WIDTH / 2) this.handleEl.style.cursor = "vertical-text";

            let rot;

            if (offsetX < HANDLE_WIDTH && offsetY < HANDLE_WIDTH) rot = 45;
            else if (offsetX < HANDLE_WIDTH && offsetY > height - HANDLE_WIDTH) rot = 180 + 45;
            else if (offsetX > width - HANDLE_WIDTH && offsetY < HANDLE_WIDTH) rot = 45;
            else if (offsetX > width - HANDLE_WIDTH && offsetY > height - HANDLE_WIDTH) rot = 180 - 45;

            else if (offsetX < HANDLE_WIDTH) rot = 270;
            else if (offsetY < HANDLE_WIDTH) rot = 0;
            else if (offsetX > width - HANDLE_WIDTH) rot = 90;
            else if (offsetY > height - HANDLE_WIDTH) rot = 180;

            else this.handleEl.style.cursor = reset(); // this should never happen

            rotate(rot + this.r, this.handleEl);
        }

    }

    updateScale() {
        this.x = this.x;
        this.y = this.y;

        this.width = this.width;
        this.height = this.height;
    }

    set x(x) {
        this.#x = x;
        this.#xPx = x * state.scale;
        this.#queUpdate();
    }

    get x() {
        return this.#x;
    }

    set y(y) {
        this.#y = y;
        this.#yPx = y * state.scale;
        this.#queUpdate();
    }

    get y() {
        return this.#y;
    }

    set r(r) {
        this.#r = r;
        this.#queUpdate();
    }

    get r() {
        return this.#r;
    }

    set width(width) {
        this.#width = width;
        this.#widthPx = width * state.scale;
        this.handleEl.style.transformOrigin = `${ (this.#widthPx + HANDLE_WIDTH) / 2 }px ${ (this.#heightPx + HANDLE_WIDTH) / 2 }px`
        this.#queUpdate();
    }

    get width() {
        return this.#width;
    }

    set height(height) {
        this.#height = height;
        this.#heightPx = height * state.scale;
        this.handleEl.style.transformOrigin = `${ (this.#widthPx + HANDLE_WIDTH) / 2 }px ${ (this.#heightPx + HANDLE_WIDTH) / 2 }px`
        this.#queUpdate();
    }

    get height() {
        return this.#height;
    }

    get centerX() {
        return this.#xPx + (this.#widthPx + HANDLE_WIDTH) / 2;
    }

    get centerY() {
        return this.#yPx + (this.#heightPx + HANDLE_WIDTH) / 2;
    }

    get globalCenterX() {
        return this.centerX + (state.containerOffset?.x ?? (state.containerOffset = state.static.containerEl.getBoundingClientRect()).x);
    }

    get globalCenterY() {
        return this.centerY + (state.containerOffset?.y ?? (state.containerOffset = state.static.containerEl.getBoundingClientRect()).y);
    }
}