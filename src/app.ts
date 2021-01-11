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

    @Autobind
    private submitHandler(e: Event) {
        e.preventDefault();
        console.log(this.titleInputElement.value)
    }

    private configure() {
        this.element.addEventListener("submit", this.submitHandler)
    }

    private attach() {
        this.root.insertAdjacentElement("afterbegin", this.element)
    }
}

const Input = new ProjectInput()