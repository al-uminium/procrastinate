import { inbox, projects, task } from './classes.js'
import _ from 'lodash'

//initialize inbox
const generalInbox = inbox();

//Create new project
const Project = (projName) => {
    const i = projects(projName);
    generalInbox.allProj.push(i)
    return i
}

//Initialize default project
const defaultProj = Project("Inbox")

//Create new task
const Task = (taskTitle, taskDescr, taskDueDate, taskPriority, completeStatus=false, taskProject=defaultProj) => {
    const i = task(taskTitle, taskDescr, taskDueDate, completeStatus, taskPriority)
    taskProject.tasks.push(i)
    return i
}

const findTask = (taskTitle, taskDescr, taskDueDate, taskPriority, completeStatus=false, taskProject=generalInbox.allProj) => {
    let target = task(taskTitle, taskDescr, taskDueDate, completeStatus, taskPriority)

    for (const proj of taskProject) {
        for (const task of proj.tasks) {
            if (_.isEqual(target, task)) {
                let taskIndex = _.findIndex(proj.tasks, target)
                return [proj.tasks, taskIndex]
            }
        }
    }
}

export { generalInbox, Project, defaultProj, Task, findTask }