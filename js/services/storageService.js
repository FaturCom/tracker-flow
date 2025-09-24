// services/storageService.js
import { storageHandler } from '../utils/storage.js';
import { Helper } from '../utils/helper.js';

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
            id: Helper.generateId('user'),
            createdAt: Helper.getCurrentDate(),
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
        user.lastLogin = Helper.getCurrentDate();
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

    static getUserId(){
        const currentUser = localStorage.getItem('currentUser');
        return currentUser ? currentUser : null;
    }

    // Untuk future use
    static setCurrentUser(userId) {
        localStorage.setItem('currentUser', userId);
    }

    static getCurrentUser() {
        const userId = localStorage.getItem('currentUser');
        return userId ? this.getUserById(userId) : null;
    }

    // ACTIVITY METHODS
    static getActivities() {
        return storageHandler.getData('activities');
    }

    static createNewActivity(activityData) {
        const activities = this.getActivities();

        const newActivity = {
            ...activityData,
            id: Helper.generateId(this.getUserId()),
            userId : this.getUserId(),
            createdAt: Helper.getCurrentDate()
        }

        activities.push(newActivity);
        storageHandler.saveData('activities', activities);
        this.saveLogsActivity(newActivity.id);
    }

    static updateActivity(activityId, updatedData) {
        const activities = this.getActivities();
        const index = activities.findIndex(activity => activity.id === activityId);
        
        if (index !== -1) {
            activities[index] = { ...activities[index], ...updatedData };
            storageHandler.saveData('activities', activities);
        } else {
            throw new Error('Activity not found');
        }
    }

    static deleteActivity(activityId) {
        let activities = this.getActivities();
        activities = activities.filter(activity => activity.id !== activityId);
        storageHandler.saveData('activities', activities);
        return true;
    }

    static getActivitiesByUser() {
        const activities = this.getActivities();
        const userId = this.getUserId();
        return activities.filter(activity => activity.userId === userId);
    }

    static getActivityById(activityId){
        const activities = this.getActivities()
        return activities.find(activity => activity.id == activityId)
    }

    // MAIN MESSAGE METHODS
    static setMainMessage(message){
        localStorage.setItem('mainMessage', message? JSON.stringify(message) : '');
    }
    static getMainMessage(){
        return localStorage.getItem('mainMessage') ? JSON.parse(localStorage.getItem('mainMessage')) : null;
    }

    // ACTIVITYLOGS/HISTORY METHODS
    static getActivityLogs() {
        return storageHandler.getData('activityLogs');
    }

    static saveLogsActivity(activityId) {
        const activity = this.getActivityById(activityId)
        const logs = this.getActivityLogs();
        const newLog = {
            activityId : activity.id,
            activityName : activity.name,
            weeklyTarget : activity.weeklyTarget,
            id: Helper.generateId('log'),
            weekStart: Helper.weekRange()[0],
            weekEnd: Helper.weekRange()[6],
            checks: {
                monday: false,
                tuesday: false,
                wednesday: false,
                thursday: false,
                friday: false,
                saturday: false,
                sunday: false
            },
            progress : 0
        }

        logs.push(newLog);
        storageHandler.saveData('activityLogs', logs);
    }

    static uppdateLogActivity(logId, updartedLog){
        const logs = this.getActivityLogs();
        const indexLog = logs.findIndex(log => log.id === logId);

        if(indexLog !== -1){
            logs[indexLog] = {...logs[indexLog], ...updartedLog};
            storageHandler.saveData('activityLogs', logs)
        }else{
            throw new Error('Log activity not found');
        }
    }

    static getLogsByActivityId(activityId){
        const logs = this.getActivityLogs();
        return logs.filter(log => log.activityId === activityId);
    }
}