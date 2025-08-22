import { setCurrentUser, getData } from "../utils/storage.js"

export function loginUserHandler(username, password){
    const users = getData('users')

    const user = users.find(user => user.username == username)

    if(username == "" || password == ""){
        return {status: false, message: "please fill in the form correctly"}
    }

    if(!user){
        return {status: false, message: "username not found"}
    }

    if(user.password !== password){
        return {status: false, message: "wrong password"}
    }

    setCurrentUser(user.id)
    return {status: true, message: "login successful"}
}