import React from 'react'
import { useState, useEffect, useRef } from 'react';
import lottie from "lottie-web";
function StreakComponent() {
    const [currentStreak, setCurrentStreak] = useState(50); // Simulating current streak

    // Streak data
    const streakData = 
        { days: 7, label: '7 Day Streak!', reward: 'Congrats on 7 days in a row!' }
      
    
    
  let counterAnimation = 0;
    const sevenDaysStreak = useRef([]);
    const thirtyDaysStreak = useRef([]);
    // Function to determine if the card is locked
    const isLocked = (days) => currentStreak < days;
    useEffect(() => {
        if(counterAnimation === 0){
          animationJSON()
        }
      }, []);
    function animationJSON() {
        counterAnimation = 1;
        lottie.loadAnimation({
          container: sevenDaysStreak.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          path: "/icons/All Icon/Streak/7 Day Streak Complete.json",
        });
        lottie.loadAnimation({
          container: thirtyDaysStreak.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          path: "/icons/All Icon/Streak/7 Day Streak Complete.json",
        });
       
    
        
      }
    return (
        <div style={containerStyle}>
        <div style={getCardStyle(isLocked(streakData.days))}>
            <div style={balloonStyle}>
                <h1 style={balloonTextStyle}>{streakData.days} Days</h1>
            </div>
            
            {/* Ref for the 7-day streak */}
            <div ref={sevenDaysStreak}></div>
            
            <h2>{streakData.label}</h2>
            <p>{isLocked(streakData.days) ? 'Complete this streak to unlock!' : streakData.reward}</p>
            
            <div style={buttonContainerStyle}>
                <button 
                    style={getButtonStyle(isLocked(streakData.days))} 
                    disabled={isLocked(streakData.days)}
                >
                    Reward
                </button>
                <button 
                    style={getShareButtonStyle(isLocked(streakData.days))} 
                    disabled={isLocked(streakData.days)}
                >
                    Share
                </button>
            </div>
        </div>
    </div>
    );
}

// Function to style the card based on locked status
const getCardStyle = (locked) => ({
    backgroundColor: '#fff',
    borderRadius: '15px',
    boxShadow: locked ? '0px 4px 12px rgba(0, 0, 0, 0.2)' : '0px 4px 12px rgba(0, 0, 0, 0.1)',
    width: '300px',
    padding: '20px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    color: locked ? '#999' : '#333',
    opacity: locked ? 0.6 : 1,
    position: 'relative',
    pointerEvents: locked ? 'none' : 'auto',
    cursor: locked ? 'not-allowed' : 'pointer',
});

const getButtonStyle = (locked) => ({
    backgroundColor: locked ? '#ccc' : '#CB8F15',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: locked ? 'not-allowed' : 'pointer',
    fontWeight: 'bold',
});

const getShareButtonStyle = (locked) => ({
    backgroundColor: locked ? '#e0e0e0' : '#f0f0f0',
    color: locked ? '#bbb' : '#CB8F15',
    border: '1px solid',
    borderColor: locked ? '#bbb' : '#CB8F15',
    borderRadius: '5px',
    padding: '10px 20px',
    cursor: locked ? 'not-allowed' : 'pointer',
    fontWeight: 'bold',
});

// Styles
const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    padding: '40px',
};

const balloonStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '10px',
};

const balloonTextStyle = {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#ff6347', // You can change this color to match your design
};

const characterStyle = {
    // width: '100px',
    // height: '100px',
    marginBottom: '-50px',
    marginTop: '-110px',
};

const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
};
//end ////////////



export default StreakComponent
