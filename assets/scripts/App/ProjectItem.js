import {DOMHelper} from "../Utility/DOMHelper.js";

export class ProjectItem {
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
        // dynamic imports
        import('./Tooltip.js')
            .then(module => {
                const tooltipText = document.getElementById(this.id).dataset.extraInfo;

                if (this.hasActiveTooltip) return;

                const tooltip = new module.Tooltip(
                    () => {
                        this.hasActiveTooltip = false;
                    },
                    tooltipText,
                    this.id
                );

                tooltip.attach();

                this.hasActiveTooltip = true;
            });
    }

    connectDrag() {
        const projectItemEl = document.getElementById(this.id);

        projectItemEl.addEventListener('dragstart', event => {
            event.dataTransfer.setData('text/plain', this.id);
            event.dataTransfer.effectAllowed = 'move';
        });
    }
}