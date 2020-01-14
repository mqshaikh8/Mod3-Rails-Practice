const dropDown = document.querySelector("#list-select")
const taskList = document.querySelector("#main-list-tasks")
const formContainer = document.querySelector("#task-form-container")
const listHeader = document.querySelector("#main-list-name")
console.log(listHeader)
console.log
fetch("http://localhost:3000/lists")
.then(r => r.json())
.then(obj => {
    obj.forEach(element => {
        const option = document.createElement("option")
        option.innerText = element.name
        option.value = element.id
        dropDown.append(option)
        
    });
    dropDown.addEventListener("change", e =>{
        
        const item = obj[e.target.value - 1]
       
        listHeader.innerText = `${item.name} - ${item.priority}`
        taskList.innerText = ""
        item.tasks.forEach( task => {
            makeTaskList(task)
        })
       
        formMaker(obj[e.target.value - 1])
    })
    
})

{/* <form id="new-task-form">
  <label for="task-name">Task Name:</label>
  <input type="text" id="task-name" >
  <input type="submit" value="Create new Task">
</form> */}

function formMaker(item){
    formContainer.innerText = ""
    const form = document.createElement("form")
    form.id = "new-task-form"

    const label = document.createElement("label")
    label.setAttribute("for", "task-name")
    label.innerText = "Task Name:"

    const inputField = document.createElement("input")
    inputField.type = "text"
    inputField.id = "task-name"

    const bttn = document.createElement("input")
    bttn.type = "submit"
    bttn.value = "Create new Task"

    form.append(label,inputField,bttn)

    formContainer.append(form)

    form.addEventListener("submit",e => {
        e.preventDefault()
        const name = e.target["task-name"].value
        
        fetch("http://localhost:3000/tasks",{
            method: "POST",
            headers:
            {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body:JSON.stringify({
                "name": name,
                "done": "false",
                "list_id": item.id
 
            })
        })
        .then(r => r.json())
        .then(makeTaskList)

    })
}
function makeTaskList(task){
    const taskLi = document.createElement("li")
    const checkBox = document.createElement("input")

    checkBox.type = "checkbox"
    checkBox.className = "task-checkbox"
    // checkBox.setAttribute("checked", task.done)
    console.log("this is task",task.done)
    // console.log(checkBox.attributes.checked)
    if(task.done){
        checkBox.setAttribute("checked", task.done )
    }
    
    // checkBox.setAttribute("checked", task.done )
    checkBox.addEventListener("click", e => {
        // debugger;
        // console.log("this is e",e)
        // console.log("this is checkbox",checkBox)
        const bool = checkedOrNot(checkBox)
        checkBox.setAttribute("checked", bool )
        fetch(`http://localhost:3000/tasks/${task.id}`,{
            method: "PATCH",
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
            body: JSON.stringify({
                "done":bool
            })
          
          
        })
        .then(res => res.json())
        .then(r => {
            console.log(task.done)
            task.done = !task.done
            console.log(task.done)
        })
    })


    taskLi.className = "list-group-item d-flex justify-content-between align-items-center"
    taskLi.innerText = task.name

    taskLi.append(checkBox)

    taskList.append(taskLi)

}

function checkedOrNot(checkBox){
    console.log(checkBox.attributes.checked)
    if (checkBox.attributes.checked){
        return checkBox.attributes.checked = false
    }
    else{
        return checkBox.attributes.checked = true
    }
}