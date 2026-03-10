# GoF Pattern Auditor

A prompt-chaining tool that analyses source code for Gang of Four (GoF) 
design patterns, then automatically validates the results with a second pass.

## How it works
- **Prompt 1** — Analyses the file for all 23 GoF patterns across Creational, Structural, and Behavioral categories
- **Prompt 2** — Validates Prompt 1's findings for correctness, intentionality, and architectural risk

## Running this app
This app is built as a Claude.ai artifact and uses Anthropic's API proxy.  
To run it:
1. Open [claude.ai](https://claude.ai)
2. Paste the contents of `App.jsx` and ask Claude to render it as an artifact
3. Paste your source code into the left panel and click **Run Full Audit**

## Tech
- React (JSX)
- Anthropic Claude API (claude-sonnet-4-20250514)
- Prompt chaining: Analyser → Validator
