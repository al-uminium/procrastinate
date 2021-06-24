const inbox = () => { 
    //stores all projects, but will initialize a separate inbox project as the default project
    let allProj = [];

    const getAllTasks = () => {
        let allTasks = []
        for (const proj of allProj) {
            proj.tasks.map(task => allTasks.push(task))
        }
        return allTasks
    }

    return {allProj, getAllTasks}
}

const projects = (projName='') => {

    let name = projName
    let tasks = []

    return {name, tasks}
}

const task = (taskTitle="", taskDescr="", taskDueDate=null, completeStatus=false, taskPriority="None") => {
    let title = taskTitle;
    let descr = taskDescr;
    let dueDate = taskDueDate;
    let isComplete = completeStatus
    let priority = taskPriority;

    return { title, descr, dueDate, isComplete, priority }
}

export { inbox, projects, task }