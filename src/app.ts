class ProjectState {
    // list of "event listeners"
    // if the state is changed all listeners all called
    private listeners: any[] = []
    private projects: any[] = []
    // instance of the class
    // reference to the instance of ProjectState
    private static instance: ProjectState

    // private constructor is used to create singleton
    private constructor() {}

    // static method to create new instance or return existing one
    static getInstance() {
        // if instance exists, do not create new one
        if(this.instance) {
            return this.instance
        }

        // else create and return new instance
        this.instance = new ProjectState()
        return this.instance
    }

    addListener(listenerFn: Function) {
        this.listeners.push(listenerFn)
    }

    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = {
            // naive approach to id
            // used just to represent real id
            id: Math.random().toString(),
            title: title,
            description: description,
            people: numOfPeople
        }
        this.projects.push(newProject)

        // call all listeners
        for (const listener of this.listeners) {
            listener([...this.projects])
        }
    }
}

// static method used to create new instance or return existing one
const projectState = ProjectState.getInstance()

// simple interface to indicate which properties can be validated
interface Validable {
    value: string | number,
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    min?: number,
    max?: number
}

function validate(validableInput: Validable) {
    // initial state
    let isValid = true

    // validation
    if(validableInput.required) {
        isValid = isValid && !!validableInput.value.toString().trim().length
    }

    if(validableInput.minLength && typeof validableInput.value === "string") {
        isValid = isValid && validableInput.value.length >= validableInput.minLength
    }

    if(validableInput.maxLength && typeof validableInput.value === "string") {
        isValid = isValid && validableInput.value.length <= validableInput.maxLength
    }

    if(validableInput.min && typeof validableInput.value === "number") {
        isValid = isValid && validableInput.value >= validableInput.min
    }

    if(validableInput.max && typeof validableInput.value === "number") {
        isValid = isValid && validableInput.value <= validableInput.max
    }

    return isValid
}

// @decorator
function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    // save original method which is passed to the decorator
    const originalMethod = descriptor.value

    // modify PropertyDescriptor
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        // set getter which returns original method with binded this keyword
        get() {
            const boundFn = originalMethod.bind(this)
            return boundFn
        }
    }

    // return modified PropertyDescriptor
    return adjDescriptor
}

class ProjectList {
    template: HTMLTemplateElement
    root: HTMLElement
    element: HTMLElement
    assignedProjects: any[];

    constructor(private type: "active" | "finished") {
    this.template = document.querySelector("#project-list")! as HTMLTemplateElement;
    this.root = document.querySelector('#app')! as HTMLElement
    this.assignedProjects = []

    const content = document.importNode(this.template.content, true)
    this.element = content.firstElementChild as HTMLElement
    this.element.id = `${this.type}-projects`

    // add new listener to the project state
    projectState.addListener((projects: any[]) => {
        this.assignedProjects = projects
        this.renderProjects()
    })

    this.attach()
    this.renderContent();
    }

    // renders list element
    private renderProjects() {
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLElement

        for (const projectItem of this.assignedProjects) {
            const listItem = document.createElement("li")

            listItem.textContent = projectItem.title
            listEl.append(listItem)
        }
    }

    // create lists
    private renderContent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector("ul")!.id = listId
        this.element.querySelector("h2")!.textContent = this.type.toUpperCase() + " PROJECTS"
    }

    // attach element to DOM
    private attach() {
        this.root.insertAdjacentElement("beforeend", this.element)
    }
}

// class responsible for handling inputs
class ProjectInput {
    template: HTMLTemplateElement
    root: HTMLElement
    element: HTMLElement
    titleInputElement: HTMLInputElement
    peopleInputElement: HTMLInputElement
    descriptionInputElement: HTMLInputElement

    constructor() {
        this.template = document.querySelector("#project-input")! as HTMLTemplateElement;
        this.root = document.querySelector('#app')! as HTMLElement

        const content = document.importNode(this.template.content, true)
        this.element = content.firstElementChild as HTMLElement
        this.element.id = "user-input"

        this.titleInputElement=this.element.querySelector("#title")! as HTMLInputElement
        this.peopleInputElement=this.element.querySelector("#people")! as HTMLInputElement
        this.descriptionInputElement=this.element.querySelector("#description")! as HTMLInputElement

        this.configure()
        this.attach()
    }

    private getUserInput(): [string, string, number] | void {
        const title = this.titleInputElement.value
        const people = this.peopleInputElement.value
        const description = this.descriptionInputElement.value

        // simple config which allows to set basic parameters
        const validTtitle: Validable = {
            value: title,
            required: true
        }

        const validPeople: Validable = {
            value: +people,
            required: true,
            min: 1,
            max: 5
        }

        const validDescription: Validable = {
            value: description,
            required: true,
            min: 5
        }

        // validate inputs and check if it returns error
        if(!validate(validTtitle) || !validate(validPeople) || !validate(validDescription)) {
            console.log('incorrect input')
        } else {
            return [title, description, +people]
        }
    }

    // decorator - binds this
    @Autobind
    private submitHandler(e: Event) {
        e.preventDefault();
        const userInput = this.getUserInput();

        if(Array.isArray(userInput)) {
            const [title, description, people] = userInput
            projectState.addProject(title, description, people)
            this.clearInputs()
        }
    }

    // reset form fields
    private clearInputs() {
        this.peopleInputElement.value = ""
        this.descriptionInputElement.value = ""
        this.titleInputElement.value = ""
    }

    // add event listener to submit button
    private configure() {
        this.element.addEventListener("submit", this.submitHandler)
    }

    // attach element to DOM
    private attach() {
        this.root.insertAdjacentElement("afterbegin", this.element)
    }
}

const Input = new ProjectInput()
const activeProjectList = new ProjectList("active")
const finishedProjectList = new ProjectList("finished")