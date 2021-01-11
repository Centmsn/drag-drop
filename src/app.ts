class ProjectInput {
    template: HTMLTemplateElement
    root: HTMLElement
    element: HTMLElement

    constructor() {
        this.template = document.querySelector("#project-input")! as HTMLTemplateElement;
        this.root = document.querySelector('#app')! as HTMLElement

        const content = document.importNode(this.template.content, true)
        this.element = content.firstElementChild as HTMLElement

        this.attach()
    }

    private attach() {
        this.root.insertAdjacentElement("afterbegin", this.element)
    }
}

const Input = new ProjectInput()