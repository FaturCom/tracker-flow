import { registerUserHandler } from "./auth/register.js";
import { loginUserHandler } from "./auth/login.js";
import { Tracker } from "./modules/tracker.js";

// halaman register
if(document.getElementById('formRegister')){
    document.getElementById('register-submit').addEventListener('click', (e) => {
        e.preventDefault()

        const username = document.getElementById('register-username').value
        const password = document.getElementById('register-password').value
        const confirmPassword = document.getElementById('register-password-confirm').value
        const authMessage = document.getElementById('auth-message-register')

        const result = registerUserHandler(username, password, confirmPassword)
        if(result.status == false){
            authMessage.classList.add('auth-error')
            authMessage.classList.remove('hidden')
            authMessage.textContent = result.message
        }else if(result.status == true){
            authMessage.classList.add('auth-successful')
            authMessage.classList.remove('hidden')
            authMessage.textContent = result.message

            setTimeout(() => {
                window.location.href = "../pages/tracker.html"
                document.getElementById('formRegister').reset();
            }, 1000)
        }
    })
}

// halaman login
if(document.getElementById('formLogin')){
    document.getElementById('login-submit').addEventListener('click', (e) => {
        e.preventDefault()

        const username = document.getElementById('login-username').value
        const password = document.getElementById('login-password').value
        const authMessage = document.getElementById('auth-message-login')

        const result = loginUserHandler(username, password)
        if(result.status == false){
            authMessage.classList.add('auth-error')
            authMessage.classList.remove('hidden')
            authMessage.textContent = result.message
        }else if(result.status == true){
            authMessage.classList.add('auth-successful')
            authMessage.classList.remove('hidden')
            authMessage.textContent = result.message

            setTimeout(() => {
                window.location.href = "../pages/tracker.html"
                document.getElementById('formLogin').reset();
            }, 1000)
        }
    })
}

// halaman tracker
if(document.querySelector('.activity-table')){
    const activityTableBody = document.querySelector('.activity-tbody');
    const activities = Tracker.showActivity();

    if(activities.length == 0){
        document.querySelector(".no-activity").classList.remove("hidden");
    }else{
        document.querySelector(".no-activity").classList.add("hidden");
        activities.forEach(activity => {
            const row = document.createElement('tr');
            row.setAttribute('data-id', activity.id);
            row.innerHTML = `
                <td data-name="${activity.name}">${activity.name}</td>
                <td data-weeklyTarget="${activity.weeklyTarget}">${activity.weeklyTarget}x</td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox"></td>
                <td><input type="checkbox"></td>
                <td>0%</td>
                <td class="activity-actions">
                    <button class="activity-actions-edit"><span class="material-symbols-outlined">edit</span></button>
                    <button class="activity-actions-delete"><span class="material-symbols-outlined">delete</span></button>
                </td>
            `;
            activityTableBody.appendChild(row);
        });
    }
}

// modal events
const formAddActivity = document.getElementById("activity-form");
let currentActions = "add";
let currentActivityId = null;
let oldData = null;

formAddActivity.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameActivity = document.getElementById("activityName").value;
    const targetActivity = parseInt(document.getElementById("WeeklyTarget").value);

    if(currentActions == "add"){
        const result = Tracker.addActivity({name: nameActivity, weeklyTarget: targetActivity});
        if(result.status == false){
            console.log(result.message);
        }else{
            console.log(result.message);
            document.querySelector(".modal-view").classList.add("hidden");
            formAddActivity.reset();
            location.reload();
        }
    }else if(currentActions == "edit"){
        const result = Tracker.editActivity(currentActivityId, {name: nameActivity, weeklyTarget: targetActivity}, oldData);
        if(result.status == false){
            console.log(result.message);
        }else{
            console.log(result.message);
            document.querySelector(".modal-view").classList.add("hidden");
            formAddActivity.reset();
            location.reload();
        }
    }
});

// open modal add activity
if(document.getElementById("add-button")){
    const buttonAdd = document.getElementById("add-button");
    const modalTracker = document.querySelector(".modal-view");
    const formAddActivity = document.getElementById("activity-form");
    const modalAddButton = document.getElementById("modal-submit-activity")
    
    buttonAdd.addEventListener("click", () => {
        modalTracker.classList.remove("hidden");
        modalTracker.querySelector("h2").textContent = "Add New Activity";
        modalAddButton.innerHTML = `<span class="material-symbols-outlined">add</span>Add activity`;
        modalAddButton.classList.remove("modal-edit");
        modalAddButton.classList.add("modal-add");
        currentActions = "add";
        currentActivityId = null;
    });

    const buttonClose = document.getElementById("modal-close-activity");
    buttonClose.addEventListener("click", () => {
        modalTracker.classList.add("hidden");
        formAddActivity.reset();
    });

}

// open modal edit activity
if(document.querySelectorAll(".activity-actions-edit")){
    const editButtons = document.querySelectorAll(".activity-actions-edit");
    editButtons.forEach(button => {
        button.addEventListener('click', e => {
            const activityRow = e.currentTarget.closest('tr')
            const activityName = activityRow.querySelector('td[data-name]').getAttribute('data-name');
            const activityTarget = activityRow.querySelector('td[data-weeklyTarget]').getAttribute('data-weeklyTarget');
            
            const modalTracker = document.querySelector(".modal-view");
            const formAddActivity = document.getElementById("activity-form");
            const modalEditButton = document.getElementById("modal-submit-activity")

            modalTracker.classList.remove("hidden");
            modalTracker.querySelector("h2").textContent = "Edit Activity";
            modalEditButton.innerHTML = `<span class="material-symbols-outlined">edit</span>Edit activity`;
            modalEditButton.classList.add("modal-edit");
            modalEditButton.classList.remove("modal-add");
            const odlNameActivity = document.getElementById("activityName").value = activityName;
            const oldTargetActivity = document.getElementById("WeeklyTarget").value = activityTarget;

            oldData = {name: activityName, weeklyTarget: parseInt(activityTarget)};
            currentActions = "edit";
            currentActivityId = activityRow.getAttribute('data-id');

            const buttonClose = document.getElementById("modal-close-activity");
            buttonClose.addEventListener("click", () => {
                modalTracker.classList.add("hidden");
                formAddActivity.reset();
            }
            );
        })
    })
}

if(document.querySelectorAll(".activity-actions-delete")){
    const deleteButtons = document.querySelectorAll(".activity-actions-delete");
    deleteButtons.forEach(button => {
        button.addEventListener('click', e => {})
    })
}