import { JwtPayload } from "jsonwebtoken";
import { secretToken } from "../../const/config";

const jwt = require("jsonwebtoken");
export function joinRoom(connectedClients: Map<string, string>, token: any,socket:any) {
  if (!connectedClients.has(token)) {
    var verifiedToken = jwt.verify(token, secretToken) as JwtPayload;
    connectedClients.set(token, verifiedToken.userId);
  }

  socket.join(token);
}
