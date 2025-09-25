import { StorageService } from "../services/storageService.js";

export class Profile{
    static loadUserProfile(){
        return StorageService.getCurrentUser()
    }

    static updateUsername(newUsername){
        return StorageService.updateUsername(newUsername)
    }

    static updatePassword(oldPassword, newPassword){
        return StorageService.updatePassword(oldPassword, newPassword)
    }
}