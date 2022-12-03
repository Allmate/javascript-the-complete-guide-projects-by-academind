export class DOMHelper {
    static moveElement(targetElementId, destinationElementSelector) {
        const targetEl = document.getElementById(targetElementId);
        const destinationEl = document.querySelector(
            destinationElementSelector
        );
        destinationEl.appendChild(targetEl);
        targetEl.scrollIntoView({behavior: 'smooth'});
    }

    static clearEventListener(targetElement) {
        const clonedElement = targetElement.cloneNode(true);
        targetElement.replaceWith(clonedElement);

        return clonedElement;
    }
}