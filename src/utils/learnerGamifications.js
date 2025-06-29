// utils/learnerGamifications.js
import { getTransactionIdByName } from "@/utils/gamificationTxes";
import { useAddlearnerGamificationMutation } from "@/redux/features/larnerGamification/larnerGamificationAPI";

const useHandleLearnerGamification = () => {
  const [learnerGamifications] = useAddlearnerGamificationMutation();

  const handleLearnerGamification = async (gamificationTxData, transactionName) => {
    try {
      const gamificationTXId = getTransactionIdByName(gamificationTxData, transactionName);
      const learnerGamificationData = {
        data: {
          gamification_tx: transactionName,
        },
      };
      const response = await learnerGamifications({ ...learnerGamificationData }).unwrap();
      return response;
    } catch (error) {
      console.log("Error in handleLearnerGamification:", error);
      throw error;
    }
  };

  return handleLearnerGamification;
};
export default useHandleLearnerGamification;