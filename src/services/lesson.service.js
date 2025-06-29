import { CURRENT_LESSON } from "@/constants/storageKey";
import { getFromLocalStorage, removeLocalStorage, setToLocalStorage } from "@/utils/local-storage"

export const storeCurrentLesson = ({lesson}) =>{
    setToLocalStorage(CURRENT_LESSON, lesson);
}
export const getCurrentLesson = async() =>{
    return getFromLocalStorage(CURRENT_LESSON);
}
export const removeCurrentLesson = () => {
    removeLocalStorage(CURRENT_LESSON)
}