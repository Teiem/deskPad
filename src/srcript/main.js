import { Deskpad, Monitor, Keyboard, Mouse } from "./objects";
import state from "./state";
import "./controller";

state.static.tWidthInput.value = state.table.width;
state.static.tHeightInput.value = state.table.height;

const addOption = (parent, option, { disabled = false, selected = false } = {}) => {
    const optionEl = document.createElement('option');

    Object.assign(optionEl, {
        value: option,
        text: option,
        disabled,
        selected
    });

    parent.appendChild(optionEl);
};

const addSizes = (tWidth, tHeight) => state.availableSizes
    .forEach(({ width, height, selected }) => addOption(state.static.sizeEl, `${width}x${height}`, {
        disabled: width > tWidth || height > tHeight,
        selected: !!selected
    }));

const updateTableSize = (tWidth, tHeight) => {
    state.static.tWidthInput.value = tWidth;
    state.static.tHeightInput.value = tHeight;

    state.scale = Math.min(state.container.width / tWidth, state.container.height / tHeight);

    state.static.tableEl.style.width = `${tWidth * state.scale}px`;
    state.static.tableEl.style.height = `${tHeight * state.scale}px`;

    state.table.width = tWidth;
    state.table.height = tHeight;

    state.elements.forEach(el => el.updateScale());
};

addSizes(tWidth, tHeight);

const changeDeskpadSize = e => {
    const [ width, height ] = e.target.value.split('x').map(Number);

    deskpad.width = width;
    deskpad.height = height;
}

state.static.sizeEl.addEventListener('change', changeDeskpadSize);


const changeTableSize = () => {
    const [ width, height ] = [
        state.static.tWidthInput.value,
        state.static.tHeightInput.value
    ].map(Number);

    updateTableSize(width, height);
};

state.static.tWidthInput.addEventListener('change', changeTableSize);
state.static.tHeightInput.addEventListener('change', changeTableSize);



const getContainerSize = () => {
    state.container.width = state.static.containerEl.offsetWidth;
    state.container.height = state.static.containerEl.offsetHeight;

    updateTableSize(state.table.width, state.table.height);
};

const queResizeEnd = () => {
    state.containerOffset = null;
    getContainerSize();
    return; // wait for resize to finish to improve performance
    clearTimeout(state.resizeEndTimer);
    state.resizeEndTimer = setTimeout(getContainerSize, 100);
};

getContainerSize();
window.onresize = queResizeEnd;

const deskpad = new Deskpad(state.selectedSize);

const selectableObjects = {
    monitor: new Monitor(),
    keyboard: new Keyboard(),
    mouse: new Mouse(),
};

[
    state.static.monitorCheckbox,
    state.static.keyboardCheckbox,
    state.static.mouseCheckbox
].forEach(checkbox => checkbox.addEventListener("change", ({ target }) => selectableObjects[target.id].handleEl.style.display = target.checked ? 'block' : 'none'));

window.state = state;