import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

export let io: SocketIOServer;

export const initSocket = (httpServer: HttpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*', // Allow all client terminals to connect
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
  });

  io.on('connection', (socket) => {
    console.log(`⚡ Desk Terminal Connected: ${socket.id}`);

    // Join terminal role room (e.g. 'ADMIN', 'DESIGNER', 'PRINTING', 'BILLING')
    socket.on('join_desk', (role: string) => {
      socket.join(role);
      console.log(`📌 Terminal ${socket.id} joined desk room: ${role}`);
    });

    // Handle Inter-Terminal Broadcast Message
    socket.on('send_announcement', (announcementData: {
      senderName: string;
      senderRole: string;
      message: string;
      urgent?: boolean;
    }) => {
      console.log(`📢 Inter-Terminal Announcement from ${announcementData.senderRole} (${announcementData.senderName}): ${announcementData.message}`);
      io.emit('terminal_announcement', {
        id: 'ann-' + Date.now(),
        ...announcementData,
        timestamp: new Date().toISOString()
      });
    });

    // Handle Direct Message / Instruction to Designer
    socket.on('send_designer_message', (data: {
      orderId: string;
      jobNo: string;
      designerId: string;
      designerName: string;
      senderName: string;
      message: string;
    }) => {
      console.log(`💬 Direct Message to Designer (${data.designerName}) from ${data.senderName}: ${data.message}`);
      io.emit('designer_message_received', {
        id: 'msg-' + Date.now(),
        ...data,
        timestamp: new Date().toISOString()
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`❌ Desk Terminal Disconnected: ${socket.id}`);
    });
  });

  return io;
};
