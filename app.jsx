<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>GoF Pattern Auditor</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600;700&family=Syne:wght@400;600;800&display=swap');

  :root {
    --bg: #0a0c10;
    --surface: #111318;
    --surface2: #1a1d24;
    --border: #2a2d36;
    --accent: #00e5a0;
    --accent2: #7c6dfa;
    --warn: #f59e0b;
    --danger: #ef4444;
    --text: #e2e8f0;
    --muted: #64748b;
    --glow: 0 0 20px rgba(0,229,160,0.15);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'JetBrains Mono', monospace;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  /* Subtle grid bg */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,229,160,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,229,160,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  header {
    position: relative;
    z-index: 1;
    padding: 28px 40px 20px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .logo {
    width: 36px; height: 36px;
    background: var(--accent);
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    flex-shrink: 0;
    animation: pulse 3s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }

  header h1 {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 1.3rem;
    letter-spacing: -0.02em;
    color: var(--text);
  }

  header h1 span { color: var(--accent); }

  .badge {
    margin-left: auto;
    font-size: 0.65rem;
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--muted);
    padding: 4px 10px;
    border-radius: 20px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  main {
    position: relative;
    z-index: 1;
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto 1fr;
    gap: 0;
    max-height: calc(100vh - 85px);
  }

  .input-panel {
    grid-column: 1;
    grid-row: 1 / 3;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--border);
    height: calc(100vh - 85px);
  }

  .panel-header {
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--surface);
  }

  .panel-num {
    width: 22px; height: 22px;
    border-radius: 50%;
    background: var(--accent);
    color: #000;
    font-size: 0.7rem;
    font-weight: 700;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .panel-num.two { background: var(--accent2); }

  .panel-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text);
  }

  .filename-row {
    padding: 12px 24px;
    border-bottom: 1px solid var(--border);
    background: var(--surface);
  }

  .filename-row input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    color: var(--text);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.8rem;
    padding: 8px 12px;
    border-radius: 6px;
    outline: none;
    transition: border-color 0.2s;
  }
  .filename-row input:focus { border-color: var(--accent); }
  .filename-row input::placeholder { color: var(--muted); }

  textarea {
    flex: 1;
    width: 100%;
    background: var(--bg);
    border: none;
    color: var(--text);
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.78rem;
    line-height: 1.6;
    padding: 20px 24px;
    resize: none;
    outline: none;
    tab-size: 2;
  }
  textarea::placeholder { color: var(--muted); }

  .run-row {
    padding: 16px 24px;
    border-top: 1px solid var(--border);
    background: var(--surface);
  }

  .btn-run {
    width: 100%;
    padding: 12px;
    background: var(--accent);
    color: #000;
    border: none;
    border-radius: 8px;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-run:hover:not(:disabled) {
    background: #00ffb3;
    box-shadow: var(--glow);
    transform: translateY(-1px);
  }

  .btn-run:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }

  .btn-run .spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(0,0,0,0.3);
    border-top-color: #000;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: none;
  }
  .btn-run.loading .spinner { display: block; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Output panels */
  .output-panel {
    display: flex;
    flex-direction: column;
    border-bottom: 1px solid var(--border);
    overflow: hidden;
  }

  .output-panel:last-child { border-bottom: none; }

  .output-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px 24px;
    background: var(--bg);
  }

  .output-body::-webkit-scrollbar { width: 4px; }
  .output-body::-webkit-scrollbar-track { background: transparent; }
  .output-body::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }

  .placeholder-msg {
    color: var(--muted);
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 100%;
  }

  /* Pattern cards */
  .result-meta {
    margin-bottom: 16px;
    padding: 12px 16px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  .result-meta .file { color: var(--accent); font-size: 0.8rem; font-weight: 600; }
  .result-meta .layer { color: var(--muted); font-size: 0.72rem; margin-top: 4px; }
  .result-meta .resp { color: var(--text); font-size: 0.75rem; margin-top: 4px; }

  .pattern-card {
    margin-bottom: 10px;
    padding: 14px 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    border-left: 3px solid var(--border);
    transition: border-color 0.2s;
  }

  .pattern-card.high { border-left-color: var(--accent); }
  .pattern-card.medium { border-left-color: var(--warn); }
  .pattern-card.low { border-left-color: var(--muted); }

  .card-top {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    flex-wrap: wrap;
  }

  .card-name {
    font-family: 'Syne', sans-serif;
    font-weight: 700;
    font-size: 0.85rem;
    color: var(--text);
  }

  .tag {
    font-size: 0.65rem;
    padding: 2px 8px;
    border-radius: 12px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-weight: 600;
  }

  .tag.creational { background: rgba(124,109,250,0.2); color: var(--accent2); border: 1px solid rgba(124,109,250,0.3); }
  .tag.structural { background: rgba(0,229,160,0.15); color: var(--accent); border: 1px solid rgba(0,229,160,0.2); }
  .tag.behavioral { background: rgba(245,158,11,0.15); color: var(--warn); border: 1px solid rgba(245,158,11,0.2); }
  .tag.conf-high { background: rgba(0,229,160,0.1); color: var(--accent); border: 1px solid rgba(0,229,160,0.2); }
  .tag.conf-medium { background: rgba(245,158,11,0.1); color: var(--warn); border: 1px solid rgba(245,158,11,0.2); }
  .tag.conf-low { background: rgba(100,116,139,0.1); color: var(--muted); border: 1px solid rgba(100,116,139,0.2); }

  .card-reasoning {
    font-size: 0.74rem;
    color: var(--muted);
    line-height: 1.5;
  }

  .no-patterns {
    padding: 12px 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--muted);
    font-size: 0.78rem;
  }

  /* Validation cards */
  .val-card {
    margin-bottom: 10px;
    padding: 14px 16px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  .val-card .val-top {
    display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap;
  }

  .valid-badge { font-size: 0.68rem; padding: 2px 8px; border-radius: 12px; font-weight: 700; text-transform: uppercase; }
  .valid-badge.valid { background: rgba(0,229,160,0.15); color: var(--accent); border: 1px solid rgba(0,229,160,0.2); }
  .valid-badge.invalid { background: rgba(239,68,68,0.15); color: var(--danger); border: 1px solid rgba(239,68,68,0.2); }

  .sev-badge { font-size: 0.65rem; padding: 2px 8px; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.06em; }
  .sev-none { background: rgba(100,116,139,0.1); color: var(--muted); border: 1px solid rgba(100,116,139,0.2); }
  .sev-minor { background: rgba(245,158,11,0.1); color: var(--warn); border: 1px solid rgba(245,158,11,0.2); }
  .sev-moderate { background: rgba(249,115,22,0.15); color: #fb923c; border: 1px solid rgba(249,115,22,0.2); }
  .sev-severe { background: rgba(239,68,68,0.15); color: var(--danger); border: 1px solid rgba(239,68,68,0.2); }

  .val-label { font-size: 0.7rem; color: var(--muted); margin-top: 6px; text-transform: uppercase; letter-spacing: 0.06em; }
  .val-text { font-size: 0.74rem; color: var(--text); line-height: 1.5; margin-top: 2px; }

  .summary-box {
    margin-top: 12px;
    padding: 12px 16px;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
  }
  .summary-box .slabel { font-size: 0.7rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; margin-bottom: 6px; }
  .summary-box .stext { font-size: 0.76rem; color: var(--text); line-height: 1.5; }

  .error-box {
    padding: 12px 16px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.25);
    border-radius: 8px;
    color: var(--danger);
    font-size: 0.75rem;
    line-height: 1.5;
  }

  /* Step indicator */
  .step-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    font-size: 0.68rem;
    color: var(--muted);
  }

  .step-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--border);
    transition: background 0.3s;
  }
  .step-dot.active { background: var(--accent); box-shadow: 0 0 6px var(--accent); }
  .step-dot.done { background: var(--accent); }
  .step-dot.active2 { background: var(--accent2); box-shadow: 0 0 6px var(--accent2); }
  .step-dot.done2 { background: var(--accent2); }
</style>
</head>
<body>

<header>
  <div class="logo"></div>
  <h1>GoF Pattern <span>Auditor</span></h1>
  <div class="badge">Prompt Chain v1</div>
</header>

<main>
  <!-- LEFT: Input -->
  <div class="input-panel">
    <div class="panel-header">
      <div class="panel-num">↑</div>
      <span class="panel-title">Source File</span>
    </div>
    <div class="filename-row">
      <input type="text" id="filename" placeholder="Filename (e.g. UserService.java)" />
    </div>
    <textarea id="codeInput" placeholder="Paste your source code here...&#10;&#10;Supports: Java, TypeScript, React, Spring Boot, etc."></textarea>
    <div class="run-row">
      <button class="btn-run" id="runBtn" onclick="runChain()">
        <div class="spinner"></div>
        <span id="btnLabel">▶ Run Full Audit</span>
      </button>
    </div>
  </div>

  <!-- TOP RIGHT: Analyser output -->
  <div class="output-panel" style="border-bottom:1px solid var(--border); max-height:50%;">
    <div class="panel-header">
      <div class="panel-num">1</div>
      <span class="panel-title">Pattern Analyser</span>
      <div class="step-indicator">
        <div class="step-dot" id="dot1"></div>
        <div class="step-dot" id="dot2" style="background:var(--border)"></div>
      </div>
    </div>
    <div class="output-body" id="analyserOutput">
      <div class="placeholder-msg">› Awaiting source code...</div>
    </div>
  </div>

  <!-- BOTTOM RIGHT: Validator output -->
  <div class="output-panel" style="max-height:50%;">
    <div class="panel-header">
      <div class="panel-num two">2</div>
      <span class="panel-title">Validator</span>
      <div class="step-indicator">
        <div class="step-dot" id="dot3"></div>
        <div class="step-dot" id="dot4" style="background:var(--border)"></div>
      </div>
    </div>
    <div class="output-body" id="validatorOutput">
      <div class="placeholder-msg">› Awaiting analyser results...</div>
    </div>
  </div>
</main>

<script>
const PROMPT1 = `You are a senior software architect performing a strict design pattern audit on a production React + Spring Boot codebase. Your task: Determine whether the provided file implements any of the following Gang of Four (GoF) design patterns. Be conservative. Only classify a pattern if its structural intent is clearly present.

══════════════════════════════════
CREATIONAL PATTERNS
══════════════════════════════════
* Singleton
* Prototype
* Builder
* Factory (Factory Method or Simple Factory)
* Abstract Factory

══════════════════════════════════
STRUCTURAL PATTERNS
══════════════════════════════════
* Facade
* Proxy
* Bridge
* Composite
* Decorator

══════════════════════════════════
BEHAVIORAL PATTERNS
══════════════════════════════════
* Strategy
* Iterator
* Observer
* Mediator
* State
* Memento
* Command

══════════════════════════════════
Classification Rules:
1. Only detect a pattern if structural characteristics are clearly implemented.
2. Naming alone (e.g., "StrategyService") does NOT qualify.
3. If conditional logic exists, determine if it is true Strategy or merely branching.
4. If object creation logic exists, determine whether it qualifies as Factory (returns polymorphic types) or Abstract Factory (creates families of related objects).
5. Singleton must enforce single instance via private constructor and static access (or Spring equivalent).
6. Decorator must wrap an object implementing the same interface.
7. Proxy must control access to another object.
8. Facade must simplify a complex subsystem behind a unified interface.
9. Mediator must centralize communication between multiple components.
10. State must change behavior based on internal state objects (not just if-else).
11. Command must encapsulate a request as an object.
12. Prototype must clone objects instead of constructing from scratch.
13. Builder must separate object construction from representation.
14. Bridge must separate abstraction from implementation via composition.
15. Composite must treat individual objects and groups uniformly.
16. Iterator must abstract traversal logic.
17. Observer must support subscription and notification mechanisms.

If uncertain, mark as "None".

Output strictly in JSON:
{
  "file_name": "",
  "primary_responsibility": "",
  "architectural_layer": "Controller | Service | Repository | Domain | Configuration | Component | Utility | Frontend Component | Hook | Context | Unknown",
  "patterns_detected": [
    {
      "pattern": "",
      "category": "Creational | Structural | Behavioral",
      "confidence": "High | Medium | Low",
      "reasoning": ""
    }
  ],
  "is_pattern_intentional": true,
  "notes": ""
}

Do not explain outside JSON.`;

const PROMPT2 = `You are validating architectural correctness. Given:
1. The source file
2. The previously detected patterns

Evaluate:
* Is the pattern correctly implemented?
* Is it accidental or intentional?
* Are there violations of separation of concerns?
* Is layering respected?
* Is this a textbook implementation or a partial one?

Be precise. No generic explanations.

Output strictly in JSON:
{
  "file_name": "",
  "validation": [
    {
      "pattern": "",
      "is_valid": true,
      "severity": "None | Minor | Moderate | Severe",
      "issues_found": "",
      "architectural_risk": ""
    }
  ],
  "layering_violations": "",
  "summary": ""
}`;

function setDot(id, state) {
  const d = document.getElementById(id);
  d.className = 'step-dot';
  if (state === 'active') d.classList.add('active');
  else if (state === 'done') d.classList.add('done');
  else if (state === 'active2') d.classList.add('active2');
  else if (state === 'done2') d.classList.add('done2');
}

function parseJSON(text) {
  try {
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch {}
    }
    return null;
  }
}

function renderAnalyser(data, el) {
  if (!data) { el.innerHTML = '<div class="error-box">Could not parse analyser JSON response.</div>'; return; }

  let html = `<div class="result-meta">
    <div class="file">📄 ${data.file_name || 'Unknown file'}</div>
    <div class="layer">Layer: ${data.architectural_layer || '—'}</div>
    <div class="resp">${data.primary_responsibility || ''}</div>
  </div>`;

  const patterns = data.patterns_detected || [];
  const real = patterns.filter(p => p.pattern && p.pattern !== 'None');

  if (real.length === 0) {
    html += `<div class="no-patterns">No GoF patterns detected in this file.</div>`;
  } else {
    real.forEach(p => {
      const confClass = (p.confidence||'').toLowerCase();
      const catClass = (p.category||'').toLowerCase();
      html += `<div class="pattern-card ${confClass}">
        <div class="card-top">
          <span class="card-name">${p.pattern}</span>
          <span class="tag ${catClass}">${p.category}</span>
          <span class="tag conf-${confClass}">${p.confidence}</span>
        </div>
        <div class="card-reasoning">${p.reasoning || ''}</div>
      </div>`;
    });
  }

  if (data.notes) {
    html += `<div class="summary-box" style="margin-top:10px">
      <div class="slabel">Notes</div>
      <div class="stext">${data.notes}</div>
    </div>`;
  }

  el.innerHTML = html;
}

function renderValidator(data, el) {
  if (!data) { el.innerHTML = '<div class="error-box">Could not parse validator JSON response.</div>'; return; }

  let html = '';
  const validations = data.validation || [];

  validations.forEach(v => {
    const sevClass = 'sev-' + (v.severity||'none').toLowerCase();
    const validClass = v.is_valid ? 'valid' : 'invalid';
    html += `<div class="val-card">
      <div class="val-top">
        <span class="card-name">${v.pattern}</span>
        <span class="valid-badge ${validClass}">${v.is_valid ? '✓ Valid' : '✗ Invalid'}</span>
        <span class="sev-badge ${sevClass}">${v.severity || 'None'}</span>
      </div>
      ${v.issues_found ? `<div class="val-label">Issues</div><div class="val-text">${v.issues_found}</div>` : ''}
      ${v.architectural_risk ? `<div class="val-label">Architectural Risk</div><div class="val-text">${v.architectural_risk}</div>` : ''}
    </div>`;
  });

  if (data.layering_violations) {
    html += `<div class="val-card">
      <div class="val-label">Layering Violations</div>
      <div class="val-text">${data.layering_violations}</div>
    </div>`;
  }

  if (data.summary) {
    html += `<div class="summary-box">
      <div class="slabel">Summary</div>
      <div class="stext">${data.summary}</div>
    </div>`;
  }

  el.innerHTML = html || '<div class="no-patterns">No validation issues found.</div>';
}

async function callClaude(messages) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages
    })
  });
  const data = await res.json();
  return data.content.map(b => b.text || '').join('');
}

async function runChain() {
  const code = document.getElementById('codeInput').value.trim();
  const filename = document.getElementById('filename').value.trim() || 'unknown_file';

  if (!code) { alert('Please paste some source code first.'); return; }

  const btn = document.getElementById('runBtn');
  const label = document.getElementById('btnLabel');
  const analyserEl = document.getElementById('analyserOutput');
  const validatorEl = document.getElementById('validatorOutput');

  btn.disabled = true;
  btn.classList.add('loading');

  // Reset outputs
  analyserEl.innerHTML = '<div class="placeholder-msg"><span style="color:var(--accent)">▶</span> Running analyser...</div>';
  validatorEl.innerHTML = '<div class="placeholder-msg">› Awaiting analyser results...</div>';
  setDot('dot1', 'active'); setDot('dot2', ''); setDot('dot3', ''); setDot('dot4', '');

  try {
    // STEP 1: Analyser
    label.textContent = 'Step 1/2: Analysing patterns...';
    const analyserMessages = [
      { role: 'user', content: `${PROMPT1}\n\nFile: ${filename}\n\n\`\`\`\n${code}\n\`\`\`` }
    ];
    const analyserRaw = await callClaude(analyserMessages);
    const analyserData = parseJSON(analyserRaw);

    setDot('dot1', 'done'); setDot('dot2', 'done');
    renderAnalyser(analyserData, analyserEl);

    // STEP 2: Validator
    label.textContent = 'Step 2/2: Validating results...';
    setDot('dot3', 'active2');
    validatorEl.innerHTML = '<div class="placeholder-msg"><span style="color:var(--accent2)">▶</span> Running validator...</div>';

    const validatorMessages = [
      {
        role: 'user',
        content: `${PROMPT2}\n\nFile: ${filename}\n\nSource code:\n\`\`\`\n${code}\n\`\`\`\n\nPreviously detected patterns (from Prompt 1):\n${analyserRaw}`
      }
    ];
    const validatorRaw = await callClaude(validatorMessages);
    const validatorData = parseJSON(validatorRaw);

    setDot('dot3', 'done2'); setDot('dot4', 'done2');
    renderValidator(validatorData, validatorEl);

  } catch (err) {
    analyserEl.innerHTML = `<div class="error-box">Error: ${err.message}</div>`;
    validatorEl.innerHTML = `<div class="error-box">Chain aborted due to analyser error.</div>`;
  } finally {
    btn.disabled = false;
    btn.classList.remove('loading');
    label.textContent = '▶ Run Full Audit';
  }
}
</script>
</body>
</html>
