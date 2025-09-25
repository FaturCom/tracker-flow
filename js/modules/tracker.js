import { StorageService } from "../services/storageService.js";
import { Helper } from "../utils/helper.js";

export class Tracker {
    static showActivity() {
        return StorageService.getActivitiesByUser();
    }

    static addActivity(newActivity){
        if(!newActivity.name){
            return {status: false, message: "The activity name is required"};
        }
        if(!newActivity.weeklyTarget){
            return {status: false, message: "Weekly targets must be filled in with numbers"};
        }
        if(isNaN(newActivity.weeklyTarget) || newActivity.weeklyTarget <= 0){
            return {status: false, message: "Weekly target must be a number greater than 0"};
        }
        if(newActivity.weeklyTarget > 7){
            return {status: false, message: "Weekly targets should not exceed 7"};
        }

        StorageService.createNewActivity(newActivity);
        return {status: true, message: "Activity added successfully"};
    }

    static editActivity(activityId, newData, oldData){
        try{
            if(!newData.name){
                return {status: false, message: "The activity name is required"};
            }
            if(!newData.weeklyTarget){
                return {status: false, message: "Weekly targets must be filled in with numbers"}
            }
            if(isNaN(newData.weeklyTarget) || newData.weeklyTarget <= 0){
                return {status: false, message: "Weekly target must be a number greater than 0"}
            }
            if(newData.weeklyTarget > 7){
            return {status: false, message: "Weekly targets should not exceed 7"};
            }
            if(newData.name == oldData.name && newData.weeklyTarget == oldData.weeklyTarget){
                return {status: false, message: "No change in activity"};
            }
    
            StorageService.updateActivity(activityId, newData);
            return {status: true, message: "Activity changed successfully"};
        }catch(error){
            return {status: false, message: error.message};
        }
    }

    static removeActivity(activityId){
        const result = StorageService.deleteActivity(activityId);

        if(result){
            return {status: true, message: "Activity deleted successfully"};
        }else{
            return {status: false, message: "Activity failed to delete"};
        }
    }

    static setMainMessage(message){
        StorageService.setMainMessage(message);
    }

    static getMainMessage(){
        return StorageService.getMainMessage();
    }

    static getCurrentUser(){
        return StorageService.getCurrentUser()
    }

    static getLogForThisWeek(activityId){
        const logs = StorageService.getLogsByActivityId(activityId);
        const thisWeek = Helper.weekRange();
        let log =  logs.find(log => log.weekStart === thisWeek[0]);
        if(!log){
            log = StorageService.saveLogsActivity(activityId)
        }
        return log
    }

    static toggleDay(activityId, weeklyTarget, day){
        const log = this.getLogForThisWeek(activityId);

        const updateChecks = {...log.checks, [day] : !log.checks[day]};
        const progress = Math.floor(Object.values(updateChecks).filter(v => v).length/weeklyTarget * 100);
        const updateLog = {...log, checks: updateChecks, progress};
        
        StorageService.uppdateLogActivity(log.id, updateLog);
        return updateLog
    }
}