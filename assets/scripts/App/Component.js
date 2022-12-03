export class Component {
    element;

    constructor(hostElementId, insertBefore = false) {
        this.hostElement = hostElementId
            ? document.getElementById(hostElementId)
            : document.body;
        this.insertBefore = insertBefore;
    }

    attach() {
        this.hostElement.insertAdjacentElement(
            this.insertBefore ? 'beforebegin' : 'beforeend',
            this.element
        );
    }

    detach() {
        this.element.remove();
    }
}