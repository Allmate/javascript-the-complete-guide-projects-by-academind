export class Modal {
    constructor(contentId, fallbackText) {
        this.contentTemplateEl = document.getElementById(contentId);
        this.modalTemplateEl = document.getElementById('modal-template');
        this.fallbackText = fallbackText;
    }

    show() {
        if('content' in document.createElement('template')) {
            const modalElements= document.importNode(this.modalTemplateEl.content, true);
            this.modalEl = modalElements.querySelector('.modal');
            this.backdropEl = modalElements.querySelector('.backdrop');
            const contentEl = document.importNode(this.contentTemplateEl.content, true);

            this.modalEl.appendChild(contentEl);
            document.body.insertAdjacentElement('afterbegin', this.backdropEl);
            document.body.insertAdjacentElement('afterbegin', this.modalEl);
        }else{
            alert(this.fallbackText);
        }
    }

    hide() {
        this.modalEl.remove();
        this.backdropEl.remove();
        this.modalEl = null;
        this.backdropEl = null;
    }
}