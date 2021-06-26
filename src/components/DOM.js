import { inbox, projects, task } from './classes.js'
import { Project, defaultProj, Task, delTask, generalInbox, findTask } from './logic.js'



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
    const checkboxEL = () => {
        let checkbox = document.getElementsByClassName("checkbox")
        for (const box of checkbox) {
            box.addEventListener("click", () => toggleCompleteStatus())
        }
    }

    return { coverDivEL, newTaskEL, addTaskEL }
}

const getTaskDetails = () => {
    let taskTitle = document.querySelector("#title").value;
    let taskDueDate = document.querySelector("#task-date").value;
    let taskDescr = document.querySelector("#descr").value;
    let taskRadioBtn = document.getElementsByClassName("priority-radio")
    let priority = ''

    for (const radio of taskRadioBtn) {
        if (radio.checked) {
            priority = radio.id
        }
    }

    return {taskTitle, taskDueDate, taskDescr, priority}
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

// const toggleCompleteStatus = (e) => {
//     if
// }

const renderTask = () => {
    //render task called when pressing add button 
    //will render all tasks inside inbox, checked or not
    //checks if isComplete is true, if yes, place it as 
    let incompleteTasks = document.querySelector(".incomplete-tasks")
    let completeTasks = document.querySelector(".completed-tasks") 

    setTaskDisplay(incompleteTasks, completeTasks);

    incompleteTasks.innerHTML = ""
    completeTasks.innerHTML = ""

    const taskTemplate = (title, descr, duedate, priority, isComplete, i) => {
        let date = (!duedate) ? "" : duedate
        let complete = (isComplete) ? "checked" : ""
        let html = `
            <div class="task-list">
                <div class="task-checkbox">
                    <input type="checkbox" class="checkbox" ${complete} id="${i}">
                    <label for="${i}"></label>
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

    for (let i = 0; i < allTask.length; i++) {
        let container = (allTask[i].isComplete) ? completeTasks : incompleteTasks
        container.innerHTML += taskTemplate(
            allTask[i].title, 
            allTask[i].descr, 
            allTask[i].dueDate, 
            allTask[i].priority, 
            allTask[i].isComplete,
            i
        )
    }
    // eventListeners().checkboxEl()
}

const addTask = () => {
    let {taskTitle, taskDueDate, taskDescr, priority} = getTaskDetails()

    Task(taskTitle, taskDescr, taskDueDate, priority, "false")
    renderTask()
    removeModal()
}

const setTaskDisplay = (incompTasks, compTasks) => {
    let allTasks = generalInbox.getAllTasks()

    let incompCount = 0
    let compCount = 0
    for (const task of allTasks) {
        if (allTasks.length) {
            if (task.isComplete) compCount++
            if (!task.isComplete) incompCount++
        }
    }

    incompTasks.style.display = (incompCount) ? "grid" : "none"
    compTasks.style.display = (compCount) ? "grid" : "none"
    
    return
}

export { eventListeners, renderTask, setTaskDisplay }