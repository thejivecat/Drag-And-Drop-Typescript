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

    if (enteredTitle.trim().length === 0 || enteredDescription.trim().length === 0 || enteredPeople.trim().length ===0) {
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
      console.log(title, description, people);
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