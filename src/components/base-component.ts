namespace App {
  // base class to be extended
  export abstract class Component<
    T extends HTMLElement,
    U extends HTMLElement
  > {
    template: HTMLTemplateElement;
    root: T;
    element: U;

    constructor(
      templateId: string,
      rootId: string,
      insertAtStart: boolean,
      newElementId?: string
    ) {
      this.template = document.getElementById(
        templateId
      )! as HTMLTemplateElement;
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
}
