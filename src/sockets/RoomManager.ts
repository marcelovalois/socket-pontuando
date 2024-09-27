export class RoomManager {
  private rooms: Map<string, ChatUser[]> = new Map();

  constructor() {
    this.rooms;
  }

  public joinRoom(room: string, user: ChatUser): void {
    if (!this.rooms.has(room)) {
      this.rooms.set(room, [user]);
    } else {
      const users = this.rooms.get(room);
      if (users) {
        users?.push(user);
        this.rooms.set(room, users);
      }
    }
  }

  public leaveRoom(room: string, socketId: string): void {
    if (this.rooms.has(room)) {
      const users = this.rooms.get(room);
      if (users) {
        const updatedUsers = users.filter((u) => u.socketId !== socketId);
        this.rooms.set(room, updatedUsers);
      }
    }
  }

  public getRoomUsers(room: string): ChatUser[] {
    return this.rooms.get(room) || [];
  }
}