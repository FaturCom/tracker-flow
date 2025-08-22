// membuat id baru
export function generateId() {
  return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
}

// mengambil waktu sekarang
export function getCurrentDate() {
  return new Date().toISOString();
}

