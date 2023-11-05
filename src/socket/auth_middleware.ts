import { IRequest } from "../interfaces/request";
import * as hapi from "@hapi/hapi";
import { secretToken } from "../const/config";
import { JwtPayload } from "../interfaces/jwt_payload";
import { io } from "socket.io-client";
import { generateToken } from "../const/validation/validate_auth";
import { UserEntity } from "../entities/user_entity";
import { UserService } from "../services/user_service";
import { RoomRefresh } from "../const/types/room_refresh";
const jwt = require("jsonwebtoken");
export const authMiddleware = async (
  request: IRequest,
  h: hapi.ResponseToolkit
) => {
  const token = request.headers;

  return h.continue;
};

export async function socketMiddleware(
  packet: any,
  next: any,
  socket: any,
  connectedClients: Map<string, string>,io:any
) {
  const headers = socket.handshake.headers;
  let token = headers.authorization;

  if (token != undefined) {
    try {
      let verifiedToken = (await jwt.verify(token, secretToken)) as JwtPayload;

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        let userId: string = connectedClients.get(token)!;

        let user: UserEntity = await UserService.getUserById(userId);
        let verifiedToken = jwt.verify(
          user.refreshToken,
          secretToken
        ) as JwtPayload;
        const newToken = generateToken({ userId: verifiedToken.userId });

        headers.authorization = newToken;

        let roomData: RoomRefresh = {
          newToken: newToken,
          oldToken: token!,
        };
        socket.leave(token!);
        connectedClients.delete(userId);
        socket.join(newToken);
        connectedClients.set(newToken, user.id);

        io.to(newToken).emit("token_expired", { token: newToken });

        next();
      } else {
        console.log(error);
        next();
      }
    }
  } else {
    next();
  }
}
