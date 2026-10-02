# 0004. Open syllabus, proprietary lessons

- Status: Proposed
- Date: 2026-10-02

## Context

The repository is public, which gives visible evidence of contribution to the field and attracts contributors. But under the freemium model ([ADR 0003](0003-freemium-business-model.md)), publishing the full lessons would give away what Pro sells.

## Decision

- **Public, in this repository:** platform code under **AGPL-3.0**, plus syllabi, outcomes and standards mappings under **CC BY-SA 4.0**.
- **Private, in a separate content repository:** full lesson content, exercise test suites and exam banks, all rights reserved.
- **Brand:** the PractiCode names and logos are all rights reserved. Forks must rebrand.

## Consequences

- Educators can reuse and adapt our syllabi, and our standards mappings can be publicly audited. That is strong evidence for funders and visa assessors.
- AGPL means anyone running a modified copy of the platform as a service must publish their changes. That deters closed clones while keeping the code genuinely open source.
- Some investors are wary of AGPL. If that becomes a blocker, we can relicense before external contributions grow, while we are still the sole copyright holder.
- **Before the first public push:** the founder confirms this licensing choice. Licences cannot be withdrawn from code that has already been published.
