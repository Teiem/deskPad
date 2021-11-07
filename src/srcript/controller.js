import state from './state.js';

const SHIFT_SPEED = 4;

const manage = ({ key, shiftKey }) => {
    if (!state.selected) return;

    const speed = shiftKey ? SHIFT_SPEED : 1;

    if (key === 'Escape') unselect();
    else if (key === "ArrowUp" || key === "w") state.selected.move(0, -speed);
    else if (key === "ArrowDown" || key === "s") state.selected.move(0, speed);
    else if (key === "ArrowLeft" || key === "a") state.selected.move(-speed, 0);
    else if (key === "ArrowRight" || key === "d") state.selected.move(speed, 0);
};

const unselectIfClickedOutside = e => {
    if (!state.selected?.handleEl.contains(e.target)) unselect();
};

const unselect = () => {
    state.selected?.unselect();
    state.selected = null;
};

document.addEventListener('mousedown', unselectIfClickedOutside);
document.addEventListener('keydown', manage);