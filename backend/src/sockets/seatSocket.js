module.exports = (io, socket) => {
  socket.on('joinEvent', (eventId) => {
    socket.join(`event_${eventId}`);
  });
};
