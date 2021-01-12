// drag&drop interfaces
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DropTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

enum ProjectStatus {
  Active,
  Finished,
}

// project object
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// type which defines how listener functions should look like
//
type Listener = (items: Project[]) => void;

class ProjectState {
  // list of "event listeners"
  // if the state is changed all listeners all called
  private listeners: any[] = [];
  private projects: Project[] = [];
  // instance of the class
  // reference to the instance of ProjectState
  private static instance: ProjectState;

  // private constructor is used to create singleton
  private constructor() {}

  // static method to create new instance or return existing one
  static getInstance() {
    // if instance exists, do not create new one
    if (this.instance) {
      return this.instance;
    }

    // else create and return new instance
    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }

  addProject(title: string, description: string, numOfPeople: number) {
    // naive approach to id
    // used just to represent real id
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );

    this.projects.push(newProject);

    // call all listeners
    for (const listener of this.listeners) {
      listener([...this.projects]);
    }
  }
}

// static method used to create new instance or return existing one
const projectState = ProjectState.getInstance();

// simple interface to indicate which properties can be validated
interface Validable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validableInput: Validable) {
  // initial state
  let isValid = true;

  // validation
  if (validableInput.required) {
    isValid = isValid && !!validableInput.value.toString().trim().length;
  }

  if (validableInput.minLength && typeof validableInput.value === "string") {
    isValid =
      isValid && validableInput.value.length >= validableInput.minLength;
  }

  if (validableInput.maxLength && typeof validableInput.value === "string") {
    isValid =
      isValid && validableInput.value.length <= validableInput.maxLength;
  }

  if (validableInput.min && typeof validableInput.value === "number") {
    isValid = isValid && validableInput.value >= validableInput.min;
  }

  if (validableInput.max && typeof validableInput.value === "number") {
    isValid = isValid && validableInput.value <= validableInput.max;
  }

  return isValid;
}

// @decorator
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  // save original method which is passed to the decorator
  const originalMethod = descriptor.value;

  // modify PropertyDescriptor
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    // set getter which returns original method with binded this keyword
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };

  // return modified PropertyDescriptor
  return adjDescriptor;
}

// base class to be extended
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  template: HTMLTemplateElement;
  root: T;
  element: U;

  constructor(
    templateId: string,
    rootId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.template = document.getElementById(templateId)! as HTMLTemplateElement;
    this.root = document.getElementById(rootId)! as T;

    const content = document.importNode(this.template.content, true);
    this.element = content.firstElementChild as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.root.insertAdjacentElement(
      insertAtStart ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable {
  private project: Project;

  get persons() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} persons`;
    }
  }

  constructor(rootId: string, project: Project) {
    super("single-project", rootId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @Autobind
  dragStartHandler(e: DragEvent) {
    console.log("dragStart");
  }

  dragEndHandler(e: DragEvent) {
    console.log("dragEnd");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = `${this.persons} assigned`;
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

class ProjectList
  extends Component<HTMLElement, HTMLElement>
  implements DropTarget {
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  // renders list element
  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLElement;

    listEl.innerHTML = "";

    for (const projectItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, projectItem);
    }
  }

  configure() {
    // add new listener to the project state
    projectState.addListener((projects: Project[]) => {
      const tempProjects = projects.filter((project) => {
        if (this.type === "active") {
          return project.status === ProjectStatus.Active;
        }
        return project.status === ProjectStatus.Finished;
      });
      this.assignedProjects = tempProjects;
      this.renderProjects();
    });
  }

  // create lists
  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  // attach element to DOM
}

// class responsible for handling inputs
class ProjectInput extends Component<HTMLElement, HTMLFormElement> {
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

const Input = new ProjectInput();
const activeProjectList = new ProjectList("active");
const finishedProjectList = new ProjectList("finished");
