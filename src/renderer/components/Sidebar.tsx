import { useStore } from "../state/store.js";

export function Sidebar(): JSX.Element {
  const { activeWorkspace, agents, channels, activeChannelId, selectChannel } = useStore(
    (s) => ({
      activeWorkspace: s.activeWorkspace,
      agents: s.agents,
      channels: s.channels,
      activeChannelId: s.activeChannelId,
      selectChannel: s.selectChannel,
    }),
  );

  return (
    <aside className="sidebar">
      <header className="sidebar-head">
        <div className="sidebar-title">{activeWorkspace?.name ?? "—"}</div>
      </header>

      <section className="sidebar-section">
        <div className="section-header">Channels</div>
        {channels.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`sidebar-row${c.id === activeChannelId ? " sidebar-row-active" : ""}`}
            onClick={() => void selectChannel(c.id)}
          >
            <span className="channel-hash">#</span>
            <span className="row-name">{c.name}</span>
          </button>
        ))}
      </section>

      <section className="sidebar-section">
        <div className="section-header">Agents</div>
        {agents.map((a) => (
          <div key={a.id} className="sidebar-row">
            <span className="avatar-dot" style={{ background: a.avatarColor }}>
              {a.name[0]}
            </span>
            <span className="row-name">{a.name}</span>
            <span className={`status-pill status-${a.status}`}>{a.status}</span>
          </div>
        ))}
      </section>
    </aside>
  );
}
