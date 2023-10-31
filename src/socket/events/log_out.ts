export async function logOut(socket: any, token: any, io: any) {
  io.to(token).emit("logout_success", {
    message: "Logged Out Succesfully",
  });

  socket.leave(token);
}
