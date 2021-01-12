/// <reference path="base-component.ts"/>

namespace App {
  export class ProjectList
    extends Component<HTMLElement, HTMLElement>
    implements DropTarget {
    assignedProjects: Project[];

    constructor(private type: "active" | "finished") {
      super("project-list", "app", false, `${type}-projects`);
      this.assignedProjects = [];

      this.configure();
      this.renderContent();
    }

    @Autobind
    dragOverHandler(e: DragEvent) {
      // allows dropping only plain/text
      if (e.dataTransfer && e.dataTransfer.types[0] === "text/plain") {
        e.preventDefault();
        const listEl = this.element.querySelector("ul")!;

        listEl.classList.add("droppable");
      }
    }

    @Autobind
    dragLeaveHandler(_: DragEvent) {
      const listEl = this.element.querySelector("ul")!;

      listEl.classList.remove("droppable");
    }

    @Autobind
    dropHandler(e: DragEvent) {
      const projectId = e.dataTransfer!.getData("text/plain");
      projectState.moveProject(
        projectId,
        this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
      );
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

      this.element.addEventListener("dragover", this.dragOverHandler);
      this.element.addEventListener("drop", this.dropHandler);
      this.element.addEventListener("dragleave", this.dragLeaveHandler);
    }

    // create lists
    renderContent() {
      const listId = `${this.type}-projects-list`;
      this.element.querySelector("ul")!.id = listId;
      this.element.querySelector("h2")!.textContent =
        this.type.toUpperCase() + " PROJECTS";
    }
  }
}
