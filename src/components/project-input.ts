/// <reference path="base-component.ts"/>

namespace App {
  // class responsible for handling inputs
  export class ProjectInput extends Component<HTMLElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;

    constructor() {
      super("project-input", "app", true, "user-input");

      this.titleInputElement = this.element.querySelector(
        "#title"
      )! as HTMLInputElement;
      this.peopleInputElement = this.element.querySelector(
        "#people"
      )! as HTMLInputElement;
      this.descriptionInputElement = this.element.querySelector(
        "#description"
      )! as HTMLInputElement;

      this.configure();
    }

    private getUserInput(): [string, string, number] | void {
      const title = this.titleInputElement.value;
      const people = this.peopleInputElement.value;
      const description = this.descriptionInputElement.value;

      // simple config which allows to set basic parameters
      const validTtitle: Validable = {
        value: title,
        required: true,
      };

      const validPeople: Validable = {
        value: +people,
        required: true,
        min: 1,
        max: 5,
      };

      const validDescription: Validable = {
        value: description,
        required: true,
        min: 5,
      };

      // validate inputs and check if it returns error
      if (
        !validate(validTtitle) ||
        !validate(validPeople) ||
        !validate(validDescription)
      ) {
        console.log("incorrect input");
      } else {
        return [title, description, +people];
      }
    }

    // decorator - binds this
    @Autobind
    private submitHandler(e: Event) {
      e.preventDefault();
      const userInput = this.getUserInput();

      if (Array.isArray(userInput)) {
        const [title, description, people] = userInput;
        projectState.addProject(title, description, people);
        this.clearInputs();
      }
    }

    // reset form fields
    private clearInputs() {
      this.peopleInputElement.value = "";
      this.descriptionInputElement.value = "";
      this.titleInputElement.value = "";
    }

    // add event listener to submit button
    configure() {
      this.element.addEventListener("submit", this.submitHandler);
    }

    renderContent() {}
  }
}
