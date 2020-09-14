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
  private submitHandler(event: Event) {
    event.preventDefault();
    console.log(this.titleInput.value);
  }
  private configure() {
    this.element.addEventListener('submit', this.submitHandler.bind(this)); //can be done with autobind decorator
  }
  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const projInput = new ProjectInput();