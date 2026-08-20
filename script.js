const taskInput = document.getElementById(`taskInput`);
const taskAddBtn = document.getElementById(`taskAddBtn`);
const taskList = document.getElementById(`taskList`);
const message = document.getElementById(`message`);
const themes = document.getElementById("themes");
let taskArr = uploadTasks();
renderTasks();

taskList.addEventListener("click", (e) => {
  const taskDiv = e.target.closest(".taskDiv");
  if (!taskDiv) return;

  const currentIndex = taskDiv.dataset.index;
  if (e.target.closest(`.taskDeleteBtn`)) {
    deleteTask(currentIndex);
  } else if (e.target.closest(`.taskCheckbox`)) {
    completeTask(taskArr[currentIndex]);
  }
});
taskList.addEventListener("dblclick", (e) => {
  const task = e.target.closest(".taskContent");
  const taskDiv = e.target.closest(".taskDiv");

  if (!task) return;

  const currentIndex = taskDiv.dataset.index;
  editTask(currentIndex);
});
taskList.addEventListener("focusout", (e) => {
  const taskDiv = e.target.closest(".taskDiv");
  const editInput = e.target.closest(".taskEditInput");

  const currentIndex = taskDiv.dataset.index;
  if (!editInput) return;
  saveEditTask(currentIndex, editInput);
});
taskList.addEventListener("keydown", (e) => {
  const taskDiv = e.target.closest(".taskDiv");
  const editInput = e.target.closest(".taskEditInput");

  const currentIndex = taskDiv.dataset.index;
  if (!editInput) return;
  if (e.key === "Enter") {
    editInput.blur();
  }
});
function renderTasks() {
  taskList.innerHTML = taskArr
    .sort(
      (a, b) =>
        a.completed - b.completed ||
        b.completedAt - a.completedAt ||
        b.createdAt - a.createdAt,
    )
    .map(function (item, index) {
      return `<div class="taskDiv${item.completed ? " completed" : ""}" data-index="${index}">
        <input type="checkbox" id="checkbox${index}" class="taskCheckbox" ${item.completed ? "checked" : ""}/>
        <label for="checkbox${index}" class="customTaskCheckbox"></label>
        <div class="taskContent">
          ${
            item.isEditing
              ? `
              <input class="taskEditInput" type="text" value="${item.text}" />
            `
              : `
              <label class="taskLabel">
                ${item.text}
              </label>
            `
          }

          <button class="taskDeleteBtn">x</button>
        </div>
      </div>`;
    })
    .join(``);

  let activeEditInput = document.querySelector(".taskEditInput");
  if (activeEditInput) {
    makeFocusedInput(activeEditInput);
  }

  saveTasks(taskArr);

  renderTaskCount();
}
function makeFocusedInput(input) {
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
}
function editTask(index) {
  taskArr[index].isEditing = !taskArr[index].isEditing;

  renderTasks();
}
function saveEditTask(index, editInput) {
  if (taskArr[index].isEditing) {
    taskArr[index].text = editInput.value;
    console.log(editInput.value);
  }
  editTask(index);
}
function saveTasks(tasks) {
  localStorage.setItem(`tasks`, JSON.stringify(tasks));
  console.log(`Данные сохранены`);
}
function uploadTasks() {
  const tasksFromLocalStorage = localStorage.getItem(`tasks`);
  if (!tasksFromLocalStorage) return [];
  console.log(`Данные выгружены`);
  return JSON.parse(tasksFromLocalStorage);
}
function renderTaskCount() {
  let taskCount = document.getElementById(`taskCount`);
  taskCount.innerHTML = `Всего задач: ${taskArr.length}
      Выполнено: ${taskArr.filter((item) => item.completed === true).length}
      Осталось выполнить: ${taskArr.filter((item) => item.completed === false).length} `;
}
function completeTask(task) {
  task.completed = !task.completed;
  if (task.completed) {
    task.completedAt = Date.now();
  } else task.completedAt = null;
  renderTasks();
}
function deleteTask(taskIndex) {
  taskArr.splice(taskIndex, 1);
  renderTasks();
}

function addNewTask() {
  if (taskInput.value != ``) {
    message.innerHTML = ``;
    taskArr.push({
      text: taskInput.value,
      completed: false,
      isEditing: false,
      createdAt: Date.now(),
      completedAt: null,
    });
    renderTasks();
  } else {
    message.innerHTML = `Заполните поле`;
  }
}
taskAddBtn.addEventListener(`click`, function () {
  addNewTask();
});
taskInput.addEventListener(`keydown`, function (event) {
  if (event.key === `Enter`) {
    addNewTask();
  }
});

function setTheme(nameTheme) {
  document.body.setAttribute("data-theme", nameTheme);
}
themesArr = [
  { name: "classic" },
  { name: "dark" },
  { name: "white" },
  { name: "red" },
];

themesArr.forEach((element) => {
  element.btn = document.createElement("button");
  element.btn.classList.add("themeBtn");
  themes.appendChild(element.btn);
  element.btn.setAttribute("data-theme-value", element.name);
  element.btn.addEventListener("click", () => setTheme(element.name));
});
