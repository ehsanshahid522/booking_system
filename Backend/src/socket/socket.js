export const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join personal room based on user ID
    socket.on('join_room', ({ userId, role }) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their personal room`);

      if (role === 'customer') socket.join('customers');
      if (role === 'barber') socket.join('barbers');
      if (role === 'admin') socket.join('admins');
    });

    // Chat functionality
    socket.on('send_message', (data) => {
      // data format: { receiverId, message: {} }
      io.to(`user_${data.receiverId}`).emit('receive_message', data.message);
    });

    socket.on('typing', ({ receiverId, senderId }) => {
      io.to(`user_${receiverId}`).emit('typing', { senderId });
    });

    socket.on('stop_typing', ({ receiverId, senderId }) => {
      io.to(`user_${receiverId}`).emit('stop_typing', { senderId });
    });

    socket.on('message_read', ({ senderId, receiverId }) => {
      // The person who read it (receiverId) tells the sender (senderId) it's read
      io.to(`user_${senderId}`).emit('message_read', { readerId: receiverId });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
