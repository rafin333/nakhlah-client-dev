import { LEARNER_INFO } from "@/constants/storageKey";
import { getFromLocalStorage, removeLocalStorage, setToLocalStorage } from "@/utils/local-storage"

export const storeLearnerInfo = (learnerInfo) =>{
    console.log(learnerInfo);
    setToLocalStorage(LEARNER_INFO, learnerInfo);
}
export const getLearnerInfo = async() =>{
    return getFromLocalStorage(LEARNER_INFO);
}
export const removeLearnerInfo = () => {
    removeLocalStorage(LEARNER_INFO)
}