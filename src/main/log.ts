type Level = "debug" | "info" | "warn" | "error";

function fmt(level: Level, msg: string, meta?: unknown): string {
  const ts = new Date().toISOString();
  const tag = level.toUpperCase().padEnd(5);
  if (meta === undefined) return `${ts} ${tag} ${msg}`;
  try {
    return `${ts} ${tag} ${msg} ${JSON.stringify(meta, safeReplacer)}`;
  } catch {
    return `${ts} ${tag} ${msg}`;
  }
}

function safeReplacer(_key: string, value: unknown): unknown {
  if (value instanceof Error) {
    return { name: value.name, message: value.message, stack: value.stack };
  }
  return value;
}

export const log = {
  debug: (msg: string, meta?: unknown) => {
    if (process.env.SENATELAB_DEBUG) console.debug(fmt("debug", msg, meta));
  },
  info: (msg: string, meta?: unknown) => console.log(fmt("info", msg, meta)),
  warn: (msg: string, meta?: unknown) => console.warn(fmt("warn", msg, meta)),
  error: (msg: string, meta?: unknown) => console.error(fmt("error", msg, meta)),
};
