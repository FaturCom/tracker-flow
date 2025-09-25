// auth/login.js
import { StorageService } from '../services/storageService.js';

export function loginUserHandler(username, password) {
    try {
        // Validasi form
        if (!username || !password) {
            return { status: false, message: "Please fill in all fields" };
        }

        // Business logic dipindahkan ke StorageService
        const user = StorageService.validateLogin(username, password);
        
        // Set user sebagai logged in
        StorageService.setCurrentUser(user.id);

        return { 
            status: true, 
            message: "Login successful",
            user: user
        };

    } catch (error) {
        return { 
            status: false, 
            message: error.message 
        };
    }
}