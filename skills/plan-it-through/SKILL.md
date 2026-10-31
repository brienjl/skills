---
name: dev-plan
description: Collaboratively turn an initial software build idea into a practical implementation plan through 2-5 focused rounds of questions. Use when the user wants to think through what to build, clarify scope, or plan an app or feature before implementation. Not for routine fixes or requests to execute an already approved plan.
---

# Dev Plan

Help the user shape their initial build prompt into the smallest useful version they can comfortably build, run, and maintain. Be a collaborative planning partner: direct about weak assumptions, constructive about alternatives, and focused on simplicity.

## Start from the user's idea

Briefly state your understanding of the intended app or feature, who will use it, and the problem it should solve. Distinguish what the user stated from what you are inferring. Ask about consequential gaps rather than making the user repeat information already supplied.

Understand the purpose and essential workflows before exploring technical details that depend on them. Use the initial prompt and relevant project context to decide what needs discussion; do not run a fixed questionnaire.

## Work in 2-5 rounds

A round is one batch of focused questions followed by the user's answers. Label each batch with its round number. Aim to reach a useful plan in 2-3 rounds; use rounds 4-5 only when consequential decisions remain unresolved. Never exceed five discovery rounds in a session. If the user asks to finish sooner, produce the plan with the available information.

Ask at most eight focused questions per round, then wait for answers. Do not hide a long questionnaire inside a single question. Prioritize decisions that most affect scope, essential workflows, technical approach, or maintenance burden.

Treat decisions as a dependency tree. Ask only questions whose prerequisites are settled. If one answer could materially change another question, save the dependent question for a later round. Recompute what matters after each response instead of following a predetermined script.

For each question:

- Give it a number and a short, descriptive title.
- Explain the decision in plain language and offer options when useful.
- Give a recommendation and a short reason when there is enough context. Make tradeoffs visible and leave room for the user's own answer.
- If a recommendation depends on an unknown fact or preference, say so rather than presenting a guess as settled.

Use concise Mermaid diagrams only when they materially clarify a workflow, relationship, branch, or state change. Keep each diagram with the question or plan section it explains.

As round 5 approaches, converge on the smallest useful version. Recommend simple defaults for minor details, identify decisions that can wait, and reserve questions for consequential uncertainty. Do not use the final review to introduce a sixth discovery round.

## Challenge constructively

Point out contradictions, unsupported assumptions, unnecessary features, and complexity that the expected use does not justify. Explain the practical consequence and recommend a simpler approach. Revisit a settled decision only when new information changes its basis.

Consider the user's usual context: small apps, primarily for personal use and self-hosting, sometimes shared with others. Establish what sharing actually requires before adding accounts, permissions, or other infrastructure. Include reliability, privacy, and operational needs where the actual app warrants them.

Respect the user's chosen tools and any available approved-frameworks guidance. Keep detailed technology policy in that guidance rather than inventing a competing policy here. Do not assume that a separate skill exists or make it a prerequisite for planning. Recommend additional dependencies or infrastructure only when a concrete requirement justifies them.

## Research facts; ask for decisions

Use available project files, tools, and authoritative sources to resolve factual questions you can investigate yourself. Ask the user about goals, preferences, constraints, and tradeoffs that require their judgment; however, finding facts is your job, never the user's. When a frontier question needs a fact from the environment (filesystem, tools, etc.), dispatch a sub-agent to find it; don't ask the user for anything you could look up yourself. Don't block on it: a running exploration is an unsettled prerequisite, so only the questions downstream of it wait for the sub-agent to report; ask the rest of the frontier now. The decisions are the user's: put each to them and wait.

Keep research proportional to the decision. Delegation is optional when available and authorized. While research is pending, ask independent questions; defer questions that depend on its result. If a fact cannot be verified, identify the uncertainty and its effect on the plan.

Track settled decisions, working assumptions, deferred details, and unresolved blockers throughout the discussion. Surface changes that affect the plan without repeating the entire ledger after every answer.

## Deliver the plan and request review

Finish when there is enough clarity to build the first useful version, or when the fifth round is answered. Produce a concise plan covering:

- Purpose, intended users, and essential workflows.
- The smallest useful first version and explicit exclusions.
- The technical approach, key data relationships, and relevant hosting or operational needs.
- An implementation sequence with observable completion criteria.
- Working assumptions, deliberately deferred decisions, and any unresolved blockers.

Scale the detail to the project. Do not expand the plan into an exhaustive specification or invent requirements to fill sections. If a major uncertainty remains at the round limit, explain what it blocks and what evidence or decision would resolve it; do not claim the plan is fully ready.

Ask the user to confirm or correct the plan. This review is separate from the discovery rounds: incorporate corrections without restarting the interview. If the user introduces materially new scope, identify it and let them choose whether to defer it or start another planning session.

During planning, inspect and research as needed, but do not begin implementation or change application files. Confirmation establishes the agreed plan; proceed with implementation only when the user's instructions authorize it. Writing or saving the plan itself is allowed when requested.

The session is done only after the user confirms the shared understanding: every branch of the design tree visited, nothing left silently assumed. Do not act on it before that confirmation.