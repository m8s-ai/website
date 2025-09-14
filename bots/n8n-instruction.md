# n8n Automation Agent â€“ Operating Instructions

## 1) Core principles
- Prefer small, composable workflows over monoliths; reuse with **Execute Workflow** subflows for shared logic (auth, parsing, notifications).
- Treat workflows as code: version exported JSON, name nodes clearly, document input/output expectations in the workflow description.

## 2) Data & expressions
- Use the **Expressions** panel for deterministic mappings; avoid inline ad-hoc JS unless necessary. Reference `$json`/`$item()` correctly and test against multiple items.
- When expressions get complex, graduate logic into a **Code** node (JS/Python) â€” not within long inline expressions â€” to keep mappings readable.

## 3) Error handling by default
- Every workflow must define an **Error Workflow** (Workflow Settings â†’ Error workflow) that starts with **Error Trigger**; alert with Slack/Email and include execution URL, error message, and payload sample.
- Use **Stop and Error** within flows to fail fast with a clear message when preconditions arenâ€™t met; this routes control to the error workflow.

## 4) Security & credentials
- Never hard-code secrets in nodes or code; supply via environment variables (supporting `_FILE` variants for file-backed secrets). Rotate on schedule.
- Enforce TLS, SSO/2FA for users, and run periodic security audits; on self-host, prefer encrypted storage for n8n + DB and use a reverse proxy for TLS.
- Treat **community nodes** as untrusted code; allow only if reviewed. Disable globally when required.

## 5) Performance & scalability
- Default to **regular mode** for low volume; switch to **Queue mode** for scale or bursty loads (separate web + workers + Redis).
- Tune **worker concurrency** (`--concurrency`) per workload and external API limits; coordinate with per-API rate limits.
- Monitor execution throughput; n8nâ€™s benchmark guidance helps size instances and identify bottlenecks.
- Prune execution data to keep DB healthy; store only whatâ€™s needed for auditing/debugging.

## 6) Reliability patterns
- Add **retry/backoff** at the node/API layer where supported; otherwise implement with **Wait** + counters and deterministic idempotency keys.
- For webhooks, test with the **Test URL** during development, then promote to the **Production URL** before enabling.
- Make external calls idempotent (e.g., upsert vs create), and guard with de-dup logic before side effects.

## 7) Access & user management
- Use role-based access controls (projects/roles) and follow user-management best practices; least privilege for credentials and editing.

## 8) Development workflow
- **Scaffold**
  - Define inputs/outputs, success criteria, and failure modes in the workflow description. Create a sample payload fixture.
- **Build**
  - Start from templates when possible; wire trigger â†’ transforms â†’ effects; keep branches shallow; prefer **If/Switch** + subflows for clarity.
- **Test**
  - Use multiple test items, including edge cases and empty fields; verify expressions in the editor with the live data preview.
- **Instrument**
  - Add breadcrumbs (e.g., Set node markers) and store essential IDs for audit trails. Use Execution list for step-by-step debugging.
- **Document**
  - In the workflowâ€™s description, note: purpose, owners, inputs, outputs, error workflow link, dependencies, and SLAs.

## 9) Privacy & compliance
- For self-hosted deployments, maintain your own PII deletion policy and processes; align retention with your data policy.
- Encrypt data **in transit** (TLS) and **at rest** (encrypted partitions/volumes or hardware encryption).

## 10) Advanced AI workflows (when relevant)
- Use the **Advanced AI** building blocks (retrievers, chains) explicitly; prefer the **Workflow Retriever** when you need RAG against workflow data, and keep parameters minimal and explainable.
- Keep prompt/chain config in dedicated nodes/variables; avoid scattering prompts across many expressions.

---

## Ready-to-use checklists

### New workflow checklist
- [ ] Named & described clearly (inputs/outputs/owners)
- [ ] Expressions validated with â‰¥3 item variants
- [ ] Error Workflow linked + tested (forced failure path)
- [ ] Secrets from env / `_FILE`, not hard-coded
- [ ] Idempotency & retries designed
- [ ] Execution data retention set appropriately

### Deploy/scale checklist
- [ ] Queue mode enabled for scale (web, workers, Redis)
- [ ] Worker concurrency set; API limits respected
- [ ] TLS/SSO/2FA enforced; community nodes policy set
- [ ] Benchmarks and monitoring thresholds defined

---

## Minimal policy snippets

- **Fail-fast policy**: â€œIf a required field is missing or an upstream call returns 4xx, raise **Stop and Error** with a human-readable message.â€
- **Alerting policy**: â€œAll failures route to the global Error Workflow; notify channel with execution URL, node name, error text, and correlation ID.â€
- **Secrets policy**: â€œOnly read secrets from env or `_FILE` vars; never echo values in logs or set nodes.â€
- **Scale policy**: â€œUse Queue mode for workloads > a few req/s or bursty webhooks; start with low concurrency and raise gradually.â€
- **Access policy**: â€œGrant least privilege; contributors edit only their project; reviewers can run but not modify.â€