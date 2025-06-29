import { LEARNER_INFO, authKey, userInfo } from "@/constants/storageKey";
import { getFromLocalStorage, removeLocalStorage, setToLocalStorage } from "@/utils/local-storage"

export const storeUserInfo = ({accessToken, userInfo, rememberMe}) =>{
    if (rememberMe) {
        // Store in localStorage for persistent session
        setToLocalStorage(authKey, accessToken);
        setToLocalStorage("userInfo", userInfo);
    } else {
        // Store in sessionStorage for session-based storage
        sessionStorage.setItem(authKey, accessToken);
        sessionStorage.setItem("userInfo", userInfo);
    }
}
export const getUserInfo = () =>{
    const authToken = getFromLocalStorage(authKey) || sessionStorage.getItem(authKey);
    return authToken;
}

export const isAuthenticateUser = () =>{
    const authToken = getFromLocalStorage(authKey) || sessionStorage.getItem(authKey);
    return !!authToken;
}
export const removeUserInfo = () => {
    removeLocalStorage(authKey);
    removeLocalStorage(userInfo);
    removeLocalStorage(LEARNER_INFO);
    sessionStorage.removeItem(authKey);
    sessionStorage.removeItem("userInfo");
}