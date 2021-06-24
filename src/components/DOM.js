import { inbox, projects, task } from './classes.js'
import { Project, defaultProj, Task, delTask, generalInbox } from './logic.js'



const eventListeners = () => {
    const coverDivEL = () => {
        let coverDiv = document.querySelector("#cover-div")
        coverDiv.addEventListener("click", (e) => closeModal(e))
    }
    const newTaskEL = () => {
        let addBtn = document.querySelector("#add-btn")
        addBtn.addEventListener("click", () => taskModal())
    }
    const addTaskEL = () => {
        let addTaskBtn = document.querySelector("#add-task-btn")
        addTaskBtn.addEventListener("click", () => addTask())
    }

    return { coverDivEL, newTaskEL, addTaskEL }
}

//Create Modal Form
const taskModal = () => {
    let div = document.createElement("div")
    div.setAttribute("id", "cover-div")
    div.innerHTML = `
        <div id="task-modal">
            <form class="get-task">
                <div id="task-title">
                    <input type="text" id="title" placeholder="Title">
                </div>
                <div id="task-dueDate">
                    <input type="date" id="task-date" placeholder="Date">
                </div>
                <div id="task-descr">
                    <textarea id="descr" spellcheck="false" placeholder="Notes here"></textarea>
                </div>
                <div id="task-footer">
                    <div id="radio-container">
                        <input type="radio" id="none" name="priority" checked class="priority-radio">
                        <label for="none">None</label>
                        <input type="radio" id="low" name="priority" class="priority-radio">
                        <label for="low">Low</label>
                        <input type="radio" id="medium" name="priority" class="priority-radio">
                        <label for="medium">Med</label>
                        <input type="radio" id="high" name="priority" class="priority-radio">
                        <label for="high">High</label>
                    </div>
                    <span class="material-icons" id="add-task-btn">add_circle_outline</span>
                </div>
            </form>
        </div>
    `
    document.body.appendChild(div)
    eventListeners().coverDivEL()
    eventListeners().addTaskEL()
}

const removeModal = () => {
    let div = document.querySelector("#cover-div");
    div.remove()
}

const closeModal = (e) => {
    if (e.target.id === "cover-div") {
        removeModal()
    }
}

const renderTask = () => {
    let incompleteTasks = document.querySelector(".incomplete-tasks") 
    incompleteTasks.innerHTML = ""
    const taskTemplate = (title, descr, duedate, priority) => {
        let date = (!duedate) ? "" : duedate
        let html = `
            <div class="task-list">
                <div class="task-checkbox">
                    <input type="checkbox" id="task">
                    <label for="task"></label>
                </div>
                <div class="task-items">
                    <div class="task-title">${title}</div>
                    <div class="task-date">${date}</div>
                    <div class="task-descr hidden">${descr}</div>
                    <div class="task-priority hidden">${priority}</div>
                </div>
                <span class="material-icons del">delete</span>
            </div>
    `
        return html
    }

    let allTask = generalInbox.getAllTasks()

    for (const task of allTask) {
        incompleteTasks.innerHTML += taskTemplate(task.title, task.descr, task.dueDate, task.priority)
    }
}

const addTask = () => {
    let taskTitle = document.querySelector("#title");
    let taskDueDate = document.querySelector("#task-date")
    let taskDescr = document.querySelector("#descr")
    let taskRadioBtn = document.getElementsByClassName("priority-radio")
    let priority = ''

    for (const radio of taskRadioBtn) {
        if (radio.checked) {
            priority = radio.id
        }
    }

    let newTask = Task(taskTitle.value, taskDescr.value, taskDueDate.value, priority, "false")
    renderTask()
    removeModal()
}

export { eventListeners, renderTask }