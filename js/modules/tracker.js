import { StorageService } from "../services/storageService.js";

export class Tracker {
    static showActivity() {
        return StorageService.getActivitiesByUser();
    }

    static addActivity(newActivity){
        if(!newActivity.name){
            return {status: false, message: "Nama aktivitas harus diisi"};
        }
        if(!newActivity.weeklyTarget){
            return {status: false, message: "Target mingguan harus berupa diisi angka"};
        }
        if(isNaN(newActivity.weeklyTarget) || newActivity.weeklyTarget <= 0){
            return {status: false, message: "Target mingguan harus berupa angka lebih dari 0"};
        }
        if(newActivity.weeklyTarget > 7){
            return {status: false, message: "Target mingguan tidak boleh lebih dari 7"};
        }

        StorageService.createNewActivity(newActivity);
        return {status: true, message: "Aktivitas berhasil ditambahkan"};
    }

    static editActivity(activityId, newData, oldData){
        try{
            if(!newData.name){
                return {status: false, message: "Nama aktivitas harus diisi"};
            }
            if(!newData.weeklyTarget){
                return {status: false, message: "Target mingguan harus berupa diisi angka"}
            }
            if(isNaN(newData.weeklyTarget) || newData.weeklyTarget <= 0){
                return {status: false, message: "Target mingguan harus berupa angka lebih dari 0"}
            }
            if(newData.weeklyTarget > 7){
            return {status: false, message: "Target mingguan tidak boleh lebih dari 7"};
            }
            if(newData.name == oldData.name && newData.weeklyTarget == oldData.weeklyTarget){
                return {status: false, message: "Tidak ada perubahan aktivitas"};
            }
    
            StorageService.updateActivity(activityId, newData);
            return {status: true, message: "Aktivitas berhasil diubah"};
        }catch(error){
            return {status: false, message: error.message};
        }
    }

    static removeActivity(activityId){
        const result = StorageService.deleteActivity(activityId);

        if(result){
            return {status: true, message: "Aktivitas berhasil dihapus"};
        }else{
            return {status: false, message: "Aktivitas gagal dihapus"};
        }
    }

    static setMainMessage(message){
        StorageService.setMainMessage(message);
    }

    static getMainMessage(){
        return StorageService.getMainMessage();
    }
}