import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TRANSACTION_NAMES } from '@/constants/transactionNames';
import { useGetLearnerGamificationsTXAmountQuery } from '@/redux/features/larnerGamification/larnerGamificationAPI';
import useHandleLearnerGamification from '@/utils/learnerGamifications';
import ToastMessage from '../Toast';

const StreakTracker = ({ streak, days, handleContinue }) => {
    const notify = useCallback((type, message) => {
        ToastMessage({ type, message });
    }, []);
    const queryTXAmount = {
        populate: "*",
        "gamification_tx": TRANSACTION_NAMES.DATES_LOSS_BY_STREAK_RESTORE,
    };
    const { data: gamificationTxAmountsData } = useGetLearnerGamificationsTXAmountQuery({ ...queryTXAmount });
    const handleLearnerGamification = useHandleLearnerGamification();
    const [currentStreak, setCurrentStreak] = useState(streak);
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentStreak(streak);
        }, 1000);

        return () => clearTimeout(timer);
    }, [streak]);
    const handleSteak = async (day, index) => {
        console.log(day);
        if (day?.present) return;
        console.log(gamificationTxAmountsData);
        const confirmed = confirm(`Are you sure you want to restore this streak? It will affect ${gamificationTxAmountsData} dates.`);
        if (confirmed) {
            try {
                let response = await handleLearnerGamification(
                    null,
                    TRANSACTION_NAMES.DATES_LOSS_BY_STREAK_RESTORE
                );
                console.log(response);
            } catch (error) {
                console.log(error);
                notify("error", error?.data?.error?.message);
            }
        }
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-orange-200 via-pink-300 to-yellow-200 text-gray-900 p-6">
            <div className="w-full max-w-xl">
                <motion.div
                    className="bg-orange-600 text-white py-2 px-4 rounded-t-lg text-lg font-bold flex justify-center items-center"
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <span>{currentStreak} day streak!</span>
                </motion.div>
                <div className="bg-white py-6 px-4 rounded-b-lg shadow-inner flex flex-col items-center">
                    <motion.div
                        className="flex justify-between items-center w-full"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        {days.map((day, index) => (
                            <motion.div
                                key={index}
                                className="flex flex-col items-center mx-2"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                onClick={() => handleSteak(day, index)}
                            >
                                <div className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg ${day.present ? 'bg-purple-600' : 'bg-gray-400'}`}>
                                    <span className={`text-xl font-semibold text-white`}>{day.name}</span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                    <motion.button
                        className="mt-6 bg-orange-600 text-white py-2 px-4 rounded-lg shadow-lg hover:bg-orange-700 focus:outline-none"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleContinue()}
                    >
                        Continue
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default StreakTracker;
