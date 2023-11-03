
import { server } from "../server";

import { Server, Socket } from "socket.io";

import {
  authMiddleware,
  socketMiddleware as tokenExpireMiddleware,
} from "./auth_middleware";
import { JwtPayload } from "../interfaces/jwt_payload";
import { joinRoom } from "./events/join_room";
import { RoomRefresh } from "../const/types/room_refresh";
import { quizSummary } from "./events/quiz_summary";
import { topicScreenLoadCourses } from "./events/topic_screen_load_courses";
import { addCourse } from "./events/add_course";
import { loadCurrentCourse } from "./events/load_current_course";
import { tokenRefresh } from "./events/token_refresh";
import { logOut } from "./events/log_out";
import { disconnect } from "./events/disconnect";
import { SocketEvnets as SocketEvents } from "./events/const";
const jwt = require("jsonwebtoken");

export function initSocket() {
  let connectedClients = new Map<string, string>([]);
  const io = require("socket.io")(server.listener, {
    cors: {
      origin: "*",
      allowedHeaders: "*",
    },
  });

  io.on(SocketEvents.connection, (socket: Socket) => {
    socket.on(SocketEvents.authenticate, async (token) => {});
    socket.use((packet, next) => {
      tokenExpireMiddleware(packet, next, socket, connectedClients, io);
    });

    socket.on(SocketEvents.joinRoom, (token) => {
      joinRoom(connectedClients, token, socket);
    });

    socket.on(SocketEvents.quizSummary, async (data) => {
      quizSummary(connectedClients, data, socket, io);
    });
    socket.on(SocketEvents.loadUserCourses, async (data) => {
      topicScreenLoadCourses(connectedClients, data, socket, io);
    });

    socket.on(SocketEvents.addCourse, async (token, course) => {
      addCourse(connectedClients, token, socket, io);
    });

    socket.on(SocketEvents.loadCurrentCourse, async (data) => {
      loadCurrentCourse(connectedClients, data, socket, io);
    });
    socket.on(SocketEvents.tokenRefresh, (data) => {
      tokenRefresh(socket, data);
    });
    socket.on(SocketEvents.logout, (token) => {
      logOut(socket, token, io);
    });
    socket.on(SocketEvents.disconnect, disconnect);
  });
}
