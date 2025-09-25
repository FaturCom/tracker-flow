// auth/register.js
import { StorageService } from '../services/storageService.js';

export function registerUserHandler(username, password, confirmPassword) {
    try {
        // Validasi form
        if (!username || !password || !confirmPassword) {
            return { status: false, message: "Please fill in all fields" };
        }

        if (password !== confirmPassword) {
            return { status: false, message: "Password confirmation must be the same" };
        }

        // Business logic dipindahkan ke StorageService
        const newUser = StorageService.saveUser({
            username: username.trim(),
            password: password
        });

        // Set user sebagai logged in
        StorageService.setCurrentUser(newUser.id);

        return {
            status: true, 
            message: "Account created successfully",
            user: newUser
        };

    } catch (error) {
        return { 
            status: false, 
            message: error.message 
        };
    }
}