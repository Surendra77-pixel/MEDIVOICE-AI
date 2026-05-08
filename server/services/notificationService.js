let io;

/**
 * notificationService
 * Wrapper for socket.io to send real-time alerts.
 */
const init = (socketIo) => {
  io = socketIo;
};

const sendToUser = (userId, event, data) => {
  if (io) {
    io.to(userId).emit(event, data);
  }
};

const broadcastToRole = (role, event, data) => {
  if (io) {
    io.to(role).emit(event, data);
  }
};

const sendNotification = (userId, message, type = 'info') => {
  sendToUser(userId, 'notification', {
    id: Date.now(),
    message,
    type,
    timestamp: new Date()
  });
};

module.exports = {
  init,
  sendToUser,
  broadcastToRole,
  sendNotification
};
