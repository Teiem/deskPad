import { Deskpad, Monitor, Keyboard, Mouse } from "./objects";
import state from "./state";
import "./controller";

state.static.tWidthInput.value = state.table.width;
state.static.tHeightInput.value = state.table.height;

const addOption = (parent, width, height, { disabled = false, selected = false } = {}) => {
    const optionEl = document.createElement('option');
    const text = `${width}x${height}`;

    optionEl.value = text;
    optionEl.text = text;
    optionEl.disabled = disabled;
    optionEl.selected = selected;
    optionEl.dataset.width = width;
    optionEl.dataset.height = height;

    parent.appendChild(optionEl);
};

/**
 * Populate Deskpad size select and disables the options that are too big for the table
 */
const addSizes = (tWidth, tHeight) => state.availableSizes
    .forEach(({ width, height, selected }) => addOption(state.static.sizeEl, width, height, {
        disabled: width > tWidth || height > tHeight,
        selected: !!selected
    }));
addSizes(tWidth, tHeight);

/** disable/enable options in select based on new table size */
const updateOptions = () => [...state.static.sizeEl.children].forEach(el => el.disabled = +el.dataset.width > state.table.width || +el.dataset.height > state.table.height);

/**
 * Updates the Table size, calculates a new scale and applies it to all objects
 * Gets invoked by resizing or changing the table size via a form input
 */
const updateTableSize = (tWidth, tHeight) => {
    state.static.tWidthInput.value = tWidth;
    state.static.tHeightInput.value = tHeight;

    state.scale = Math.min(state.container.width / tWidth, state.container.height / tHeight);

    state.static.tableEl.style.width = `${tWidth * state.scale}px`;
    state.static.tableEl.style.height = `${tHeight * state.scale}px`;

    state.table.width = tWidth;
    state.table.height = tHeight;

    state.elements.forEach(el => el.updateScale());
    updateOptions();
};

const changeDeskpadSize = e => {
    const [ width, height ] = e.target.value.split('x').map(Number);

    deskpad.width = width;
    deskpad.height = height;
}


/**
 * Called upon changing the input:number for with or height of the table
 */
const changeTableSize = () => {
    const [ width, height ] = [
        state.static.tWidthInput.value,
        state.static.tHeightInput.value
    ].map(Number);

    updateTableSize(width, height);
};


/**
 * Keeps track of the Container size (area the table can fit in)
 */
const getContainerSize = () => {
    state.container.width = state.static.containerEl.offsetWidth;
    state.container.height = state.static.containerEl.offsetHeight;

    updateTableSize(state.table.width, state.table.height);
};
getContainerSize();

const queResizeEnd = () => {
    state.containerOffset = null;
    getContainerSize();
    return; // wait for resize to finish to improve performance
    clearTimeout(state.resizeEndTimer);
    state.resizeEndTimer = setTimeout(getContainerSize, 100);
};

const deskpad = new Deskpad(state.selectedSize);
const selectableObjects = {
    monitor: new Monitor(),
    keyboard: new Keyboard(),
    mouse: new Mouse(),
};

state.static.sizeEl.addEventListener('change', changeDeskpadSize);
state.static.tWidthInput.addEventListener('change', changeTableSize);
state.static.tHeightInput.addEventListener('change', changeTableSize);
window.addEventListener("resize", queResizeEnd);

[
    state.static.monitorCheckbox,
    state.static.keyboardCheckbox,
    state.static.mouseCheckbox
].forEach(checkbox => checkbox.addEventListener("change", ({ target }) => selectableObjects[target.id].handleEl.style.display = target.checked ? 'block' : 'none'));