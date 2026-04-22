export const registerSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    socket.on("project:join", (projectId) => {
      socket.join(`project:${projectId}`);
    });

    socket.on("pullRequest:join", (pullRequestId) => {
      socket.join(`pullRequest:${pullRequestId}`);
    });

    socket.on("typing:start", ({ pullRequestId, user }) => {
      socket.to(`pullRequest:${pullRequestId}`).emit("typing:update", {
        user,
        isTyping: true
      });
    });

    socket.on("typing:stop", ({ pullRequestId, user }) => {
      socket.to(`pullRequest:${pullRequestId}`).emit("typing:update", {
        user,
        isTyping: false
      });
    });

    socket.on("disconnect", () => {
      socket.removeAllListeners();
    });
  });
};
