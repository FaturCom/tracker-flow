// utils/helper.js

export class Helper{
    static generateId(type) {
        return `${type}_` + Date.now() + '_' + Math.floor(Math.random() * 1000);
    }
    
    static getCurrentDate() {
        return new Date().toISOString();
    }
    
    // Untuk future validation
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}