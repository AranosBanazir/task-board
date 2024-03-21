//setting up localStorage namespaces if missing
if (!localStorage.getItem('tasks')){
    localStorage.setItem('tasks', '[]')
}

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));
let taskIds = getIds()
let newTaskID = 0



//pulls used ID's into an array and returns it for taskID variable
function getIds(){
    const localArray = []
    const taskList = JSON.parse(localStorage.getItem("tasks")) || [];
    for(const i in taskList){
        localArray.push(taskList[i].id)
    }
    return localArray
}


// Todo: create a function to generate a unique task id
function generateTaskId() {
//return new task id to handleAddTask
//if the list of ID's does not contain the saved next ID var then return the nextID var and set a new nextID
//else generate a new id
 
    
// returns a random number betwee 0 - 10,000
    const rndId = function(){
        return Math.floor(Math.random() * 10000)
    }

        //checks if the given ID is used or queued for next use
    const checkId = function(id){
        const num = rndId();

        if (taskIds.includes(id) || taskIds.includes(nextId)){
            checkId(num)
        }else{
            return num
        }
    }

    const newId = nextId || checkId(rndId())

    if (!nextId){
        localStorage.setItem('nextId', `${checkId(rndId())}`)

    }

    if (nextId && !taskIds.includes(nextId)){
        localStorage.setItem('nextId', `${checkId(rndId())}`)
        nextId = JSON.parse(localStorage.getItem('nextId'))
        return newId
    }

    return newId
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
    let taskInfo;
    
    
    // loop to find the right info by ID
    for(const i in taskList){
        if (taskList[i].id === task){
            taskInfo = taskList[i]
        }
    }


    if (taskInfo === undefined){
        throw new Error(`No information found for ID: ${task}. Failed to build card.`)  
    }


    const to_do = document.getElementById('todo-cards')
    //use DOM to create task card and child elements
    const container = document.createElement('div')
    const headDiv  = document.createElement('div')
    const title = document.createElement('h2')
    // const spacer = document.createElement('div')
    const desc = document.createElement('p')
    const date = document.createElement('p')
    const del = document.createElement('button')

    //Adding classes to created elements
    container.classList.add("task-card-container")
    headDiv.classList.add("task-card-headdiv")
    title.classList.add("task-card-title")
    // spacer.classList.add('task-card-spacer')
    desc.classList.add('task-card-desc')
    date.classList.add('task-card-date')
    del.classList.add('task-card-del')

    //Appending elements to the container
    const lane = taskInfo.state

    const position = document.querySelector(`.${lane}`)
    // console.log(position)
    position.appendChild(container)
    container.appendChild(headDiv)
    headDiv.appendChild(title)
    // container.appendChild(spacer)
    container.appendChild(desc)
    container.appendChild(date)
    container.appendChild(del)

    // console.log(taskInfo.name)
    // console.log(taskList)
    container.setAttribute('id', `container-${taskInfo.id}`)
    title.innerText = taskInfo.name
    desc.innerText = taskInfo.desc
    date.innerText = taskInfo.date
    del.onclick = function(){
        //call deletefunction
        handleDeleteTask(taskInfo.id)
    }
    del.innerText = "Delete"
    
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    const taskCards = document.querySelectorAll('.task-card-container')
    for (const task of taskCards){
        task.remove()
    }
    for(const id of taskIds){
        createTaskCard(id)
    }

    $('.task-card-container').draggable({})

}

// Todo: create a function to handle adding a new task
function handleAddTask(){
    const taskName = document.getElementById('task-input').value
    const taskDate = document.getElementById('task-date').value
    const taskDesc = document.getElementById('task-desc').value
    const djDate = `${dayjs(taskDate).$M + 1}/${dayjs(taskDate).$D}/${dayjs(taskDate).$y}`
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []
    const newTask = {
        date: djDate,
        name: taskName,
        desc: taskDesc,
        id: generateTaskId(),
        state: 'todo'
        
    }

    tasks.push(newTask)
    localStorage.setItem('tasks', JSON.stringify(tasks))
  
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const tempArr = []

    for(const task in tasks){
        if (tasks[task].id === event){

        }else{
            tempArr.push(tasks[task])
        }
    }

    localStorage.setItem('tasks', JSON.stringify(tempArr))
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
       
        
    }

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList()


    $('.card-row').droppable({
        drop: function(event, ui){
        const str = ui.draggable[0].id
        const id = str.replace('container-', '')
        const tasks = JSON.parse(localStorage.getItem('tasks')) || []
        

        if (event.target.classList.contains('todo')){
            // console.log('still needs done')
            for (const task in tasks){
                if (tasks[task].id == id){
                    tasks[task].state = 'todo'
                }
               }
        }else if (event.target.classList.contains('in-progress')){
            for (const task in tasks){
                if (tasks[task].id == id){
                    tasks[task].state = 'in-progress'
                }
               }
        }else if (event.target.classList.contains('done')){
            for (const task in tasks){
                if (tasks[task].id == id){
                    tasks[task].state = 'done'
                }
               }
        }
        
       
        localStorage.setItem('tasks', JSON.stringify(tasks))
        renderTaskList()
        }
    })


})