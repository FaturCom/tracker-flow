import { registerUserHandler } from "./auth/register.js";
import { loginUserHandler } from "./auth/login.js";
import { Tracker } from "./modules/tracker.js";
import { Helper } from "./utils/helper.js";
import { History } from "./modules/history.js";
import { Profile } from "./modules/profile.js";
import { Settings } from "./modules/settings.js";

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
if(document.getElementById('activity-week')){
    const week = Helper.weekRange()
    const weekStart = new Date(week[0])
    const weekEnd = new Date(week[6])
    const options = {month: 'long', day: 'numeric', year: 'numeric'};
    document.getElementById('activity-week').textContent = `Week: ${weekStart.toLocaleDateString('en-US', options)} - ${weekEnd.toLocaleDateString('en-US', options)}`
}


if(document.getElementById('activity-table')){
    const activityTableBody = document.getElementById('activity-tbody');
    const activities = Tracker.showActivity();
    
    if(activities.length == 0){
        document.querySelector(".no-activity").classList.remove("hidden");
    }else{
        document.querySelector(".no-activity").classList.add("hidden");
        activities.forEach(activity => {
            const log = Tracker.getLogForThisWeek(activity.id)
            const row = document.createElement('tr');
            row.setAttribute('data-id', activity.id);
            row.innerHTML = `
                <td data-name="${activity.name}">${activity.name}</td>
                <td data-weeklyTarget="${activity.weeklyTarget}">${activity.weeklyTarget}x</td>
                <td><input type="checkbox" data-check="monday" ${log.checks.monday ? "checked" : ""}></td>
                <td><input type="checkbox" data-check="tuesday" ${log.checks.tuesday ? "checked" : ""}></td>
                <td><input type="checkbox" data-check="wednesday" ${log.checks.wednesday ? "checked" : ""}></td>
                <td><input type="checkbox" data-check="thursday" ${log.checks.thursday ? "checked" : ""}></td>
                <td><input type="checkbox" data-check="friday" ${log.checks.friday ? "checked" : ""}></td>
                <td><input type="checkbox" data-check="saturday" ${log.checks.saturday ? "checked" : ""}></td>
                <td><input type="checkbox" data-check="sunday" ${log.checks.sunday ? "checked" : ""}></td>
                <td>${log.progress}%</td>
                <td class="activity-actions">
                    <button class="activity-actions-edit"><span class="material-symbols-outlined" translate="no">edit</span></button>
                    <button class="activity-actions-delete"><span class="material-symbols-outlined" translate="no">delete</span></button>
                </td>
            `;
            activityTableBody.appendChild(row);
        });
    }
}

if(document.querySelector('.activity-tbody')){
    document.querySelector('.activity-tbody').addEventListener('change', (e) => {
        if(e.target && e.target.matches("input[type='checkbox']")){
            const activityRow = e.target.closest('tr');
            const activityId = activityRow.getAttribute('data-id');
            const activityTarget = activityRow.querySelector('td[data-weeklyTarget]').getAttribute('data-weeklyTarget');
            const day = e.target.getAttribute('data-check');

            const result = Tracker.toggleDay(activityId, activityTarget, day);
            location.reload();
        }
    })
}

// modal events
let currentActions = "add";
let currentActivityId = null;
let oldData = null;

if(document.getElementById("activity-form")){
    const formAddActivity = document.getElementById("activity-form");

    formAddActivity.addEventListener("submit", (e) => {
        e.preventDefault();
        const nameActivity = document.getElementById("activityName").value;
        const targetActivity = parseInt(document.getElementById("WeeklyTarget").value);
        const modalMessage = document.getElementById("modal-message");
    
        if(currentActions == "add"){
            const result = Tracker.addActivity({name: nameActivity, weeklyTarget: targetActivity});
            if(result.status == false){
                modalMessage.textContent = result.message;
                modalMessage.classList.add("error-message")
            }else{
                Tracker.setMainMessage(result);
                document.querySelector(".modal-view").classList.add("hidden");
                formAddActivity.reset();
                location.reload();
            }
        }else if(currentActions == "edit"){
            const result = Tracker.editActivity(currentActivityId, {name: nameActivity, weeklyTarget: targetActivity}, oldData);
            if(result.status == false){
                modalMessage.textContent = result.message;
                modalMessage.classList.add("error-message")
            }else{
                Tracker.setMainMessage(result);
                document.querySelector(".modal-view").classList.add("hidden");
                formAddActivity.reset();
                location.reload();
            }
        }else if(currentActions == "delete"){
            const result = Tracker.removeActivity(currentActivityId);
            if(result.status == false){
                modalMessage.textContent = result.message;
                modalMessage.classList.add("error-message")
            }else{
                Tracker.setMainMessage(result);
                document.querySelector(".modal-view").classList.add("hidden");
                formAddActivity.reset();
                location.reload();
            }
        }
    });
}


// main message
if(document.getElementById("main-message-container")){
    const mainContainerMessage = document.getElementById("main-message-container");
    const mainMessage = document.getElementById("main-message");
    const resultMainMessage = Tracker.getMainMessage();

    if(resultMainMessage){
        mainContainerMessage.classList.remove("hidden");
        mainMessage.classList.remove("error-message");
        mainMessage.classList.add("successful-message");
        mainMessage.textContent = resultMainMessage.message;

        setTimeout(() => {
        mainContainerMessage.classList.add("hidden");
        mainMessage.classList.add("error-message");
        mainMessage.classList.remove("successful-message");
        mainMessage.textContent = resultMainMessage.message;
        Tracker.setMainMessage(null);
        }, 3000)
    }
}

// open modal add activity
if(document.getElementById("add-button")){
    const buttonAdd = document.getElementById("add-button");
    const modalTracker = document.querySelector(".modal-view");
    const formAddActivity = document.getElementById("activity-form");
    const modalAddButton = document.getElementById("modal-submit-activity")
    const modalMessage = document.getElementById("modal-message");
    modalMessage.textContent = "";
    modalMessage.classList.remove("error-message");
    
    buttonAdd.addEventListener("click", () => {
        modalTracker.classList.remove("hidden");
        formAddActivity.querySelectorAll("input, label").forEach(el => el.classList.remove("hidden"));
        document.querySelector(".modal-actions").classList.remove("modal-logout");
        modalTracker.querySelector("h2").textContent = "Add New Activity";
        modalAddButton.innerHTML = `<span class="material-symbols-outlined" translate="no">add</span>Add activity`;
        modalAddButton.classList.remove("modal-edit");
        modalAddButton.classList.add("modal-add");
        currentActions = "add";
        currentActivityId = null;
    });

    const buttonClose = document.getElementById("modal-close-activity");
    buttonClose.addEventListener("click", () => {
        modalTracker.classList.add("hidden");
        modalMessage.textContent = "";
        modalMessage.classList.remove("error-message");
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
            const modalMessage = document.getElementById("modal-message");
            modalMessage.textContent = "";
            modalMessage.classList.remove("error-message");

            modalTracker.classList.remove("hidden");
            formAddActivity.querySelectorAll("input, label").forEach(el => el.classList.remove("hidden"));
            document.querySelector(".modal-actions").classList.remove("modal-logout");
            modalTracker.querySelector("h2").textContent = "Edit Activity";
            modalEditButton.innerHTML = `<span class="material-symbols-outlined" translate="no">edit</span>Edit activity`;
            modalEditButton.classList.add("modal-edit");
            modalEditButton.classList.remove("modal-add", "modal-delete");
            const odlNameActivity = document.getElementById("activityName").value = activityName;
            const oldTargetActivity = document.getElementById("WeeklyTarget").value = activityTarget;

            oldData = {name: activityName, weeklyTarget: parseInt(activityTarget)};
            currentActions = "edit";
            currentActivityId = activityRow.getAttribute('data-id');

            const buttonClose = document.getElementById("modal-close-activity");
            buttonClose.addEventListener("click", () => {
                modalTracker.classList.add("hidden");
                modalMessage.textContent = "";
                modalMessage.classList.remove("error-message");
                formAddActivity.reset();
            });
        })
    })
}

if(document.querySelectorAll(".activity-actions-delete")){
    const deleteButtons = document.querySelectorAll(".activity-actions-delete");
    deleteButtons.forEach(button => {
        button.addEventListener('click', e => {
            const activityRow = e.currentTarget.closest('tr')
            const modalDeleteButton = document.getElementById("modal-submit-activity");
            const formAddActivity = document.getElementById("activity-form");
            const modalTracker = document.querySelector(".modal-view");
            const modalMessage = document.getElementById("modal-message");
            modalMessage.textContent = "";
            modalMessage.classList.remove("error-message");

            modalTracker.classList.remove("hidden");
            formAddActivity.querySelectorAll("input, label").forEach(el => el.classList.add("hidden"));
            document.querySelector(".modal-actions").classList.add("modal-logout");
            modalDeleteButton.innerHTML = `<span class="material-symbols-outlined" translate="no">delete</span>Delete activity`;
            modalDeleteButton.classList.add("modal-delete");
            modalDeleteButton.classList.remove("modal-add", "modal-edit");

            modalTracker.querySelector("h2").textContent = "Delete Activity?";
            currentActions = "delete";
            currentActivityId = activityRow.getAttribute('data-id');

            const buttonClose = document.getElementById("modal-close-activity");
            buttonClose.addEventListener("click", () => {
                modalTracker.classList.add("hidden");
                modalMessage.textContent = "";
                modalMessage.classList.remove("error-message");
                formAddActivity.reset();
            });
        })
    })
}

// Halaman history
const renderHistory = (history) => {
    const row = document.createElement('tr')
    row.innerHTML = `
        <td>${history.activityName}</td>
        <td>${history.weeklyTarget}</td>
        <td><input type="checkbox" disabled ${history.checks.monday? "checked" : ""}></td>
        <td><input type="checkbox" disabled ${history.checks.tuesday? "checked" : ""}></td>
        <td><input type="checkbox" disabled ${history.checks.wednesday? "checked" : ""}></td>
        <td><input type="checkbox" disabled ${history.checks.thursday? "checked" : ""}></td>
        <td><input type="checkbox" disabled ${history.checks.friday? "checked" : ""}></td>
        <td><input type="checkbox" disabled ${history.checks.saturday? "checked" : ""}></td>
        <td><input type="checkbox" disabled ${history.checks.sunday? "checked" : ""}></td>
        <td>${history.progress}%</td>
        <td>
            <button disabled="disabled" class="activity-actions-edit disable-button"><span class="material-symbols-outlined" translate="no">edit</span></button>
            <button disabled class="activity-actions-delete disable-button"><span class="material-symbols-outlined" translate="no">delete</span></button>
        </td>
        `;
    return row
}

if(document.getElementById('week1')){
    const historyWeek = History.getHistoryWeeks(1)
    const options = {month: 'long', day: 'numeric', year: 'numeric'};
    document.getElementById('week1').textContent = `Week: ${historyWeek.weekStart.toLocaleDateString('en-US', options)} - ${historyWeek.weekEnd.toLocaleDateString('en-US', options)}`
}

if(document.getElementById('week2')){
    const historyWeek = History.getHistoryWeeks(8)
    const options = {month: 'long', day: 'numeric', year: 'numeric'};
    document.getElementById('week2').textContent = `Week: ${historyWeek.weekStart.toLocaleDateString('en-US', options)} - ${historyWeek.weekEnd.toLocaleDateString('en-US', options)}`
}

if(document.getElementById('activity-table-lastWeek')){
    const historyTableBody = document.getElementById('activity-tbody-lastWeek')
    const histories = History.getActivityHistory(1)

    if(histories.length === 0){
        document.querySelector(".no-activity-history1").classList.remove("hidden");
    }else{
        document.querySelector(".no-activity-history1").classList.add("hidden");
        histories.forEach(history => {
            historyTableBody.appendChild(renderHistory(history))
        })
    }
}

if(document.getElementById('activity-table-twoWeeksAgo')){
    const historyTableBody = document.getElementById('activity-tbody-twoWeeksAgo')
    const histories = History.getActivityHistory(8)

    if(histories.length === 0){
        document.querySelector(".no-activity-history2").classList.remove("hidden");
    }else{
        document.querySelector(".no-activity-history2").classList.add("hidden");
        histories.forEach(history => {
            historyTableBody.appendChild(renderHistory(history))
        })
    }
}

// Halaman profile
if(document.querySelector('.profile-card')){
    const currentUser = Profile.loadUserProfile()
    const createdAt = new Date(currentUser.createdAt)

    const yyyy = createdAt.getFullYear();
    const mm = String(createdAt.getMonth() + 1).padStart(2, '0');
    const dd = String(createdAt.getDate()).padStart(2, '0');

    const hh = String(createdAt.getHours()).padStart(2, '0');
    const min = String(createdAt.getMinutes()).padStart(2, '0');

    const formattedDate = `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    document.getElementById('profile-username').textContent = currentUser.username;
    document.getElementById('profile-id').textContent = `ID: ${currentUser.id}`;
    document.getElementById('profile-created').textContent = formattedDate;
}

if(document.getElementById('profile-edit-password')){
    const editButton = document.getElementById('profile-edit-password');
    editButton.addEventListener('click', (e) => {
        e.preventDefault();
        const modalPassword = document.getElementById('modal-view-password');
        const submitButton = document.getElementById('modal-submit-changePaswword')
        const closeButton = document.getElementById('modal-close-changePaswword')
        modalPassword.classList.remove('hidden');

        submitButton.addEventListener('click', (e) => {
            e.preventDefault()
            const oldPassword = document.getElementById('old-password').value
            const newPassword = document.getElementById('new-password').value

            try{
                const result = Profile.updatePassword(oldPassword, newPassword)
                const succes = document.getElementById('modal-message-password')
                succes.textContent = result
                succes.classList.remove('error-message')
                succes.classList.add('successful-message-profile')
                setTimeout(() => {
                    location.reload()
                }, 1000)
            }catch(err){
                const error = document.getElementById('modal-message-password')
                error.textContent = err.message
                error.classList.remove('successful-message-profile')
                error.classList.add('error-message')
            }
        })

        closeButton.addEventListener('click', (e) => {
            modalPassword.classList.add('hidden')
        })
    })
}

if(document.getElementById('profile-edit-username')){
    const editButton = document.getElementById('profile-edit-username');
    editButton.addEventListener('click', (e) => {
        e.preventDefault()
        const modalUsername = document.getElementById('modal-view-username')
        const submitButton = document.getElementById('modal-submit-changeUsername')
        const closeButton = document.getElementById('modal-close-changeUsername')
        modalUsername.classList.remove('hidden')

        submitButton.addEventListener('click', (e) => {
            e.preventDefault()
            const newUsername = document.getElementById('changeUsername').value

            try {
                const result = Profile.updateUsername(newUsername)
                const succes = document.getElementById('modal-message-username')
                succes.textContent = result
                succes.classList.remove('error-message')
                succes.classList.add('successful-message-profile')
                setTimeout(() => {
                    location.reload()
                }, 1000)
            } catch (err) {
                const error = document.getElementById('modal-message-username')
                error.textContent = err.message
                error.classList.remove('successful-message-profile')
                error.classList.add('error-message')
            }
        })

        closeButton.addEventListener('click', (e) => {
            modalUsername.classList.add('hidden')
        })
    })
}

// Halaman settings/pengaturan
if(document.getElementById('settings-logout-btn')){
    const logoutButton = document.getElementById('settings-logout-btn');
    logoutButton.addEventListener('click', (e) => {
        e.preventDefault()
        const modalLogout = document.getElementById('modal-view-logout')
        const submitButton = document.getElementById('modal-submit-logout')
        const closeButton = document.getElementById('modal-close-logout')
        modalLogout.classList.remove('hidden')

        submitButton.addEventListener('click', (e) => {
            e.preventDefault()
            console.log(Settings.logOut())
            window.location.href = "../pages/login.html"
        })

        closeButton.addEventListener('click', (e) => {
            modalLogout.classList.add('hidden')
        })
    })
}