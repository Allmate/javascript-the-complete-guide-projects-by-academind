import {ProjectList} from "./App/ProjectList.js";

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
