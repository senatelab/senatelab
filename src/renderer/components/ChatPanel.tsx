import { useEffect, useState } from "react";
import { useStore } from "../state/store.js";

export function ChatPanel(): JSX.Element {
  const { activeChannelId, messages, agents, sendMessage, selectChannel } = useStore((s) => ({
    activeChannelId: s.activeChannelId,
    messages: s.messages,
    agents: s.agents,
    sendMessage: s.sendMessage,
    selectChannel: s.selectChannel,
  }));
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (activeChannelId && !messages[activeChannelId]) {
      void selectChannel(activeChannelId);
    }
  }, [activeChannelId, messages, selectChannel]);

  const list = activeChannelId ? (messages[activeChannelId] ?? []) : [];
  const nameFor = (id: string) => agents.find((a) => a.id === id)?.name ?? "unknown";

  return (
    <aside className="chat-panel">
      <header className="chat-head">
        <div className="chat-title">
          {activeChannelId ? `#${activeChannelId.slice(0, 8)}` : "No channel"}
        </div>
      </header>

      <div className="chat-messages">
        {list.map((m) => (
          <div key={m.id} className="chat-msg">
            <div className="chat-msg-header">
              <span className="chat-msg-name">{nameFor(m.senderId)}</span>
              <span className="chat-msg-time">
                {new Date(m.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="chat-msg-body">{m.body}</div>
          </div>
        ))}
      </div>

      <form
        className="chat-composer"
        onSubmit={(e) => {
          e.preventDefault();
          const body = draft.trim();
          if (!body || agents.length === 0) return;
          void sendMessage(body, agents[0].id);
          setDraft("");
        }}
      >
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Message…"
          className="chat-input"
        />
      </form>
    </aside>
  );
}
