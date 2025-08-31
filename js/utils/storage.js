// class localstorage untuk menyimpan data di localStorage

export class storageHandler {
    // simpan data
    static saveData(key, value){
        localStorage.setItem(key, JSON.stringify(value))
    }
    
    // Ambil data dari localStorage
    static getData(key){
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : []
    }
    
    // Tambah data/item baru ke localStorage
    static addData(key, item){
        const data =this.getData(key)
        data.push(item)
        saveData(key, data)
    }
    // Fungsi untuk hapus item/data
    static deleteData(key, predicate){
        let data = this.getData(key)
        data.filter(item => !predicate(item))
        saveData(key, data)
    }
}