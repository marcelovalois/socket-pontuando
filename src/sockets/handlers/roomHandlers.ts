import { Socket } from "socket.io";
import { RoomManager } from "../roomManager";

export const handleGetRoomUsers = (socket: Socket, ack: (arg0: string) => void, connectedUsers: RoomManager) => {
  try {
    // Obtenha o id da atividade do query params
    const activity_id = socket.handshake.query.activity_id as string;

    // Obtém os usuários conectados à sala
    const users = connectedUsers.getRoomUsers(activity_id);

    // Envia a lista de todos os outros usuários conectados à sala
    socket.to(activity_id).emit("onGetRoomUsers", users);
    // Envia a lista de usuários conectados ao próprio socket
    socket.emit("onGetRoomUsers", users);

    // Envia uma resposta de sucesso
    if (ack) ack(JSON.stringify({ success: true, message: "Room users broadcasted by server" }));
  } catch (error) {
    if (error instanceof Error) {
      if (ack) ack(JSON.stringify({ success: false, message: error.message }));
    }
  }
};
