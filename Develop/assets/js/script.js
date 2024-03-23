//setting up localStorage namespaces if missing
if (!localStorage.getItem("tasks")) {
  localStorage.setItem("tasks", "[]");
}

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId"));
let taskIds = getIds();
let newTaskID = 0;
const form = document.querySelector("form");
const addTask = document.querySelector(".btn");

//pulls used ID's into an array and returns it for taskID variable
function getIds() {
  const tempArr = [];
  const taskList = JSON.parse(localStorage.getItem("tasks")) || [];
  for (const i in taskList) {
    tempArr.push(taskList[i].id);
  }
  return tempArr;
}

//Compare and change styles based on date due
function setTaskColors(task) {
  const taskList = JSON.parse(localStorage.getItem("tasks")) || [];
  const element = document.getElementById(`container-${task}`);
  const headerDivEl = document.querySelector(`#container-${task} .task-card-headdiv`);
  let taskInfo;

  const lateStyles = {
    backgroundColor: "red",
    color: "white",
  };
  const earlyStyles = {
    backgroundColor: "white",
    color: "black",
  };
  const soonStyles = {
    backgroundColor: "goldenrod",
    color: "white",
  };

  // loop to find the right info by ID
  for (const i in taskList) {
    if (taskList[i].id == task) {
      taskInfo = taskList[i];
    }
  }

  //checkes the saved state of the task, and sets the style based on the style info above
  if (taskInfo.state == "done") {
    for (const style in earlyStyles) {
      element.style[style] = earlyStyles[style];
    }
    headerDivEl.style.backgroundColor = "rgba(189, 177, 183, 0.8)";
    //uses Dayjs to check if the dates are before or after the due date of the task
  } else if (dayjs().isBefore(dayjs(taskInfo.date))) {
    if (dayjs(taskInfo.date).$D - dayjs().$D <= 3 && dayjs(taskInfo.date).$D - dayjs().$D >= 0) {
      for (const style in soonStyles) {
        element.style[style] = soonStyles[style];
      }
    }else{
        for (const style in earlyStyles) {
            element.style[style] = earlyStyles[style];
          }
          headerDivEl.style.backgroundColor = "rgba(189, 177, 183, 0.8)";
    }
    //checks if the due date of the task is after the current date, or if the date is today
    } else if (dayjs().isAfter(dayjs(taskInfo.date))) {
         if (dayjs(taskInfo.date).$D - dayjs().$D === 0){
          for (const style in soonStyles) {
            element.style[style] = soonStyles[style];
          }
            


        }else{
            for (const style in lateStyles) {
            element.style[style] = lateStyles[style];
            }
        }
    }
  }


//create a function to generate a unique task id
function generateTaskId() {
  //return new task id to handleAddTask
  //if the list of ID's does not contain the saved next ID var then return the nextID var and set a new nextID
  //else generate a new id

  // returns a random number betwee 0 - 10,000
  const rndId = function () {
    return Math.floor(Math.random() * 10000);
  };

  //checks if the given ID is used or queued for next use
  const checkId = function (id) {
    const num = rndId();

    if (taskIds.includes(id) || taskIds.includes(nextId)) {
      checkId(num);
    } else {
      return num;
    }
  };

  const newId = nextId || checkId(rndId());

  if (!nextId) {
    localStorage.setItem("nextId", `${checkId(rndId())}`);
  }

  if (nextId && !taskIds.includes(nextId)) {
    localStorage.setItem("nextId", `${checkId(rndId())}`);
    nextId = JSON.parse(localStorage.getItem("nextId"));
    return newId;
  }

  return newId;
}

//create a function to create a task card
function createTaskCard(task) {
  const taskList = JSON.parse(localStorage.getItem("tasks")) || [];
  let taskInfo;

  // loop to find the right info by ID
  for (const i in taskList) {
    if (taskList[i].id === task) {
      taskInfo = taskList[i];
    }
  }

  if (taskInfo === undefined) {
    throw new Error(
      `No information found for ID: ${task}. Failed to build card.`
    );
  }

  const to_do = document.getElementById("todo-cards");
  //use DOM to create task card and child elements
  const container = document.createElement("div");
  const headDiv = document.createElement("div");
  const title = document.createElement("h2");
  // const spacer = document.createElement('div')
  const desc = document.createElement("p");
  const date = document.createElement("p");
  const del = document.createElement("button");

  //Adding classes to created elements
  container.classList.add("task-card-container");
  headDiv.classList.add("task-card-headdiv");
  title.classList.add("task-card-title");
  // spacer.classList.add('task-card-spacer')
  desc.classList.add("task-card-desc");
  date.classList.add("task-card-date");
  del.classList.add("task-card-del");

  //Appending elements to the container
  const lane = taskInfo.state;

  const position = document.querySelector(`.${lane}`);
  // console.log(position)
  position.appendChild(container);
  container.appendChild(headDiv);
  headDiv.appendChild(title);
  // container.appendChild(spacer)
  container.appendChild(desc);
  container.appendChild(date);
  container.appendChild(del);

  // console.log(taskInfo.name)
  // console.log(taskList)
  container.setAttribute("id", `container-${taskInfo.id}`);
  title.innerText = taskInfo.name;
  desc.innerText = taskInfo.desc;
  date.innerText = taskInfo.date;
  del.onclick = function () {
    //call deletefunction
    handleDeleteTask(taskInfo.id);
    renderTaskList();
  };
  del.innerText = "Delete";
}

//create a function to render the task list and make cards draggable
function renderTaskList() {
  const taskCards = document.querySelectorAll(".task-card-container");
  //updates the task list from LS
  getIds();

  for (const task of taskCards) {
    //deletes all tasks so they can be redrawn
    task.remove();
  }
  for (const id of taskIds) {
    createTaskCard(id);
    //creates and sets styles for the tasks based on saved unique id
    setTaskColors(id);
  }

  //makes tasks draggable and unable to be dragged outside of the bounds of the lanes, as well as stacking them above the lanes
  //to prevent tasks from going under the lane div's

  $(".task-card-container").draggable({
    containment: '.swim-lanes',
    stack: '.swim-lanes'
  });
}

// Todo: create a function to handle adding a new task
function handleAddTask() {
  const taskName = document.getElementById("task-input").value;
  const taskDate = document.getElementById("task-date").value;
  const taskDesc = document.getElementById("task-desc").value;
  const djDate = `${dayjs(taskDate).$M + 1}/${dayjs(taskDate).$D}/${
    dayjs(taskDate).$y
  }`;
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const newTask = {
    date: djDate,
    name: taskName,
    desc: taskDesc,
    id: generateTaskId(),
    state: "todo",
  };

  //adds new task info to the task array and then pushes the info back into local storage
  tasks.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const tempArr = [];
  //takes the deleted task's id and pushes all the id's except for the delted id into the list of id's 
  for (const task in tasks) {
    if (tasks[task].id === event) {
    } else {
      tempArr.push(tasks[task]);
    }
  }

  taskIds.splice(taskIds.indexOf(event), 1);

  localStorage.setItem("tasks", JSON.stringify(tempArr));
}

// when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList();

  $(".card-row").droppable({
    drop: function (event, ui) {
      const str = ui.draggable[0].id;
      const id = str.replace("container-", "");
      const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

      console.log("dropped");
      if (event.target.classList.contains("todo")) {
        // console.log('still needs done')
        for (const task in tasks) {
          if (tasks[task].id == id) {
            tasks[task].state = "todo";
          }
        }
      } else if (event.target.classList.contains("in-progress")) {
        for (const task in tasks) {
          if (tasks[task].id == id) {
            tasks[task].state = "in-progress";
          }
        }
      } else if (event.target.classList.contains("done")) {
        for (const task in tasks) {
          if (tasks[task].id == id) {
            tasks[task].state = "done";
          }
        }
      }

      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTaskList();
      setTaskColors(id);
    },
  });
});



const btn = document.querySelector("#form-add-task");
const cbtn = document.querySelector('#close-btn')

//adds task and reloads the page
btn.addEventListener("click", function () {
  handleAddTask()
  location.reload()
});

//closes the modal form
cbtn.addEventListener('click', function(){
  location.reload()
})