# Lightweight tickets and continuity

## Use the existing home

Use the tracker/project established by the user or the effort. Otherwise follow the workspace's local planning convention. With no convention, use `.planning/<effort>/map.md` and `.planning/<effort>/issues/001-<slug>.md`. Create files only as needed.

Use descriptive linked titles in summaries. Keep stable ticket IDs, but no mandatory type labels, ownership fields, or separate databases. Native tracker statuses and dependencies are enough when available.

## A ticket starts small

```markdown
# [Question to answer or small outcome to deliver]
Status: open

Why: [Customer value or uncertainty this serves.]
Done when: [Observable answer, evidence, or usable outcome.]

[Only the context needed to take the next action.]
```

For a test, add:

```markdown
We believe: [Specific claim.]
We'll check by: [Method, relevant customers or conditions, and observation.]
We'll decide: [What supports or challenges the claim; next action either way.]
Limit: [Time/spend cap.]
```

Add a baseline, sample/recruitment details, measurement, or guardrail when the test needs it. A later reader must be able to tell what happened and why it changes the plan; a full experiment dossier is unnecessary.

When work actually finishes, append a short **Result and next decision** with evidence source/date, meaningful limitations, and the decision or recommendation. Until a planned test actually runs, keep it open or waiting. Human input cannot be fabricated to finish a ticket.

## Choose and update work

Pick the available ticket that most usefully reduces risk or delivers the next justified benefit. A ticket should fit a coherent session; split independent questions when needed. There is no target backlog size: a few next actions and coarse future notes are usually enough.

Record a dependency only where it changes what can start. Distinguish **work finished** from **evidence supports proceeding**: a failed pilot can close its own ticket while preventing automation. State that condition in the downstream ticket. After a pivot, mark affected tickets superseded or cancelled with a short reason and replacement link; preserve the evidence.

Use open, waiting, and closed, with superseded/cancelled where needed. Add an owner/claim when concurrent sessions need coordination; local file edits are best-effort, not atomic locking. Reconcile visible conflicts and release or hand off unfinished claims. Avoid maintaining claim machinery for a single-session workflow.

At a stopping point, update the map's next action and waiting items. Keep result detail in its ticket and only a decision gist/link on the map. If no ticket remains but the ambition is unmet, revisit the unknowns rather than declaring success.
