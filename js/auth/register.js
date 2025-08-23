// auth/register.js
import { StorageService } from '../services/storageService.js';

export function registerUserHandler(username, password, confirmPassword) {
    try {
        // Validasi form
        if (!username || !password || !confirmPassword) {
            return { status: false, message: "Harap isi semua field" };
        }

        if (password !== confirmPassword) {
            return { status: false, message: "Konfirmasi password harus sama" };
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
            message: "Akun berhasil dibuat",
            user: newUser
        };

    } catch (error) {
        return { 
            status: false, 
            message: error.message 
        };
    }
}