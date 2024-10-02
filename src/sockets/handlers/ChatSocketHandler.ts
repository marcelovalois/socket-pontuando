import { Server as SocketIOServer, Socket } from "socket.io";

import { RoomManager } from "../RoomManager";
import { UserHandlers } from "./UserHandlers";
import { MessageHandlers } from "./MessageHandlers";
import { RoomHandlers } from "./RoomHandlers";
import { PrismaExecutionsRepository } from "../../repositories/implementations/PrismaExecutionsRepository";

export class ChatSocketHandler {
  private prismaExecutionRepository;
  private userHandlers;
  private messageHandlers;
  private roomHandlers;
  private connectedUsers;

  constructor(private io: SocketIOServer) {
    this.io = io;

    this.prismaExecutionRepository = new PrismaExecutionsRepository();

    this.userHandlers = new UserHandlers(this.prismaExecutionRepository);
    this.messageHandlers = new MessageHandlers(this.prismaExecutionRepository);
    this.roomHandlers = new RoomHandlers();
    this.connectedUsers = new RoomManager();
  }

  public handleSocketConnection = () => {
    const { io, connectedUsers } = this;

    io.on("connection", async (socket: Socket) => {
      try {
        console.log(`User trying to connect with socket id ${socket.id}`);

        // Handle user connection
        await this.userHandlers.handleUserConnection(socket, connectedUsers);

        // Handle socket events
        socket.on("sendChatMessage", (data, ack) => this.messageHandlers.handleChatMessage(socket, data, ack));
        socket.on("sendAnswerMessage", (data, ack) => this.messageHandlers.handleAnswerMessage(socket, data, ack));
        socket.on("sendPhrase", (data, ack) => this.messageHandlers.handlePhrase(socket, data, ack));

        socket.on("getRoomUsers", (_, ack) => this.roomHandlers.handleGetRoomUsers(socket, ack, connectedUsers));

        socket.on("disconnect", () => this.userHandlers.handleUserDisconnection(socket, connectedUsers));
      } catch (error) {
        console.error(`Error handling socket connection: ${error}`);
      }
    });
  };
}
