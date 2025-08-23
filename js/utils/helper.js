// utils/helper.js
export function generateId() {
    return 'user_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
}

export function getCurrentDate() {
    return new Date().toISOString();
}

// Untuk future validation
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}