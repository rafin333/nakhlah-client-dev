import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const WelcomeModal = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setIsVisible(true);
      localStorage.setItem('hasSeenWelcome', 'true');
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={handleClose} className="close-button">
          <X size={24} />
        </button>
        <h1 className="p-2 font-bold text-4xl">Welcome to Nakhlah!</h1>
        <p className="p-2 font-bold text-2xl">Enjoy your learning journey!</p>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.25);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          backdrop-filter: blur(10px);
          background: rgba(203, 143, 21, 0.2);
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          max-width: 600px;
          width: 100%;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          position: relative;
        }
        .close-button {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
        }
        .close-button:hover {
          color: red;
        }
      `}</style>
    </div>
  );
};

export default WelcomeModal;