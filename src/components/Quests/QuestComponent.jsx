import React, { useState } from 'react';
import Image from 'next/image';
function QuestComponent() {

  const [quests, setQuests] = useState([
    {
      id: 1,
      title: 'Complete a task',
      progress: 1,
      maxProgress: 1,
      reward: '50 XP',
      completed: true,
      image: 'image/trophy.svg'
    },
    {
      id: 2,
      title: 'Earn 10 XP',
      progress: 7,
      maxProgress: 10,
      reward: '10 XP',
      completed: false,
      image: 'image/dates.svg'
    },
    {
      id: 3,
      title: 'Practice lessons',
      progress: 2,
      maxProgress: 2,
      reward: 'Bonus XP',
      completed: true,
      image: 'image/star.svg'
    },
    {
      id: 4,
      title: 'Score 80% or higher',
      progress: 1,
      maxProgress: 1,
      reward: '100 XP',
      completed: true,
      image: 'image/score.jpg'
    },
    {
      id: 5,
      title: 'Spend at least 20 mins',
      progress: 15,
      maxProgress: 20,
      reward: '20 XP',
      completed: false,
      image: 'image/timer.png'
    }
  ]);

  // Function to check if the task is completed
  const isCompleted = (progress, maxProgress) => progress >= maxProgress;

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Daily Quests</h2>
      <div style={questsContainerStyle}>
        {quests.map((quest) => (
          <div key={quest.id} style={questCardStyle}>
            {/* Quest Image on Left */}
            <div style={imageContainerStyle}>
              <img src={quest.image} alt={quest.title} style={imageStyle} />
            </div>
            
            {/* Task Details on Right */}
            <div style={taskDetailsStyle}>
              <h3 style={questTitleStyle}>{quest.title}</h3>

              {/* Progress Bar */}
              <div style={progressBarWrapperStyle}>
                <div style={progressBarStyle(quest.progress, quest.maxProgress)} />
                <span style={progressTextStyle}>{quest.progress}/{quest.maxProgress}</span>
              </div>

              {/* Rewards */}
              <p style={rewardTextStyle}>
                {isCompleted(quest.progress, quest.maxProgress)
                  ? `Reward: ${quest.reward}`
                  : 'Complete to unlock rewards'}
              </p>
            </div>
          </div>
        ))}
      </div>
      <button style={claimButtonStyle}>Claim Reward</button>
    </div>
  );
}

// Styles
const containerStyle = {
  //backgroundColor: '#f8f8f8',
  padding: '20px',
  minHeight: '100vh',
  textAlign: 'center',
};

const titleStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  marginBottom: '20px',
};

const questsContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)', // Two cards per row
  gap: '20px',
  justifyContent: 'center',
  alignItems: 'center',
};

const questCardStyle = {
  backgroundColor: '#fff',
  padding: '0', // No padding to match the design
  borderRadius: '10px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  textAlign: 'left',
  width: '100%', // Adjust card width
  height: '180px', // Adjust card height for content
  display: 'flex', // Flexbox for horizontal layout
  flexDirection: 'row',
  justifyContent: 'space-between',
  overflow: 'hidden'
};

const imageContainerStyle = {
  width: '40%', // 40% of the card width for the image
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  // backgroundColor: '#f0f0f0'
   // Light background for the image section
};

const imageStyle = {
  width: '125px',
  height: '125px',
};

const taskDetailsStyle = {
  padding: '10px',
  width: '60%', // 60% of the card width for task details
  display: 'flex',
  flexDirection: 'column',
 justifyContent: 'center',
 marginRight: '18px'
};

const questTitleStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  marginBottom: '10px',
};

const progressBarWrapperStyle = {
  width: '100%',
  height: '18px', // Thicker progress bar
  backgroundColor: '#e0e0e0',
  borderRadius: '5px',
  marginBottom: '10px',
  position: 'relative',
};

const progressBarStyle = (progress, maxProgress) => ({
  width: `${(progress / maxProgress) * 100}%`,
  height: '100%',
  backgroundColor: progress === maxProgress ? '#4caf50' : '#ffcc00',
  borderRadius: '5px',
});

const progressTextStyle = {
  fontSize: '12px',
  position: 'absolute',
  right: '10px',
  top: '-20px',
};

const rewardTextStyle = {
  fontSize: '14px',
};

const claimButtonStyle = {
  backgroundColor: '#652E7F',
  color: '#fff',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginTop: '20px',
  width: '100%',
  maxWidth: '300px',
  margin: '20px auto', // Center the button
};
export default QuestComponent
