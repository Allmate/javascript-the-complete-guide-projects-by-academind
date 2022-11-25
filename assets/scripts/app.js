class DOMHelper {
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

class Component {
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

class Tooltip extends Component {
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

class ProjectItem {
    hasActiveTooltip = false;

    constructor(id, updateProjectListHandler) {
        this.id = id;
        this.connectSwitchBtn(updateProjectListHandler);
        this.connectMoreInfoBtn();
        this.connectDrag();
    }

    connectSwitchBtn(switchBtnHandler, type = '') {
        let switchBtn = document.querySelector(
            `#${this.id} button:last-of-type`
        );
        switchBtn = DOMHelper.clearEventListener(switchBtn);

        if (type) {
            switchBtn.textContent = type === 'active' ? 'Finish' : 'Activate';
        }

        switchBtn.addEventListener(
            'click',
            switchBtnHandler.bind(null, this.id)
        );
    }

    connectMoreInfoBtn() {
        const moreInfoBtn = document.querySelector(
            `#${this.id} button:first-of-type`
        );
        moreInfoBtn.addEventListener('click', () => this.displayMoreInfo());
    }

    displayMoreInfo() {
        const tooltipText = document.getElementById(this.id).dataset.extraInfo;

        if (this.hasActiveTooltip) return;

        const tooltip = new Tooltip(
            () => {
                this.hasActiveTooltip = false;
            },
            tooltipText,
            this.id
        );

        tooltip.attach();

        this.hasActiveTooltip = true;
    }

    connectDrag() {
        const projectItemEl = document.getElementById(this.id);

        projectItemEl.addEventListener('dragstart', event => {
            event.dataTransfer.setData('text/plain', this.id);
            event.dataTransfer.effectAllowed = 'move';
        });
    }
}

class ProjectList {
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

class App {
    static init() {
        const activeProjects = new ProjectList('active');
        const finishedProjects = new ProjectList('finished');

        activeProjects.setSwitchProjectHandler(
            activeProjects.addProject.bind(finishedProjects)
        );
        finishedProjects.setSwitchProjectHandler(
            finishedProjects.addProject.bind(activeProjects)
        );
    }
}

App.init();
