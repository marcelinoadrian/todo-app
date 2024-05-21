const todoForm = document.querySelector('#todo-form')
const todoList = document.querySelector('.todos')
const totalTasks = document.querySelector('#total-tasks')
const completedTasks = document.querySelector('#completed-tasks')
const remainingTasks = document.querySelector('#remaining-tasks')

const mainInput = document.querySelector('#todo-form input')

let tasks = JSON.parse(localStorage.getItem('tasks')) || []

if(localStorage.getItem('tasks'))
{
    tasks.map((task) =>{
        createTask(task)
    })
}

todoForm.addEventListener('submit', (e) =>{
    e.preventDefault()

    const inputValue = mainInput.value

    if(inputValue === '')
    {
        return
    }

    // input data to be stored as object
    const task = {
        id: new Date().getTime(),
        name: inputValue,
        isCompleted: false

    }

    // add task object into tasks array
    tasks.push(task)
    // store the tasks array to local storage, by stringifying it first
    localStorage.setItem('tasks', JSON.stringify(tasks))

    createTask(task)
    todoForm.reset()
    mainInput.focus()
})

// event listener for remove or delete button
todoList.addEventListener('click', (e) =>
{
    // multiple conditions as the structure of the svg can have different target of clicks
    if(e.target.classList.contains('remove-task') || e.target.parentElement.classList.contains('remove-task') || e.target.parentElement.parentElement.classList.contains('remove-task'))
    {
        const taskId = e.target.closest('li').id
        removeTask(taskId)
    }
})

todoList.addEventListener('keydown', (e) =>
{
    if(e.keyCode === 13)
    {
        e.preventDefault()
        e.target.blur()
    }
})

// event listener for updating the task name
todoList.addEventListener('input', (e) =>
{
    const taskId = e.target.closest('li').id
    updateTask(taskId, e.target)
})

// function for creating the list element, displayable content
function createTask(task)
{
    const taskEl = document.createElement('li')

    taskEl.setAttribute('id', task.id)

    if (task.isCompleted)
    {
        // if task is completed, complete class will be added to the list element
        taskEl.classList.add('complete')
    }

    const taskElMarkup = `
        <div>
        <input type="checkbox" class="checkbtn" name="tasks" id="${task.id}" ${task.isCompleted ? 'checked' : ''}>
        <span ${!task.isCompleted ? 'contenteditable' : ''}>${task.name}</span>
    </div>
    <button title="Remove the" ${task.name}" task" class="remove-task">
        
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4L19 4.01L12 11L5 4.01L4 4V5L11 12L4 19V20H5L12 13L19 20H20V19L13 12L20 5V4Z" fill="#1C2E45"
                    fill-opacity="0.6" />
            </svg>
    </button>
    `

    taskEl.innerHTML = taskElMarkup

    todoList.appendChild(taskEl)
    countTasks()
}

function countTasks()
{
     const completedTasksArray = tasks.filter((task) => task.isCompleted === true)

     totalTasks.textContent = tasks.length
     completedTasks.textContent = completedTasksArray.length
     remainingTasks.textContent = tasks.length - completedTasksArray.length

}

// function for removing task through the event listener
function removeTask(taskId)
{

    // filters tasks in the local storage that doesnt have ID or same ID
    tasks = tasks.filter((task) => task.id !== parseInt(taskId))

    // restore again the tasks aray into the local storage
    localStorage.setItem('tasks', JSON.stringify(tasks))

    // removing the element from the document by determining its element ID
    document.getElementById(taskId).remove()

    // updates the count of the tasks
    countTasks()
}

function updateTask(taskId, el)
{
    // find in the tasks array which has the ID same as the ID being set in  the argument
    const task = tasks.find((task) => task.id === parseInt(taskId))


    // checks if the click targets the checkbox or the editable text element
    // where the text element has content editable attribute set in it
    if (el.hasAttribute('contenteditable'))
    {
            task.name = el.textContent

    }
    else if(el.classList.contains('checkbtn'))
    {
        const span = el.nextElementSibling
        const parent = el.closest('li')

        // for undoing the checkbox
        task.isCompleted = !task.isCompleted

        if(task.isCompleted)
        {
            span.removeAttribute('contenteditable')
            parent.classList.add('complete')
        }
        else
        {
            span.setAttribute('contenteditable', 'true')
            parent.classList.remove('complete')
        }
    }
    

    localStorage.setItem('tasks', JSON.stringify(tasks)) 
    countTasks()
}