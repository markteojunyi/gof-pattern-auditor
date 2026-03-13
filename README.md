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

**Recommended usage (Claude Desktop / Claude Artifacts):**
1. Open Claude Desktop or `claude.ai`.
2. Create a new Artifact and paste the contents of `app.jsx` into it, might have to change it to .html
3. Let Claude render the UI, then paste your source code into the left‑hand textarea.
4. Fill in the filename field to improve analysis context.
5. Click **Run Full Audit** to execute the analyser → validator (→ conditional refactor) chain.
6. If it doesn't work, ask Claude how to solve the problem

**Alternative usage (served locally):**
1. Serve `app.jsx` as a static file from a simple HTTP server.
2. Open it in a browser that is configured to send requests to `https://api.anthropic.com` with your API key (e.g. via local proxy, extension, or custom environment).
3. Use the UI exactly as described above.

### Tech
- Plain HTML/CSS/JS single‑file app (`app.jsx`)
- Anthropic Claude Messages API (**sonnet-4.6**)
- Prompt chaining: Pattern Analyser → Validator → (conditional) Refactor Suggestion
