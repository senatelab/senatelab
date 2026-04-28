# Providers

SenateLab talks to language models via a small adapter layer. Three built-in kinds, one contract.

```ts
export type ProviderKind = "openai-compat" | "ollama" | "custom";

export interface ProviderConfig {
  kind: ProviderKind;
  baseUrl: string;
  apiKey?: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}
```

## openai-compat

Works with any endpoint that speaks OpenAI's Chat Completions format:

- OpenAI itself (`https://api.openai.com/v1`)
- Self-hosted compatible servers (vLLM, TGI, LiteLLM-proxy)
- Cloud gateways (Fireworks, Together, DeepInfra, Groq)

Just set `baseUrl` + `apiKey` + `model`. The client uses the `openai` npm package under the hood.

## Ollama

Point at a local Ollama instance (`http://localhost:11434/v1`). No key needed. Model names match the Ollama `/pull` names (`llama3.1:8b`, `qwen2.5:14b`, etc.).

## custom

An escape hatch. Implement a POST endpoint that accepts the same shape as `openai.chat.completions.create` and returns an SSE stream. Paste the URL into the provider field.

## Retries + backoff

Every call goes through a shared retry policy:

| Attempt | Delay    | Condition                         |
| ------- | -------- | --------------------------------- |
| 1       | —        | Initial                           |
| 2       | 500 ms   | 408, 429, 5xx, connection reset   |
| 3       | 1500 ms  | Same                              |
| 4       | 4000 ms  | Same                              |

After the fourth attempt, the agent transitions to `error` and surfaces the HTTP response in its report.

## Streaming

All providers stream by default. The main process forwards chunks to the renderer via `message:stream` events. The renderer appends them to the live message in place, so there's no debounce lag.

## Switching providers

You can switch providers per-agent without restart:

```ts
await window.senatelab.agent.updateProvider(agentId, newConfig);
```

The change is persisted to `agents.provider_json` and takes effect on the next turn.
