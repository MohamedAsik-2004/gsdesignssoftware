import { io, Socket } from 'socket.io-client';

const getSocketUrl = () => {
  const metaEnv = (import.meta as any).env;
  if (metaEnv && metaEnv.VITE_SOCKET_URL) {
    return metaEnv.VITE_SOCKET_URL;
  }
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`;
  }
  return 'http://127.0.0.1:5000';
};

const SOCKET_SERVER_URL = getSocketUrl();

export const socket: Socket = io(SOCKET_SERVER_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  transports: ['websocket', 'polling']
});

let activeRole = 'ADMIN';

socket.on('connect', () => {
  console.log(`⚡ Connected to GS Designs Real-time Server [Socket ID: ${socket.id}]`);
  if (activeRole) {
    socket.emit('join_desk', activeRole);
  }
});

socket.on('disconnect', (reason) => {
  console.warn(`⚠️ Disconnected from GS Designs Real-time Server (${reason}). Reconnecting...`);
});

export const joinDeskRoom = (role: string) => {
  activeRole = role;
  if (socket.connected) {
    socket.emit('join_desk', role);
  } else {
    socket.connect();
  }
};

const safeEmit = (event: string, data: any) => {
  if (!socket.connected) {
    socket.connect();
  }
  socket.emit(event, data);
};

export const sendBroadcastAnnouncement = (senderName: string, senderRole: string, message: string, urgent: boolean = false) => {
  safeEmit('send_announcement', {
    senderName,
    senderRole,
    message,
    urgent
  });
};

export const sendDesignerMessage = (data: {
  orderId: string;
  jobNo: string;
  designerId: string;
  designerName: string;
  senderName: string;
  message: string;
}) => {
  safeEmit('send_designer_message', data);
};

export const emitOrderUpdate = (order: any) => {
  safeEmit('update_order', order);
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
  safeEmit('send_terminal_chat', chatData);
};
