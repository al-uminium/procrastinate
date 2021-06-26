import { inbox, projects, task } from './components/classes.js'
import { generalInbox, Project, defaultProj, Task, delTask } from './components/logic'
import { eventListeners, hideTaskContainers, renderTask } from './components/DOM.js'
import _ from 'lodash'
import "./styles/main.scss"
import "./styles/modal.scss"
import "./styles/tasks.scss"

Task("get milk","get milk in sheng shiong", "2021-06-21", "low")

// console.log(generalInbox.getAllTasks())

renderTask()
eventListeners().newTaskEL()
