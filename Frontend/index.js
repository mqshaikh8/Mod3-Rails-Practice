//Code your solution here
document.addEventListener("DOMContentLoaded", () => {
  const selectBox = document.getElementById('list-select')
  const mainListName = document.getElementById('main-list-name')
  const mainTasks = document.getElementById('main-list-tasks')
  const containerForm = document.getElementById('task-form-container')
  fetch("http://localhost:3000/lists")
  .then(res => res.json())
  .then(lists => lists.forEach((list) => {
    selectBox.append(renderList(list))
  }))

  selectBox.addEventListener("change", handleSelect)
  mainTasks.addEventListener("click", handleClick)

  function renderList(list) {
    let option = document.createElement("option")
    option.value = list.id
    option.innerText = list.name
    return option
  }

  function handleSelect(event){
    fetchMainList(event.target.value)
  }

  function fetchMainList(id){
    fetch(`http://localhost:3000/lists/${id}`)
    .then(res => res.json())
    .then(renderMainList)
  }

  function renderMainList(list){
    mainListName.innerText = `${list.name} - ${list.priority}`
    mainTasks.innerHTML = ''
    list.tasks.forEach(task => mainTasks.append(renderTask(task)))
    containerForm.innerHTML = `<form data-id=${list.id} id="new-task-form">
      <label>Task Name:</label>
      <input type="text" id="task-name">
      <input type="submit">
    </form>`

    document.getElementById('new-task-form').addEventListener("submit", handleSubmit)
  }

  function renderTask(task){
    const li = document.createElement("li")
    li.className = "list-group-item d-flex justify-content-between align-items-center"
    if (task.done) {
      li.innerHTML += `${task.name} <input type="checkbox" data-id=${task.id} checked class="task-checkbox">`
    } else {
      li.innerHTML += `${task.name} <input type="checkbox" data-id=${task.id} class="task-checkbox">`
    }
    return li
  }

  function handleClick(event){
    if(event.target.classList.contains("task-checkbox")){
      const checkbox = event.target
      const boolean = checkbox.checked
      const id = checkbox.getAttribute("data-id")
      fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json',
          'Accepts': 'application/json'
        },
        body: JSON.stringify({
          done: boolean
        })
      })
      .then(res => res.json())
      .then(console.log)
    }
  }

  function handleSubmit(event){
    event.preventDefault()
    const name = event.target["task-name"].value
    const list_id = event.target.getAttribute("data-id")
    const done = false
        fetch(`http://localhost:3000/tasks`, {
          method: "POST",
          headers:{
            'Content-Type': 'application/json',
            'Accepts': 'application/json'
          },
          body: JSON.stringify({done, name, list_id})
        })
        .then(res => res.json())
        .then(task => mainTasks.append(renderTask(task)))
  }
})
