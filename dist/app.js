"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function validate(validableInput) {
    var isValid = true;
    if (validableInput.required) {
        isValid = isValid && !!validableInput.value.toString().trim().length;
    }
    if (validableInput.minLength && typeof validableInput.value === "string") {
        isValid = isValid && validableInput.value.length >= validableInput.minLength;
    }
    if (validableInput.maxLength && typeof validableInput.value === "string") {
        isValid = isValid && validableInput.value.length <= validableInput.maxLength;
    }
    if (validableInput.min && typeof validableInput.value === "number") {
        isValid = isValid && validableInput.value >= validableInput.min;
    }
    if (validableInput.max && typeof validableInput.value === "number") {
        isValid = isValid && validableInput.value <= validableInput.max;
    }
    return isValid;
}
function Autobind(_, _2, descriptor) {
    var originalMethod = descriptor.value;
    var adjDescriptor = {
        configurable: true,
        get: function () {
            var boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjDescriptor;
}
var ProjectInput = /** @class */ (function () {
    function ProjectInput() {
        this.template = document.querySelector("#project-input");
        this.root = document.querySelector('#app');
        var content = document.importNode(this.template.content, true);
        this.element = content.firstElementChild;
        this.element.id = "user-input";
        this.titleInputElement = this.element.querySelector("#title");
        this.peopleInputElement = this.element.querySelector("#people");
        this.descriptionInputElement = this.element.querySelector("#description");
        this.configure();
        this.attach();
    }
    ProjectInput.prototype.getUserInput = function () {
        var title = this.titleInputElement.value;
        var people = this.peopleInputElement.value;
        var description = this.descriptionInputElement.value;
        var validTtitle = {
            value: title,
            required: true
        };
        var validPeople = {
            value: +people,
            required: true,
            min: 1,
            max: 5
        };
        var validDescription = {
            value: description,
            required: true,
            min: 5
        };
        if (!validate(validTtitle) || !validate(validPeople) || !validate(validDescription)) {
            console.log('incorrect input');
        }
        else {
            return [title, description, +people];
        }
    };
    ProjectInput.prototype.submitHandler = function (e) {
        e.preventDefault();
        var userInput = this.getUserInput();
        if (Array.isArray(userInput)) {
            var title = userInput[0], description = userInput[1], people = userInput[2];
            this.clearInputs();
        }
    };
    ProjectInput.prototype.clearInputs = function () {
        this.peopleInputElement.value = "";
        this.descriptionInputElement.value = "";
        this.titleInputElement.value = "";
    };
    ProjectInput.prototype.configure = function () {
        this.element.addEventListener("submit", this.submitHandler);
    };
    ProjectInput.prototype.attach = function () {
        this.root.insertAdjacentElement("afterbegin", this.element);
    };
    __decorate([
        Autobind,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Event]),
        __metadata("design:returntype", void 0)
    ], ProjectInput.prototype, "submitHandler", null);
    return ProjectInput;
}());
var Input = new ProjectInput();
