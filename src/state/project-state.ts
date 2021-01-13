import { Project, ProjectStatus } from "../models/project.js";

// type which defines how listener functions should look like
type Listener = (items: Project[]) => void;

export class ProjectState {
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
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((el) => el.id === projectId);

    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  private updateListeners() {
    // call all listeners
    for (const listener of this.listeners) {
      listener([...this.projects]);
    }
  }
}

// static method used to create new instance or return existing one
export const projectState = ProjectState.getInstance();
