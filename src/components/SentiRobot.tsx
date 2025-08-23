import { useState, useEffect } from 'react';
import sentiRobotImage from '@/assets/senti-robot.png';

interface SentiRobotProps {
  mood?: 'happy' | 'sad' | 'neutral' | 'thinking';
  message?: string;
  size?: 'small' | 'medium' | 'large';
  animate?: boolean;
}

export default function SentiRobot({ 
  mood = 'happy', 
  message = "Hi there! I'm Senti! 🤖", 
  size = 'medium',
  animate = true 
}: SentiRobotProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const moodClasses = {
    happy: 'filter brightness-110 saturate-110',
    sad: 'filter brightness-90 saturate-75 hue-rotate-180',
    neutral: 'filter brightness-100 saturate-100',
    thinking: 'filter brightness-105 saturate-90 contrast-110'
  };

  const containerClasses = `
    flex flex-col items-center space-y-4 transition-all duration-500
    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
    ${animate ? 'float-gentle' : ''}
  `;

  return (
    <div className={containerClasses}>
      <div className={`relative ${animate ? 'bounce-gentle' : ''}`}>
        <img 
          src={sentiRobotImage} 
          alt="Senti the friendly robot" 
          className={`${sizeClasses[size]} ${moodClasses[mood]} transition-all duration-300`}
        />
        
        {/* Robot "thinking" indicator */}
        {mood === 'thinking' && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-pulse">
            <div className="w-2 h-2 bg-primary-glow rounded-full absolute top-1 left-1 animate-ping"></div>
          </div>
        )}
      </div>
      
      {/* Speech bubble */}
      {message && (
        <div className="relative max-w-xs">
          <div className="card-lab bg-white p-4 rounded-2xl shadow-lg relative">
            <p className="text-sm font-medium text-foreground text-center">
              {message}
            </p>
            {/* Speech bubble tail */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-4 bg-white rotate-45 shadow-sm"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}