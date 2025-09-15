// utils/helper.js

export class Helper{
    static generateId(type) {
        return `${type}_` + Date.now() + '_' + Math.floor(Math.random() * 1000);
    }
    
    static getCurrentDate() {
        return new Date().toISOString();
    }

    static weekRange(){
        const today = new Date();
        const day = today.getDay();
        const distanceToMonday = day === 0 ? -6 : 1 - day;

        const monday = new Date(today);
        monday.setDate(today.getDate() + distanceToMonday)

        const week = [];
        for(let i = 0; i<7; i++){
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            week.push(date.toISOString().split('T')[0]);
        }

        return week;
    }
    
    // Untuk future validation
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}