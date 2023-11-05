export async function logOut(socket: any, token: any, io: any) {
  socket.leave(token);
  io.to(token).emit("logout_success", {
    message: "Logged Out Succesfully",
  });

  socket.disconnect();
}
