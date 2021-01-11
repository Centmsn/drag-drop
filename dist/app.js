"use strict";
var ProjectInput = /** @class */ (function () {
    function ProjectInput() {
        this.template = document.querySelector("#project-input");
        this.root = document.querySelector('#app');
        var content = document.importNode(this.template.content, true);
        this.element = content.firstElementChild;
        this.attach();
    }
    ProjectInput.prototype.attach = function () {
        this.root.insertAdjacentElement("afterbegin", this.element);
    };
    return ProjectInput;
}());
var Input = new ProjectInput();
