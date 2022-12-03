import {Component} from "./Component.js";

export class Tooltip extends Component {
    constructor(closeNotifierFunction, text, hostElementId) {
        super(hostElementId);
        this.closeNotifier = closeNotifierFunction;
        this.create(text);
    }

    remove() {
        this.closeNotifier();
        this.detach();
    }

    create(text) {
        this.element = document.createElement('div');
        this.element.className = 'card';
        this.element.textContent = text;

        const hostElPosLeft = this.hostElement.offsetLeft;
        const hostElPosTop = this.hostElement.offsetTop;
        const hostElHeight = this.hostElement.clientHeight;
        const parentElScrolling = this.hostElement.parentElement.scrollTop;

        const x = hostElPosLeft + 20;
        const y = hostElPosTop + hostElHeight - parentElScrolling - 10;

        this.element.style.position = 'absolute';
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';

        this.element.addEventListener('click', this.remove.bind(this));
    }
}