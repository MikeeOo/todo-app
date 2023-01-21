import "../scss/main.scss"
import FetchUtils from "./FetchUtils";
import {ITask} from "./FetchUtils";

interface ITodoApp {
    elements: IElements;
    addTaskToApi: (e: SubmitEvent) => void;
    fetchUtils: IFetchUtils;
}

interface IElements {
    taskForm: HTMLFormElement;
    taskInput: HTMLInputElement;
    tasksList: HTMLElement;
}

interface IFetchUtils {
    baseUrl: string;
    get: (endpoint: string) => Promise<any>;
    post: (endpoint: string, body: any, headers?: HeadersInit | undefined) => Promise<any>;
}

class TodoApp {

    public fetchUtils: IFetchUtils;

    elements: IElements = {
        taskForm: <HTMLFormElement>document.getElementById(`task_form`),
        taskInput: <HTMLInputElement>document.getElementById(`task_form__input`),
        tasksList: <HTMLUListElement>document.getElementById(`tasks_list`),
    };

    constructor(url: string) {
        this.fetchUtils = new FetchUtils(url);

        this.getTasks().then((r: Array<ITask>) => r.map((task: ITask) => this.createTaskListItem(task)));
        // this.getTasks().then(r => console.log(r));
        this.setEvents();
    };

    getTasks = async (): Promise<Array<ITask>> => await this.fetchUtils.get(`tasks`);

    addTaskToApi = async (e: SubmitEvent): Promise<any> => {
        e.preventDefault();

        // console.log(e);
        // console.log(this.elements.taskInput.value);

        const task = await this.fetchUtils.post(`tasks`, {
            taskName: this.elements.taskInput.value
        });

        console.log(task)

        this.elements.taskForm.reset();

        this.createTaskListItem(task);
    };

    createTaskListItem = (task: ITask): void => {

        const taskDiv: HTMLLIElement = document.createElement(`li`)
        taskDiv.innerText = task.taskName
        taskDiv.className = `taskLi`
        this.elements.tasksList.appendChild(taskDiv)
    }

    setEvents(): void {
        this.elements.taskForm.addEventListener(`submit`, this.addTaskToApi);
    };
}

// new TodoApp();
const app: ITodoApp = new TodoApp(`http://localhost:8000`);

console.log(app);