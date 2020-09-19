// Project Type
enum ProjectStatus {
  Active,
  Finished
}
class Project {
  constructor(
    public id: string, 
    public title: string, 
    public description: string, 
    public people: number, 
    public status: ProjectStatus
    ) {}
}


// Project State Management
type Listener = (items: Project[]) => void;

class ProjectState {
  private listeners: Listener[] = [];
  private projects: any[] = [];
  private static instance: ProjectState;

  private constructor() {

  }
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }
  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
  }
  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    )
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

//Validation

interface ValidObject {
  value: string | number;
  required?: boolean; //? also means we're accepting boolean | undefined
  minLength?: number;
  maxLength?: number;
  min?: Number;
  max?: Number;
}
function validate(data: ValidObject) {
  let isValid = true;
  if (data.required) {
    isValid = isValid && data.value.toString().trim().length !== 0;
  }
  if (data.minLength != null && typeof data.value === 'string') {
    isValid = isValid && data.value.length >= data.minLength;
  }
  if (data.maxLength != null && typeof data.value === 'string') {
    isValid = isValid && data.value.length <= data.maxLength;
  }
  if (data.min != null && typeof data.value === 'number') {
    isValid = isValid && data.value >= data.min;
  }
  if (data.max != null && typeof data.value === 'number') {
    isValid = isValid && data.value <= data.max;
  }
  return isValid;
}
// autobind decorator
const Autobind = (_target: any, _methodName: string, descriptor: PropertyDescriptor) => {
  const originalMethod = descriptor.value;
  const newDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  }
  return newDescriptor;
}

// ProjectList Class

class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement; //access to the template that holds content to be rendered
    this.hostElement = document.getElementById('app')! as HTMLDivElement; // holds a reference to the element where I want to render template content
    this.assignedProjects = [];

    const importedHTMLContent = document.importNode(this.templateElement.content, true) //content is prop on html elements
    this.element = importedHTMLContent.firstElementChild as HTMLElement; //returns first child node of project-input as an element node 
    this.element.id = `${this.type}-projects`

    projectState.addListener((projects: Project[]) => {
      this.assignedProjects = projects;
      this.renderProjects();
    })
    this.attach();
    this.renderContent();
  }

  private renderProjects() {
    const listElement = document.getElementById(`${this.type}-projects-list`)!;
    for (const projItem of this.assignedProjects) {
      const listItem = document.createElement('li');
      listItem.textContent = projItem.title;
      listElement.appendChild(listItem);
    }
  }
  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';


  }
  private attach() {
    this.hostElement.insertAdjacentElement('beforeend', this.element);

  }
}
// ProjectInput class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInput: HTMLInputElement;
  descriptionInput: HTMLInputElement;
  peopleInput: HTMLInputElement;

  constructor() {
    this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement; //access to the template that holds content to be rendered
    this.hostElement = document.getElementById('app')! as HTMLDivElement; // holds a reference to the element where I want to render template content

    const importedHTMLContent = document.importNode(this.templateElement.content, true) //content is prop on html elements
    this.element = importedHTMLContent.firstElementChild as HTMLFormElement; //returns first child node of project-input as an element node 
    this.element.id = 'user-input';

    this.titleInput = this.element.querySelector('#title')! as HTMLInputElement;
    this.descriptionInput = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleInput = this.element.querySelector('#people') as HTMLInputElement;

    this.configure();
    this.attach();
  }
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInput.value;
    const enteredDescription = this.descriptionInput.value;
    const enteredPeople = this.peopleInput.value;

    const titleValidatable: ValidObject = {
      value: enteredTitle,
      required: true
    }
    const descriptionValidatable: ValidObject = {
      value: enteredDescription,
      required: true,
      minLength: 2
    }
    const peopleValidatable: ValidObject = {
      value: +enteredPeople,
      required: true,
      min: 1
    }
    if (!validate(titleValidatable) || !validate(descriptionValidatable) || !validate(peopleValidatable)) {
      alert('Invalid input!');
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople]; //enteredPeople needs to be a number
    }
  }
  private clearInputs() {
    this.titleInput.value = '';
    this.descriptionInput.value = '';
    this.peopleInput.value = '';
  }
  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, description, people] = userInput;
      projectState.addProject(title, description, people);
      this.clearInputs();
    }
  }
  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }
  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const projInput = new ProjectInput();
const activeProjList = new ProjectList('active');
const finishedProjList = new ProjectList('active');