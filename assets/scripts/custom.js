class ProjectItem {
    constructor(id, switchProjectHandler) {
        this.id = id;
        this.connectSwitchBtn(switchProjectHandler);
    }

    connectSwitchBtn(switchProjectHandler) {
        const switchBtn = document
            .getElementById(this.id)
            .querySelector('button:last-child');

        switchBtn.addEventListener('click', () => switchProjectHandler(this.id), {
            once: true
        });
    }
}

class ProjectList {
    projects = [];

    constructor(type) {
        this.type = type;
        const projectItemEls = document.querySelectorAll(`#${type}-projects li`);

        projectItemEls.forEach(item => {
            this.projects.push(new ProjectItem(item.id, (id) => this.switchProject(id)));
        });
    }

    addProject(project) {
        this.projects.push(project);
        this.updateUI(project);

        this.projects.find((p) => p.id === project.id).connectSwitchBtn((id) => this.switchProject(id));
    }

    setSwitchProjectFunction(callback) {
        this.switchProjectHandler = callback;
    }

    switchProject(projectId) {
        const [removedProject] = this.projects.splice(this.projects.findIndex(p => p.id === projectId), 1);
        this.switchProjectHandler(removedProject);
    }

    updateUI(removedProject) {
        const removedProjectEl = document.getElementById(removedProject.id);
        removedProjectEl.remove();

        document.querySelector(`#${this.type}-projects ul`).appendChild(removedProjectEl);
    }
}

class App {
    static init() {
        const activeProjects = new ProjectList('active');
        const finishedProjects = new ProjectList('finished');

        activeProjects.setSwitchProjectFunction(activeProjects.addProject.bind(finishedProjects));
        finishedProjects.setSwitchProjectFunction(finishedProjects.addProject.bind(activeProjects));
    }
}

App.init();