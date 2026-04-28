import { useEffect } from "react";
import { Sidebar } from "./components/Sidebar.js";
import { Canvas } from "./components/Canvas.js";
import { ChatPanel } from "./components/ChatPanel.js";
import { useStore } from "./state/store.js";

export function App(): JSX.Element {
  const { load, loading, error } = useStore((s) => ({
    load: s.load,
    loading: s.loading,
    error: s.error,
  }));

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="screen-loading">Loading workspace…</div>;
  if (error) return <div className="screen-error">Failed to start: {error}</div>;

  return (
    <div className="app-shell">
      <Sidebar />
      <Canvas />
      <ChatPanel />
    </div>
  );
}
