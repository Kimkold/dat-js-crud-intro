// ============ GLOBAL VARIABELS ============ //
const endpoint =
  "https://race-dat-v2-default-rtdb.europe-west1.firebasedatabase.app"; // To do: paste url to endpoint
let selectedUser;

// ============ READ ============ //
// Read (GET) all users from Firebase (Database) using REST API
async function readUsers() {
  const response = await fetch(`${endpoint}/users.json`);
  const data = await response.json();
  const users = Object.keys(data).map((key) => ({ id: key, ...data[key] })); // from object to array
  const filteredusers = users.filter(
    (user) => user.title === "Senior Lecturer"
  );
  filteredusers.sort((user1, user2) => user1.name.localeCompare(user2.name));
  return filteredusers;
}

// Create HTML and display all users from given list
function displayUsers(list) {
  // reset <section id="users-grid" class="grid-container">...</section>
  document.querySelector("#users-grid").innerHTML = "";
  //loop through all users and create an article with content for each
  for (const user of list) {
    document.querySelector("#users-grid").insertAdjacentHTML(
      "beforeend",
      /*html*/ `
            <article>
                <h2>${user.name}</h2>
                <img src="${user.image}">
                <p>${user.title}</p>
                <p>${user.age}</p>
                <p>${user.telefonnr}</p>
                <a href="mailto:${user.mail}">${user.mail}</a>
                <div class="btns">
                    <button class="btn-update-user">update</button>
                    <button class="btn-delete-user">delete</button>
                </div>
            </article>
        `
    );
    document
      .querySelector("#users-grid article:last-child .btn-update-user")
      .addEventListener("click", () => selectUser(user));
    document
      .querySelector("#users-grid article:last-child .btn-delete-user")
      .addEventListener("click", () => deleteUser(user.id));
    // To do: Add event listeners
  }
}

// ============ CREATE ============ //
// Create (POST) user to Firebase (Database) using REST API
async function createUser(event) {
  event.preventDefault();
  console.log("Opret Bruger");

  const name = event.target.name.value;
  const title = event.target.title.value;
  const age = event.target.age.value;
  const mail = event.target.mail.value;
  const telefonnr = event.target.telefonnr.value;
  const image = event.target.image.value;

  // To do: add variables with reference to input fields (event.target.xxxx.value)

  // create a new user
  const newUser = { name, title, age, mail, telefonnr, image }; // To do: add all fields/ variabels
  const userAsJson = JSON.stringify(newUser);
  const response = await fetch(`${endpoint}/users.json`, {
    method: "POST",
    body: userAsJson,
  });

  if (response.ok) {
    updateUsersGrid();
    scrollToTop();
    // if success, update the users grid
    // To do: make sure to update the users grid in order to display the new user
    // and scroll to top
    // To do: call scrollToTop to scroll when created
  }
}

// ============ UPDATE ============ //
function selectUser(user) {
  console.log(user); // Set global varaiable
  selectedUser = user;
  // reference to update form
  const form = document.querySelector("#form-update");
  form.name.value = user.name;
  form.title.value = user.title;
  form.age.value = user.age;
  form.mail.value = user.mail;
  form.telefonnr.value = user.telefonnr;
  form.image.value = user.image;

  // To do: set form input values with user.xxxx

  form.scrollIntoView({ behavior: "smooth" });
}

async function updateUser(event) {
  event.preventDefault();

  // To do: add variables with reference to input fields (event.target.xxxx.value)
  const name = event.target.name.value;
  const title = event.target.title.value;
  const age = event.target.age.value;
  const mail = event.target.mail.value;
  const telefonnr = event.target.telefonnr.value;
  const image = event.target.image.value;
  // update user
  const userToUpdate = { name, title, age, mail, telefonnr, image }; // To do: add all fields/ variabels
  const userAsJson = JSON.stringify(userToUpdate);
  const response = await fetch(`${endpoint}/users/${selectedUser.id}.json`, {
    method: "PUT",
    body: userAsJson,
  });
  if (response.ok) {
    updateUsersGrid();
    scrollToTop();
    // if success, update the users grid
    // To do: make sure to update the users grid in order to display the new user
    // and scroll to top
    // To do: call scrollToTop to scroll when created
  }
}

// ================== DELETE ============ //
async function deleteUser(id) {
  const response = await fetch(`${endpoint}/users/${id}.json`, {
    method: "DELETE",
  });
  if (response.ok) {
    updateUsersGrid();
    scrollToTop();
    // if success, update the users grid
    // To do: make sure to update the users grid in order to display the new user
  }
}

document.querySelector("#form-create").addEventListener("submit", createUser);
document.querySelector("#form-update").addEventListener("submit", updateUser);
// ================== Events and Event Listeners ============ //
// To do: add submit event listener to create form (#form-create)
// To do: add submit event listener to update form (#form-update)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function updateUsersGrid() {
  const users = await readUsers();
  displayUsers(users);
}

updateUsersGrid();

// ============ Init CRUD App ============ //
// To do: call/ run updateUsersGrid to initialise the app
