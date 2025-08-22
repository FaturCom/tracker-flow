import { generateId, getCurrentDate } from "../utils/helper.js";
import { addData, getData } from "../utils/storage.js";

export function registerUserHandler(username, password, confirmPassword){
    const data = getData('users').find(user => user.username == username)

    if(username == "" || password == "" || confirmPassword == ""){
        return {status: false, message: "please fill in the form correctly"}
    }

    if(data){
        return {status: false, message: `username "${username}" is already in use`}
    }

    if(password.length < 6){
        return {status:false, message: "password minimum 6 characters"}
    }

    if(password !== confirmPassword){
        return {status: false, message:"confirmation password must be the same"}
    }

    const newUser = {
        id: generateId(),
        username,
        password,
        createdAt: getCurrentDate()
    }
    addData('users', newUser)
    return {status: true, message: "successfully created an account"}
}