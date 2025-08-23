// auth/login.js
import { StorageService } from '../services/storageService.js';

export function loginUserHandler(username, password) {
    try {
        // Validasi form
        if (!username || !password) {
            return { status: false, message: "Harap isi semua field" };
        }

        // Business logic dipindahkan ke StorageService
        const user = StorageService.validateLogin(username, password);
        
        // Set user sebagai logged in
        StorageService.setCurrentUser(user.id);

        return { 
            status: true, 
            message: "Login berhasil",
            user: user
        };

    } catch (error) {
        return { 
            status: false, 
            message: error.message 
        };
    }
}