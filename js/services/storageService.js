// services/storageService.js
import { storageHandler } from '../utils/storage.js';
import { generateId, getCurrentDate } from '../utils/helper.js';

export class StorageService {
    // USER METHODS
    static getUsers() {
        return storageHandler.getData('users');
    }

    static getUserByUsername(username) {
        const users = this.getUsers();
        return users.find(user => user.username === username);
    }

    static saveUser(user) {
        const users = this.getUsers();
        
        // Validasi: username harus unik
        if (this.getUserByUsername(user.username)) {
            throw new Error(`Username "${user.username}" sudah digunakan`);
        }
        
        // Validasi: password minimal 6 karakter
        if (user.password.length < 6) {
            throw new Error('Password minimal 6 karakter');
        }
        
        // Business Logic: tambah metadata
        const newUser = {
            ...user,
            id: generateId(),
            createdAt: getCurrentDate(),
            lastLogin: null
        };
        
        users.push(newUser);
        storageHandler.saveData('users', users);
        
        return newUser;
    }

    static validateLogin(username, password) {
        const user = this.getUserByUsername(username);
        
        if (!user) {
            throw new Error('Username tidak ditemukan');
        }
        
        if (user.password !== password) {
            throw new Error('Password salah');
        }
        
        // Update last login
        user.lastLogin = getCurrentDate();
        this.updateUser(user);
        
        return user;
    }

    static updateUser(updatedUser) {
        const users = this.getUsers();
        const index = users.findIndex(user => user.id === updatedUser.id);
        
        if (index !== -1) {
            users[index] = updatedUser;
            storageHandler.saveData('users', users);
        }
    }

    static getUserById(userId) {
        const users = this.getUsers();
        return users.find(user => user.id === userId);
    }

    // Untuk future use
    static setCurrentUser(userId) {
        localStorage.setItem('currentUser', userId);
    }

    static getCurrentUser() {
        const userId = localStorage.getItem('currentUser');
        return userId ? this.getUserById(userId) : null;
    }
}