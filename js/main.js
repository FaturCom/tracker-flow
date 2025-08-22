import { registerUserHandler } from "./auth/register.js";
import { loginUserHandler } from "./auth/login.js";

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

