import { StorageService } from "../services/storageService.js";
import { Helper } from "../utils/helper.js";

export class History{
    static getActivityHistory(day){
        const currentUser = StorageService.getCurrentUser()
        const activities = StorageService.getActivitiesByUser(currentUser.id)
        const thisWeek = Helper.weekRange()

        return activities.reduce((acc, activity)=> {
            const log = StorageService.getLogsByActivityId(activity.id)
            const result = log.find(a => {
                const weekEnd = new Date(a.weekEnd)
                const monday = new Date(thisWeek[0])

                monday.setDate(monday.getDate() - day)
                return weekEnd.getTime() === monday.getTime()
            })
    
            if(result){
                acc.push(result)
            }

            return acc
       }, []);
    }

    static getHistoryWeeks(day){
        const thisWeek = Helper.weekRange()

        const weekEnd = new Date(thisWeek[0])
        weekEnd.setDate(weekEnd.getDate() - day)

        const weekStart = new Date(weekEnd)
        weekStart.setDate(weekEnd.getDate() - 6)

        return {weekStart, weekEnd}
    }
}