import React, { useState, useEffect } from 'react';
import { MessageCircle, Mic, Volume2 } from 'lucide-react';
import { startSpeaking, stopSpeaking, onBotSpeakingChange } from '../services/socket';

const VoiceBotInterface = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spectrumBars, setSpectrumBars] = useState(Array(20).fill(10));

  useEffect(() => {
    // Subscribe to bot speaking status changes
    const unsubscribe = onBotSpeakingChange((speaking) => {
      setIsSpeaking(speaking);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Simulate voice activity
  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setSpectrumBars(prev => 
          prev.map(() => Math.random() * 40 + 10)
        );
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isSpeaking]);

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      startSpeaking();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-gray-900 rounded-lg shadow-xl border border-gray-800">
      {/* Bot avatar and status */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
            <p className="text-sm text-gray-400">
              {isSpeaking ? 'Speaking...' : 'Idle'}
            </p>
          </div>
        </div>
        <button
          onClick={toggleSpeech}
          className={`p-2 rounded-full transition-colors ${
            isSpeaking ? 'bg-blue-900 text-blue-400' : 'bg-gray-800 text-gray-400'
          }`}
        >
          {isSpeaking ? <Volume2 className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </button>
      </div>

      {/* Spectrum visualization */}
      <div className="w-full h-24 bg-gray-800 rounded-lg p-4 flex items-center gap-1">
        {spectrumBars.map((height, index) => (
          <div
            key={index}
            className="flex-1 bg-blue-400 rounded-full transition-all duration-100 ease-in-out"
            style={{
              height: `${height}%`,
              opacity: isSpeaking ? 0.7 : 0.3,
              transform: `scaleY(${isSpeaking ? 1 : 0.3})`
            }}
          />
        ))}
      </div>

      {/* Instruction text */}
      <div className="mt-4 text-center text-sm text-gray-400">
        Click the microphone icon to {isSpeaking ? 'stop' : 'start'} voice
      </div>
    </div>
  );
};

export default VoiceBotInterface;