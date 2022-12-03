import {ProjectItem} from "./ProjectItem.js";
import {DOMHelper} from "../Utility/DOMHelper.js";

export class ProjectList {
    projects = [];

    constructor(type) {
        this.type = type;
        this.addProjectItems();
        this.connectDroppable();
    }

    addProjectItems() {
        const projectItemEls = document.querySelectorAll(
            `#${this.type}-projects li`
        );
        projectItemEls.forEach((item) => {
            this.projects.push(
                new ProjectItem(item.id, this.switchProject.bind(this))
            );
        });
    }

    addProject(project) {
        this.projects.push(project);
        DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
        project.connectSwitchBtn(this.switchProject.bind(this), this.type);
    }

    setSwitchProjectHandler(callback) {
        this.switchProjectHandler = callback;
    }

    switchProject(projectId) {
        const removedProject = this.projects.splice(
            this.projects.findIndex((p) => p.id === projectId),
            1
        )[0];
        this.switchProjectHandler(removedProject);

        /* causing layout shift */
        // const projectItemEl = document.getElementById(projectId);
        // const projectListEl = projectItemEl.parentElement;
        // projectListEl.scrollTo({top: projectItemEl.offsetTop, behavior: "smooth"});
    }

    connectDroppable() {
        const projectListEl = document.querySelector(`#${this.type}-projects ul`);

        projectListEl.addEventListener('dragenter', event => {
            if (event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
                projectListEl.parentElement.classList.add('droppable');
            }
        });

        projectListEl.addEventListener('dragover', event => {
            event.preventDefault();
        });

        projectListEl.addEventListener('dragleave', event => {
            if (event.relatedTarget.closest(`#${this.type}-projects ul`) !== projectListEl) {
                projectListEl.parentElement.classList.remove('droppable');
            }
        });

        projectListEl.addEventListener('drop', event => {
            const projectItemId = event.dataTransfer.getData('text/plain');
            projectListEl.parentElement.classList.remove('droppable');

            if (this.projects.find(project => project.id === projectItemId)) {
                return;
            }

            const switchBtn = document.querySelector(
                `#${projectItemId} button:last-of-type`
            );
            switchBtn.click();
        });

    }
}