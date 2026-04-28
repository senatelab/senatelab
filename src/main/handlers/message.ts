import { IpcMain, WebContents } from "electron";
import { randomUUID } from "node:crypto";
import { getDb } from "../db.js";
import { IPC } from "../../shared/ipc.js";
import type { Message } from "../../shared/types.js";

interface MessageRow {
  id: string;
  channel_id: string;
  sender_id: string;
  body: string;
  created_at: number;
  reply_to_id: string | null;
}

function rowToMessage(r: MessageRow): Message {
  return {
    id: r.id,
    channelId: r.channel_id,
    senderId: r.sender_id,
    body: r.body,
    createdAt: r.created_at,
    replyToId: r.reply_to_id ?? undefined,
  };
}

export function registerMessageHandlers(ipc: IpcMain): void {
  ipc.handle(IPC.messageList, (_e, channelId: string, limit = 200): Message[] => {
    const rows = getDb()
      .prepare(
        "SELECT * FROM messages WHERE channel_id = ? ORDER BY created_at DESC LIMIT ?",
      )
      .all(channelId, limit) as MessageRow[];
    return rows.map(rowToMessage).reverse();
  });

  ipc.handle(
    IPC.messageSend,
    (e, channelId: string, body: string, senderId: string): Message => {
      const id = randomUUID();
      const createdAt = Date.now();
      getDb()
        .prepare(
          "INSERT INTO messages (id,channel_id,sender_id,body,created_at) VALUES (?,?,?,?,?)",
        )
        .run(id, channelId, senderId, body, createdAt);
      const msg: Message = { id, channelId, senderId, body, createdAt };
      broadcastStream(e.sender, channelId, body);
      return msg;
    },
  );
}

function broadcastStream(wc: WebContents, channelId: string, body: string): void {
  wc.send(IPC.messageStream, { channelId, body });
}
