import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

export const socket = io(SOCKET_URL);

export const startSpeaking = () => {
  socket.emit('startSpeaking');
};

export const stopSpeaking = () => {
  socket.emit('stopSpeaking');
};

export const onBotSpeakingChange = (callback: (speaking: boolean) => void) => {
  socket.on('botSpeaking', callback);
  return () => {
    socket.off('botSpeaking', callback);
  };
};