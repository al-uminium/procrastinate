import { inbox, projects, task } from './classes.js'
import { Project, defaultProj, Task, delTask, generalInbox, findTask } from './logic.js'

//ALL allTasks generated from general inbox are placeholders. Once projects has been implemented, will generalize it to fit all projects.

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
            box.addEventListener("click", (e) => toggleCompleteStatus(e))
        }
    }
    const delBtnEL = () => {
        let delBtn = document.getElementsByClassName("del")
        for (const btn of delBtn) {
            btn.addEventListener("click", (e) => deleteTask(e))
        }
    }
    const taskContainerEL = () => {
        let taskContainer = document.getElementsByClassName("task-list")
        for (const task of taskContainer) {
            task.addEventListener("click", (e) => expandTask(e.target))
        }
    }

    return { coverDivEL, newTaskEL, addTaskEL, checkboxEL, delBtnEL, taskContainerEL }
}

const getTaskModalDetails = () => {
    let taskTitle = document.querySelector("#title");
    let taskDueDate = document.querySelector("#task-date");
    let taskDescr = document.querySelector("#descr");
    let taskRadioBtn = document.getElementsByClassName("priority-radio")
    let taskPriority = ''

    for (const radio of taskRadioBtn) {
        if (radio.checked) {
            taskPriority = radio.id
        }
    }

    return {taskTitle, taskDueDate, taskDescr, taskPriority}
}


//Create Modal Form
const taskModal = (title="Title", date="", descr="Notes here", priority="none") => {
    let div = document.createElement("div")
    div.setAttribute("id", "cover-div")
    div.innerHTML = `
        <div id="task-modal">
            <form class="get-task">
                <div id="task-title">
                    <input type="text" id="title" placeholder="${title}">
                </div>
                <div id="task-dueDate">
                    <input type="date" id="task-date" value=${date}>
                </div>
                <div id="task-descr">
                    <textarea id="descr" spellcheck="false" placeholder="${descr}"></textarea>
                </div>
                <div id="task-footer">
                    <div id="radio-container">
                        <input type="radio" id="none" name="priority" class="priority-radio">
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
    let taskPriority = document.getElementById(`${priority}`)
    taskPriority.checked = true
    eventListeners().coverDivEL()
    eventListeners().addTaskEL()
}

const removeModal = () => {
    let div = document.querySelector("#cover-div");
    // let {taskTitle, taskDueDate, taskDescr, taskPriority} = getTaskModalDetails()
    // let index = findTask(taskTitle.placeholder, taskDescr.placeholder, taskDueDate.value, taskPriority)
    // console.log(index)
    div.remove()
}

const closeModal = (e) => {
    if (e.target.id === "cover-div") {
        removeModal()
    }
}

const toggleCompleteStatus = (e) => {
    let allTasks = generalInbox.getAllTasks(); 

    let index = e.target.getAttribute("data-id");
    allTasks[index].isComplete = (allTasks[index].isComplete) ? false : true
    renderTask()
}

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
            <div class="task-list" data-id=${i}>
                <div class="task-checkbox">
                    <input type="checkbox" class="checkbox" id="task-${i}" ${complete} data-id=${i}>
                    <label for="task-${i}"></label>
                </div>
                <div class="task-items">
                    <div class="task-title">${title}</div>
                    <div class="task-date">${date}</div>
                    <div class="task-descr hidden">${descr}</div>
                    <div class="task-priority hidden">${priority}</div>
                </div>
                <span class="material-icons del" data-id="${i}">delete</span>
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
    eventListeners().checkboxEL()
    eventListeners().delBtnEL()
    eventListeners().taskContainerEL()
}

const addTask = () => {
    let {taskTitle, taskDueDate, taskDescr, taskPriority} = getTaskModalDetails()
    Task(taskTitle.value, taskDescr.value, taskDueDate.value, taskPriority)
    renderTask()
    removeModal()
}

const deleteTask = (e) => {
    let index = e.target.getAttribute("data-id");
    defaultProj.tasks.splice(index, 1)
    renderTask()
}

const expandTask = (e) => {
    let index = e.getAttribute("data-id");
    // let {title, dueDate, descr, isComplete, priority} = defaultProj.tasks[index] 
    //default index is empty. used to pass to removeModal() to find the task without having to look for parent node.
    // taskModal(title, dueDate, descr, priority)
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