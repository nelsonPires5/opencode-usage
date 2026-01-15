---
description: Show remaining quotas for AI coding providers (OpenAI, Google, z.ai)
---

Call the `quotas` tool.

If $ARGUMENTS is empty, fetch quotas for all configured providers.
If $ARGUMENTS is provided, it should be one of: openai, google, zai-coding-plan (aliases: codex, antigravity, zai).

The tool returns a JSON string with a list of provider results:

- `provider`, `ok`, `configured`, `error`
- `usage.windows` for global windows
- `usage.models[model].windows` for per-model windows

Parse the JSON, then return a short markdown summary per provider.
Include remaining percent, reset time remaining, window size, and any errors.
