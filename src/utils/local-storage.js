export const setToLocalStorage = (key, value) => {
    console.log(value);
    if(!key || typeof window ==="undefined" || key == "undefined"){
        return "";
    }
    localStorage.setItem(key,value);
}
export const getFromLocalStorage = (key) => {
    if(!key || typeof window ==="undefined"){
        return "";
    }
    return localStorage.getItem(key);
}
export const removeLocalStorage = (key) => {
    if(!key || typeof window ==="undefined"){
        return "";
    }
    return localStorage.removeItem(key);
}

export const getFromSessionStorage = (key) => {
    if(!key || typeof window ==="undefined"){
        return "";
    }
    return sessionStorage.getItem(key);
}