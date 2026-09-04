import { io, Socket } from 'socket.io-client';

const getSocketUrl = () => {
  const metaEnv = (import.meta as any).env;
  if (metaEnv && metaEnv.VITE_SOCKET_URL) {
    return metaEnv.VITE_SOCKET_URL;
  }
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    if (window.location.port === '3000') {
      return `${protocol}//${hostname}:5000`;
    }
    return `${protocol}//${window.location.host}`;
  }
  return 'http://127.0.0.1:5000';
};

const SOCKET_SERVER_URL = getSocketUrl();

export const socket: Socket = io(SOCKET_SERVER_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log(`⚡ Connected to GS Designs Real-time Server [Socket ID: ${socket.id}]`);
});

socket.on('disconnect', () => {
  console.log('⚠️ Disconnected from GS Designs Real-time Server');
});

export const joinDeskRoom = (role: string) => {
  if (socket.connected) {
    socket.emit('join_desk', role);
  }
};

export const sendBroadcastAnnouncement = (senderName: string, senderRole: string, message: string, urgent: boolean = false) => {
  if (socket.connected) {
    socket.emit('send_announcement', {
      senderName,
      senderRole,
      message,
      urgent
    });
  }
};

export const sendDesignerMessage = (data: {
  orderId: string;
  jobNo: string;
  designerId: string;
  designerName: string;
  senderName: string;
  message: string;
}) => {
  if (socket.connected) {
    socket.emit('send_designer_message', data);
  }
};

export const emitOrderUpdate = (order: any) => {
  if (socket.connected) {
    socket.emit('update_order', order);
  }
};

export const emitTerminalChat = (chatData: {
  id: string;
  senderName: string;
  senderRole: string;
  targetRole: string;
  text: string;
  orderId?: string;
  jobNo?: string;
  timestamp: string;
  isUrgent?: boolean;
}) => {
  if (socket.connected) {
    socket.emit('send_terminal_chat', chatData);
  }
};
