import availableSizes from "../data/sizes.json";

export default {
    static: {
        containerEl: document.getElementById('container'),
        tableEl: document.getElementById('table'),
        unitSelect: document.getElementById('unit'),
        sizeEl: document.getElementById('size'),
        tWidthInput: document.getElementById('tWidth'),
        tHeightInput: document.getElementById('tHeight'),
        monitorCheckbox: document.getElementById('monitor'),
        keyboardCheckbox: document.getElementById('keyboard'),
        mouseCheckbox: document.getElementById('mouse'),
    },
    availableSizes,
    selectedSize: availableSizes.find(({ selected }) => selected),
    table: {
        width: 2000,
        height: 1000,
    },
    container: {
        width: null,
        height: null,
    },
    scale: 1,
    selected: null,
    elements: [],
    resizeEndTimer: null,
    containerOffset: null,
}