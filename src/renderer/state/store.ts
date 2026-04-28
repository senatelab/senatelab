import { create } from "zustand";
import type { Workspace, Agent, Channel, Message } from "../../shared/types.js";

interface Store {
  loading: boolean;
  error: string | null;
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  agents: Agent[];
  channels: Channel[];
  messages: Record<string, Message[]>;
  activeChannelId: string | null;

  load: () => Promise<void>;
  selectChannel: (id: string) => Promise<void>;
  sendMessage: (body: string, senderId: string) => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  loading: true,
  error: null,
  workspaces: [],
  activeWorkspace: null,
  agents: [],
  channels: [],
  messages: {},
  activeChannelId: null,

  async load() {
    set({ loading: true, error: null });
    try {
      const workspaces = await window.senatelab.workspace.list();
      const active = workspaces[0] ?? null;
      if (!active) {
        set({ loading: false, workspaces, activeWorkspace: null });
        return;
      }
      const [agents, channels] = await Promise.all([
        window.senatelab.agent.list(active.id),
        window.senatelab.channel.list(active.id),
      ]);
      set({
        loading: false,
        workspaces,
        activeWorkspace: active,
        agents,
        channels,
        activeChannelId: channels[0]?.id ?? null,
      });
    } catch (err) {
      set({ loading: false, error: (err as Error).message });
    }
  },

  async selectChannel(id) {
    set({ activeChannelId: id });
    const msgs = await window.senatelab.message.list(id);
    set((s) => ({ messages: { ...s.messages, [id]: msgs } }));
  },

  async sendMessage(body, senderId) {
    const channelId = get().activeChannelId;
    if (!channelId) return;
    const msg = await window.senatelab.message.send(channelId, body, senderId);
    set((s) => ({
      messages: {
        ...s.messages,
        [channelId]: [...(s.messages[channelId] ?? []), msg],
      },
    }));
  },
}));
