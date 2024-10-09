const storeIsSession = (key, value) => {
    return sessionStorage.setItem(key, value);
}
const lookInSession = (key) => {
    return sessionStorage.getItem(key);
}
const removeFromSession = (key) => {
    return sessionStorage.removeItem(key);
}
const logOutUser = (key) => {
    sessionStorage.clear();
    window.location.reload();
}

export {
    storeIsSession,
    lookInSession,
    removeFromSession,
    logOutUser
}