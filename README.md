## GoF Pattern Auditor

A prompt‑chaining tool that analyses source code for Gang of Four (GoF)
design patterns, validates them, and (for severe issues) proposes a refactored version of the file.

### How it works
- **Prompt 1 – Pattern Analyser**  
  Detects GoF design patterns (Creational, Structural, Behavioral) in the pasted source file and classifies their intent and context.
- **Prompt 2 – Validator**  
  Validates whether the detected patterns are correctly and intentionally implemented, flags layering/architectural issues, and assigns a severity rating.
- **Prompt 3 – Refactor Suggestion (new)**  
  If any validation result has **Severe** severity, a third prompt asks the model to propose a refactored version of the file that either correctly implements the intended pattern(s) or simplifies the design.

### Running this app
This app is a single‑file HTML/JS artifact that talks directly to Anthropic's Messages API.

1. Serve `app.jsx` as a static file (or open it directly in a browser that allows `fetch` calls to `https://api.anthropic.com` with your API key configured, e.g. via browser/plugin or local proxy).
2. Paste your source code into the left‑hand textarea.
3. (Optional) Fill in the filename field to improve analysis context.
4. Click **Run Full Audit** to execute the analyser + validator chain.
5. If any issue is marked **Severe**, a third step will appear in the Validator panel with a suggested refactored version of the file.

> Note: This was originally designed for Claude Desktop/Artifacts; some environments may require you to adapt how the Anthropic API key is provided.

### Tech
- Plain HTML/CSS/JS single‑file app (`app.jsx`)
- Anthropic Claude Messages API (**sonnet-4.6**)
- Prompt chaining: Pattern Analyser → Validator → (conditional) Refactor Suggestion
