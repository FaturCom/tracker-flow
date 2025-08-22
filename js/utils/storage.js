// simpan data
export function saveData(key, value){
    localStorage.setItem(key, JSON.stringify(value))
}

// Ambil data dari localStorage
export function getData(key){
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
}

// Tambah data/item baru ke localStorage
export function addData(key, item){
    const data = getData(key)
    data.push(item)
    saveData(key, data)
}
// Fungsi untuk hapus item/data
export function deleteData(key, predicate){
    let data = getData(key)
    data.filter(item => !predicate(item))
    saveData(key, data)
}

// Fungsi untuk current user
export function setCurrentUser(id){
    localStorage.setItem('currentUser', JSON.stringify(id))
}

export function getCurrentUser(){
    return localStorage.getItem('currentUser')
}