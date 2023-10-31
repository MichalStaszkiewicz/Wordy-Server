import { RoomRefresh } from "../../const/types/room_refresh";

export async function tokenRefresh(socket: any,data:any) {
  var tokens = data as RoomRefresh;
  socket.leave(tokens.oldToken);

  socket.join(tokens.newToken);
}
