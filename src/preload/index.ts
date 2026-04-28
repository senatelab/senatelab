import { contextBridge, ipcRenderer } from "electron";
import { IPC, type SenateLabAPI } from "../shared/ipc.js";

const api: SenateLabAPI = {
  workspace: {
    list: () => ipcRenderer.invoke(IPC.workspaceList),
    create: (name, p) => ipcRenderer.invoke(IPC.workspaceCreate, name, p),
    delete: (id) => ipcRenderer.invoke(IPC.workspaceDelete, id),
  },
  agent: {
    list: (workspaceId) => ipcRenderer.invoke(IPC.agentList, workspaceId),
    create: (partial) => ipcRenderer.invoke(IPC.agentCreate, partial),
    start: (id) => ipcRenderer.invoke(IPC.agentStart, id),
    stop: (id) => ipcRenderer.invoke(IPC.agentStop, id),
    updateProvider: (id, provider) =>
      ipcRenderer.invoke(IPC.agentUpdateProvider, id, provider),
  },
  channel: {
    list: (workspaceId) => ipcRenderer.invoke(IPC.channelList, workspaceId),
    create: (partial) => ipcRenderer.invoke(IPC.channelCreate, partial),
  },
  message: {
    list: (channelId, limit) => ipcRenderer.invoke(IPC.messageList, channelId, limit),
    send: (channelId, body, senderId) =>
      ipcRenderer.invoke(IPC.messageSend, channelId, body, senderId),
    onStream: (cb) => {
      const handler = (_e: Electron.IpcRendererEvent, chunk: { channelId: string; body: string }) =>
        cb(chunk);
      ipcRenderer.on(IPC.messageStream, handler);
      return () => ipcRenderer.removeListener(IPC.messageStream, handler);
    },
  },
  task: {
    list: (workspaceId) => ipcRenderer.invoke(IPC.taskList, workspaceId),
    upsert: (task) => ipcRenderer.invoke(IPC.taskUpsert, task),
  },
  report: {
    list: (agentId) => ipcRenderer.invoke(IPC.reportList, agentId),
    upsert: (report) => ipcRenderer.invoke(IPC.reportUpsert, report),
  },
};

contextBridge.exposeInMainWorld("senatelab", api);
