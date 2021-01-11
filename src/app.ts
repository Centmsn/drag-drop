interface Validable {
    value: string | number,
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    min?: number,
    max?: number
}

function validate(validableInput: Validable) {
    let isValid = true

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

function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    const adjDescriptor: PropertyDescriptor = {
        configurable: true,
        get() {
            const boundFn = originalMethod.bind(this)
            return boundFn
        }
    }
    return adjDescriptor
}

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

        if(!validate(validTtitle) || !validate(validPeople) || !validate(validDescription)) {
            console.log('incorrect input')
        } else {
            return [title, description, +people]
        }
    }

    @Autobind
    private submitHandler(e: Event) {
        e.preventDefault();
        const userInput = this.getUserInput();

        if(Array.isArray(userInput)) {
            const [title, description, people] = userInput

            this.clearInputs()
        }
    }

    private clearInputs() {
        this.peopleInputElement.value = ""
        this.descriptionInputElement.value = ""
        this.titleInputElement.value = ""
    }

    private configure() {
        this.element.addEventListener("submit", this.submitHandler)
    }

    private attach() {
        this.root.insertAdjacentElement("afterbegin", this.element)
    }
}

const Input = new ProjectInput()