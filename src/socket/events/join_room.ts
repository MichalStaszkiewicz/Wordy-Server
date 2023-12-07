import { JwtPayload } from "jsonwebtoken";


const jwt = require("jsonwebtoken");
export function joinRoom(connectedClients: Map<string, string>, token: any,socket:any) {
  if (!connectedClients.has(token)) {
    var verifiedToken = jwt.verify(token,  process.env.SECRET!) as JwtPayload;
    connectedClients.set(token, verifiedToken.userId);
  }

  socket.join(token);
}
