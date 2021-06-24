import { inbox, projects, task } from './components/classes.js'
import { generalInbox, Project, defaultProj, Task, delTask } from './components/logic'
import { eventListeners, renderTask } from './components/DOM.js'
import _ from 'lodash'
import "./styles/main.scss"
import "./styles/modal.scss"
import "./styles/tasks.scss"


let task1 = Task("get milk", "go shengshiong get milk", "21/6/2021", "none")
let task2 = Task("cry", "cry and then stop crying", "", "high")

// console.log(generalInbox.getAllTasks())

eventListeners().newTaskEL()
renderTask()