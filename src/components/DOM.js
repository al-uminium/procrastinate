import _ from 'lodash'
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
    const projectEL = () => {
        let project = document.getElementsByClassName("project-icon")
        for (const proj of project) {
            proj.addEventListener("click", (e) => toggleFocus(e))
            proj.addEventListener("click", () => renderProjectTasks())
        }
    }
    const addProjectEL = () => {
        let addProject = document.querySelector("#add-proj");
        addProject.addEventListener("click", () => projectModal())
    }
    const addProjectBtnEL = () => {
        let addProjectBtn = document.querySelector("#add-proj-btn");
        addProjectBtn.addEventListener("click", () => createProject())
    }

    return { coverDivEL, newTaskEL, addTaskEL, checkboxEL, delBtnEL, taskContainerEL, projectEL, addProjectEL, addProjectBtnEL }
}

const changeTaskStatus = () => {
    let taskStatus = document.querySelector("#task-status")
    let checkTask = document.querySelector(".incomplete-tasks").hasChildNodes();
    let status = (checkTask) ? "<span id='status-color'>You've</span> got tasks to do!" : "<span id='status-color'>No more</span> tasks left. Hurray!"
    taskStatus.innerHTML = status
}


//-----------------------------------------------------MODAL FORM FUNCTIONS STARTS HERE-------------------------------------------------------------//

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
    div.remove()
}

const closeModal = (e) => {
    if (e.target.id === "cover-div") {
        removeModal()
    }
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

//-----------------------------------------------------MODAL FORM FUNCTIONS END HERE-------------------------------------------------------------//

//--------------------------------------------------RENDERED TASK FUNCTIONS START HERE-----------------------------------------------------------//


const toggleCompleteStatus = (e) => {
    let index = e.target.getAttribute("data-id");
    let {taskTitle, taskDueDate, taskDescr, taskComplete, taskPriority} = getTaskCtnDetails(index)

    // use !taskComplete bc as you click on the checkbox, it becomes the opposite of it's actual status
    let [targProj, ind] = findTask(taskTitle, taskDescr, taskDueDate, taskPriority, !taskComplete)
    targProj[ind].isComplete = !targProj[ind].isComplete
    let project = getProject()
    renderTask(project)
}

const renderTask = (proj) => {
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
            <div class="task-list ${priority}" data-id=${i}>
                <div class="task-checkbox">
                    <input type="checkbox" class="checkbox" onclick="event.stopPropagation()" id="task-${i}" ${complete} data-id=${i}>
                    <label for="task-${i}"></label>
                </div>
                <div class="task-items task-${i}">
                    <div class="task-title">${title}</div>
                    <div class="task-date">${date}</div>
                    <div class="task-descr hidden">${descr}</div>
                    <div class="task-priority hidden">${priority}</div>
                </div>
                <span class="material-icons del" onclick="event.stopPropagation()" data-id="${i}">delete</span>
            </div>
        `
        return html
    }

    const addToInnerHTML = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            let container = (arr[i].isComplete) ? completeTasks : incompleteTasks
            container.innerHTML += taskTemplate(
                arr[i].title, 
                arr[i].descr, 
                arr[i].dueDate, 
                arr[i].priority, 
                arr[i].isComplete,
                i
            )
        }
    }

    let allTasks = (proj.name === "Inbox") ? generalInbox.getAllTasks() : proj.tasks
    addToInnerHTML(allTasks)
    changeTaskStatus()
    eventListeners().checkboxEL()
    eventListeners().delBtnEL()
    eventListeners().taskContainerEL()
}

const getTaskCtnDetails = (index) => {
    let task = document.querySelector(`.task-${index}`)
    let taskTitle = task.children[0].textContent
    let taskDueDate = task.children[1].textContent
    let taskDescr = task.children[2].textContent
    let taskPriority = task.children[3].textContent;
    let taskComplete = document.querySelector(`#task-${index}`).checked

    return {taskTitle, taskDueDate, taskDescr, taskComplete, taskPriority}
}

const addTask = () => {
    let {taskTitle, taskDueDate, taskDescr, taskPriority} = getTaskModalDetails()
    let project = getProject()
    Task(taskTitle.value, taskDescr.value, taskDueDate.value, taskPriority, false, project)
    renderTask(project)
    removeModal()
}

const deleteTask = (e) => {
    let index = e.target.getAttribute("data-id");
    let {taskTitle, taskDueDate, taskDescr, taskComplete, taskPriority} = getTaskCtnDetails(index)
    let [targProj, ind] = findTask(taskTitle, taskDescr, taskDueDate, taskPriority, taskComplete)
    targProj.splice(ind, 1)
    let project = getProject()
    renderTask(project)
}

const expandTask = (e) => {
    let index = e.getAttribute("data-id");
    let {taskTitle, taskDueDate, taskDescr, taskComplete, taskPriority} = getTaskCtnDetails(index)
    taskModal(taskTitle, taskDueDate, taskDescr, taskPriority)
}

const setTaskDisplay = (incompTasks, compTasks) => {
    let project = getProject()
    let tasks = (project.name === "Inbox") ? generalInbox.getAllTasks() : project.tasks

    let incompCount = 0
    let compCount = 0
    for (const task of tasks) {
        if (tasks.length) {
            if (task.isComplete) compCount++
            if (!task.isComplete) incompCount++
        }
    }

    incompTasks.style.display = (incompCount) ? "grid" : "none"
    compTasks.style.display = (compCount) ? "grid" : "none"
    
    return
}

//

const toggleFocus = (e) => {
    let focused = document.querySelector("#focused") 
    focused.removeAttribute("id")
    e.target.setAttribute("id", "focused")
}

const getProject = () => {
    let focused = document.querySelector("#focused")
    let projectName = focused.getAttribute("data-name");
    for (const proj of generalInbox.allProj) {
        if (proj.name === projectName) {
            return proj
        }
    }
}

const renderProjectTasks = () => {
    let project = getProject()
    renderTask(project)
}

const renderProject = () => {
    let projectContainer = document.querySelector("#project-container")
    for (const proj of generalInbox.allProj) {
        let name = proj.name
        if (!(name==="Inbox")) {
            projectContainer.innerHTML += `
                <div class="project-icon" data-name="${name}">
                    <span class="material-icons">tab</span>
                    ${name}
                </div>
            `
        }
    }
}

const createProject = () => {
    let name = document.querySelector("#project-name").value
    if (name) {
        Project(name);
        renderProject()
        //innerHTML removes previous eventlisteners bc you're making new instances
        eventListeners().projectEL()
        eventListeners().addProjectEL()
        removeModal()
    }
    return
}

const projectModal = () => {
    let div = document.createElement("div")
    div.setAttribute("id", "cover-div")
    div.innerHTML = `
        <div id="project-modal">
            <div id="project-ctn">
                <input type="text" id="project-name" placeholder="Project name">
                <span class="material-icons" id="add-proj-btn">add_circle_outline</span>
            </div>
        </div>
    `
    document.body.appendChild(div)
    eventListeners().coverDivEL()
    eventListeners().addProjectBtnEL()
}

export { eventListeners, renderTask, renderProject, setTaskDisplay }