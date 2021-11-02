const todoAppContainer = document.getElementById("app-container");
const todoApp = document.getElementById("todo-app");
const todoForm = document.getElementById("todoForm");
const nameForm = document.getElementById("nameForm");
const nameTextInput = document.getElementById("nameTextInput");
const todoTextInput = document.getElementById("todoTextInput");
const todoColorInput = document.getElementById("colorPicker");
const todoTitle = document.getElementById("todoTitle");
const todosList = document.getElementById("todos");
const titleColorInput = document.getElementById("titleColorPicker");
const resetForm = document.getElementById("reset");

let username = localStorage.getItem("name");
let todos = localStorage.getItem("todos");
let defaultColor = "#ffffff";
let titleColor = "#ff00ff";

function displayNameInput() {
    titleColorPicker.value = titleColor;
    nameForm.style.display = "block";
    todoAppContainer.style.display = "none";
    todos = [];
}

function displayTodoApp() {
    nameForm.style.display = "none";
    todoAppContainer.style.display = "block";
    titleColor = localStorage.getItem("titleColor");
    todoTitle.innerText = username.toUpperCase() + "'S TODO LIST";
    todoTitle.style.color = titleColor;
    nameForm.style.display = "none";

    defaultColor = localStorage.getItem("color");
    if(defaultColor === null) {
        defaultColor = "#ffffff";
    }
    todoColorInput.value = defaultColor;

    todos = localStorage.getItem("todos");
    if(todos === null) {
        todos = [];
        localStorage.setItem("todos", JSON.stringify(todos));
    } else {
        todos = JSON.parse(todos);
        refreshTodoList();
    }
}

function checkEmpty(textInput, errorMessage) {
    if(textInput.value === "") {
        textInput.classList.add("wiggleAni");
        textInput.setAttribute("placeholder", errorMessage);
        return false;
    } else {
        return true;
    }
}

function refreshTodoList() {
    localStorage.setItem("color", todoColorInput.value);
    localStorage.setItem("todos", JSON.stringify(todos));

    todosList.innerHTML = "";

    for(let todo of todos) {
        const li = document.createElement("li");

        li.style.color = todo.color;
        li.dataset.id = todos.indexOf(todo);

        const tb = document.createElement("span");
        tb.innerText = todo.text;
        tb.classList.add("text");
        li.appendChild(tb);

        const cb = document.createElement("input");
        cb.setAttribute("type", "checkbox");
        cb.classList.add("checkbox");
        li.prepend(cb);

        const xb = document.createElement("span");
        xb.classList.add("deleteButton");
        xb.innerText = "X";
        xb.style.borderColor = todo.color;
        li.prepend(xb);

        if(todo.complete) {
            tb.style.textDecoration = "line-through";
            cb.checked = true;
        }

        todosList.appendChild(li);
    }
}

if(username === null) {
    displayNameInput();
} else {
    displayTodoApp();
}

nameForm.addEventListener("submit", function(event) {
    event.preventDefault();

    let un = nameTextInput.value;

    if(checkEmpty(nameTextInput, "You must enter a name!")) {
        username = un;
        localStorage.setItem("name", username);
        titleColor = titleColorInput.value;
        localStorage.setItem("titleColor", titleColor);
        displayTodoApp();
    }
});

nameTextInput.addEventListener("input", function(event) {
    nameTextInput.classList.remove("wiggleAni");
    nameTextInput.setAttribute("placeholder", "What is your name?");
    nameTextInput.value = nameTextInput.value.toUpperCase();
});

todoColorInput.addEventListener("input", function() {
    defaultColor = todoColorInput.value;
    localStorage.setItem("color", defaultColor);
});

todoForm.addEventListener("submit", function(event) {
    event.preventDefault();

    let todoText = todoTextInput.value;

    if(checkEmpty(todoTextInput, "You must type something for your todo!")) {
        let todo = {text: todoText, complete: false, color: todoColorInput.value};
        todos.push(todo);
        refreshTodoList();
        todoTextInput.value = "";
    }
});

todoTextInput.addEventListener("input", function(event) {
    todoTextInput.classList.remove("wiggleAni");
    todoTextInput.setAttribute("placeholder", "Type your todo here.");
});

todosList.addEventListener("click", function(event){
    let cb, li;

    if(event.target.type === "checkbox") {
        cb = event.target;
        li = event.target.parentElement;
        const i = li.dataset.id;
        if(cb.checked) {
            todos[i].complete = true;
        } else {
            todos[i].complete = false;
        }
    } else if(event.target.classList.contains("text")) {
        li = event.target.parentElement;
        cb = event.target.parentElement.children[1];
        const i = li.dataset.id;
        if(cb.checked) {
            todos[i].complete = false;
            cb.checked = false;
        } else {
            todos[i].complete = true;
            cb.checked = true;
        }
    } else if(event.target.classList.contains("deleteButton")) {
        li = event.target.parentElement;
        let b = window.confirm("Are you sure you want to delete this todo?");
        if(b) {
            const i = li.dataset.id;
            todos.splice(i, 1);
        }
    }
    else {
        return; // do nothing
    }

    refreshTodoList();
});

resetForm.addEventListener("submit", function(event) {
    event.preventDefault();
    let b = window.confirm("Are you sure you want to reset everything and start over?");
    if(b) {
        localStorage.clear();
        location.reload();
    }
});