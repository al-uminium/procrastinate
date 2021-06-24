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
const Task = (taskTitle,taskDescr, taskDueDate, taskPriority, completeStatus=false, taskProject=defaultProj) => {
    const i = task(taskTitle,taskDescr, taskDueDate, completeStatus=false, taskPriority)
    taskProject.tasks.push(i)
    return i
}

//Delete task 
const delTask = (targetTask) => {
    //targetTask is not an actual task object, so will have to recreate it

    // let targetTask = task("","","","","") 

    //Find where the task is stored
    //Operation is O(n), maybe can optimize?
    for (const proj of generalInbox) {

        // _.filter(proj, (o) => !(_.isEqual(o, targetTask)))

        for (let i = 0; i < proj.length; i++) {
            if (_.isEqual(proj[i], targetTask)) {
                proj.splice(i,1)
            }
        }
    }
}

export { generalInbox, Project, defaultProj, Task }