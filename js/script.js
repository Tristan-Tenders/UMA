import { fetchData } from './utils/fetchData.js';
import { formFactory } from "./utils/formFactory.js"
import { putDataResponse } from "./utils/putData.js";

const remoteUrl = 'https://easy-simple-users-rest-api.onrender.com/api/users';
const localUrl = './Mockdata/response.json';
let users = [];

const alert = document.querySelector(".alert")
const spinner = document.querySelector(".spinner-border")
const submitBtn = document.querySelector(".submit-btn");
submitBtn.addEventListener("click", async () => {
	const dataToSend = {
		name: document.querySelector("#userName").value,
		age: document.querySelector("#userAge").value,
		avatar_url: document.querySelector("#userImage").value,
		gender: document.querySelector("#userGender").value,
		id: document.querySelector(".submit-btn").getAttribute("data-user-id"),
	};

	await putDataResponse(remoteUrl, dataToSend); // wait for response
	console.log("Update submitted:", dataToSend); // debug log
});


const addEventListeners = (e) => {
	const editButtons = document.querySelectorAll(".btn-secondary")
	editButtons.forEach((button) => {
		button.addEventListener("click", (e) => {

			document.querySelector(".modal-body").innerHTML = ""
			document.querySelector(".modal-body").appendChild(formFactory())
			const foundUser = users.find(
				(user) => user.id === parseInt(e.target.getAttribute("data-user-id"))
			)
			document.querySelector(".modal-body").innerHTML = "";
			document.querySelector(".modal-body").appendChild(formFactory());
			getModalForm(foundUser)
		})
	})

}

const getModalForm = (foundUser) => {
	const modalForm = document.querySelector(".modal-body").querySelector("form")
	modalForm.querySelector("#userName").value = foundUser.name;
	modalForm.querySelector("#userAge").value = foundUser.age;
	modalForm.querySelector("#userImage").value = foundUser.avatar_url;
	modalForm.querySelector("#userGender").value = foundUser.gender;
	submitBtn.setAttribute("data-user-id", foundUser.id)
}


const loadData = async () => {
	spinner.classList.remove("d-none")
	try {
		console.log("Fetching data...")
		const data = await fetchData(localUrl)
		if (data) {
			spinner.classList.add("d-none")
			users = data.data // set the users variable
			displayUsers(users) // pass users to displayUsers
			addEventListeners()
		}
	} catch (error) {
		console.error("Failed to load data:", error.message)
		spinner.classList.add("d-none")
		alert.classList.remove("d-none")
		alert.classList.add("alert-danger")
		alert.innerHTML = `Failed to load data: ${error.message}`
	}
}

const displayUsers = (localUsers) => {
if (!localUsers || localUsers.length === 0) {
		alert.classList.remove("d-none")
		alert.classList.add("alert-danger")
		alert.innerHTML = "No users found."
		return
	}
	localUsers.forEach((user) => {
		const usersContainer = document.getElementById("users-container")
		usersContainer.innerHTML += `
		<article class="card">
				<div class="card-image">
					<img src="${user.avatar_url}" alt="${user.name}" class="card-img-top" />
					<span class="card-title">${user.name}</span>
				</div>

				<div class="card-content">
					<ul class="list-group">
						<li class="list-group-item"><strong>Name:</strong>${user.name}</li>
						<li class="list-group-item"><strong>Age:</strong>${user.age}</li>
						<li class="list-group-item">
							<strong>Gender:</strong> ${user.gender}
						</li>
					</ul>
					<button data-user-id="${user.id}" data-bs-target="#exampleModal" data-bs-toggle="modal" class="edit-btn btn btn-secondary m-2">Edit</button>
				</div>
			</article>
`
	})
	
}
loadData()
