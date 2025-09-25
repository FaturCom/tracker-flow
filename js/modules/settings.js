import { StorageService } from "../services/storageService.js";

export class Settings{
    static logOut(){
        StorageService.userLogout()
        return"logged out successfully"
    }
}