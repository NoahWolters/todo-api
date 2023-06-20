"use strict";
const todoInput = document.querySelector("#todoInput");
const addButton = document.querySelector("#addButton");
const list = document.querySelector("#list");
const removeButton = document.querySelector("#removeButton");
let todoslist = [];

function todoApi() {
  fetch("http://localhost:4730/todos")
    .then((Response) => Response.json())
    .then((data) => {
      todoslist = data;
      render();
    });
}
function render() {
  list.innerHTML = "";
  todoslist.forEach((todo) => {
    const newList = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    checkbox.addEventListener("change", () => {
      todo.done = checkbox.checked;
    });

    newList.appendChild(checkbox);
    const todoText = document.createTextNode(todo.description);
    newList.appendChild(todoText);
    list.appendChild(newList);
  });
  addButton.addEventListener("click", () => {
    const newItem = todoInput.value;

    if (newItem !== "") {
      const todo = {
        description: newItem,
        done: false,
      };
      fetch("http://localhost:4730/todos", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(todo),
      })
        .then((Response) => Response.json())
        .then((todos) => {
          todoslist.push(todos);
          render();
        });

      todoInput.value = "";
    }
  });
  function deleteTodo() {
    const deleteTodos = todoslist.filter((todo) => todo.done);
    const deleteFetches = [];
    deleteTodos.forEach((todo) => {
      deleteFetches.push(
        fetch(`http://localhost:4730/todos/${todo.id}`, {
          method: "DELETE",
        })
      );
    });
    Promise.all(deleteFetches).then(() => {
      todoApi();
    });
  }
  removeButton.addEventListener("click", deleteTodo);
}
todoApi();
