//setting up localStorage namespaces if missing
if (!localStorage.getItem('tasks')){
    localStorage.setItem('tasks', '[]')
}

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
let taskIds = getIds()
let newTaskID = 0

//pulls used ID's into an array and returns it for taskID variable
function getIds(){
    const localArray = []
    for(const task in taskList){
        localArray.push(taskList[task].id)
    }
    return localArray
}


// Todo: create a function to generate a unique task id
function generateTaskId() {
//return new task id to handleAddTask
//if the list of ID's does not contain the saved next ID var then return the nextID var and set a new nextID
//else generate a new id
}

// Todo: create a function to create a task card
function createTaskCard(task) {

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

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
        id: generateTaskId()
    }

    tasks.push(newTask)
    localStorage.setItem('tasks', JSON.stringify(tasks))
    console.log(taskName, taskDesc, djDate )
    console.log(dayjs(djDate))
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    
});

//adding function for button click MIGHT CHANGE
