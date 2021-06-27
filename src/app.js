import { defaultProj} from './components/logic'
import { eventListeners, renderProject, renderTask } from './components/DOM.js'
import _ from 'lodash'
import "./styles/main.scss"
import "./styles/modal.scss"
import "./styles/tasks.scss"
import "./styles/project.scss"

renderTask(defaultProj)
renderProject()
eventListeners().newTaskEL()
eventListeners().projectEL()
eventListeners().addProjectEL()
