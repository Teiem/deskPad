let deg = 0;
let renderQued = false;

/**
 * You cant update the rotation of the cursor while your mouse is pressed, aka not while rotating an element
 */
const setRotation = target => {
    target.style.cursor = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><defs><style>.a{fill: white;fill-rule: evenodd;} .a,.c{stroke: black;stroke-width: 0.75px;} .a,.b,.c{stroke-miterlimit: 10;} .b,.c{fill: none;} .b{stroke: white;stroke-width: 1.5px;} .g{transform-origin: center;transform: rotate(${ deg }deg);}</style></defs><title>cursor</title><g class='g'><polygon class='a' points='23.13 15.77 21.09 8.13 15.49 13.72 23.13 15.77' /><polygon class='a' points='0.87 15.77 8.51 13.72 2.91 8.13 0.87 15.77' /><path class='b' d='M5.25,11a9.54,9.54,0,0,1,13.5,0' /><path class='c' d='M4.73,10.48a10.27,10.27,0,0,1,14.54,0' /><path class='c' d='M6,11.72a8.47,8.47,0,0,1,12,0' /></g></svg>") 12 12, auto`;
    renderQued = false;
};

/**
 * You cant rotate cursors on multiple elements in the same frame
 */
export const rotate = (newDeg, target = document.body) => {
    deg = newDeg;

    if (!renderQued) {
        renderQued = true;
        setRotation(target);
    }
};

export const reset = (target = document.body) => {
    target.style.cursor = 'auto';
}