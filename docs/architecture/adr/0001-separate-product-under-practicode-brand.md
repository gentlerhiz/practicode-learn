# 0001. Build PractiCode Learn as a separate product under the PractiCode brand

- Status: Accepted
- Date: 2026-10-02

## Context

PractiCode Academy runs 3-month cohorts in Ibadan and online. We want a global learning platform. There were three options:

- **A.** Make it the Academy's learning app (`app.practicode.tech`). It would read as internal software for a local bootcamp, and it would be tied to one city. That subdomain is also already planned for the internal CRM.
- **B.** Launch it under a brand-new name. It would be cleanly separate but would throw away the Academy's track record, and we would have two brands to grow.
- **C.** Make it a separate product under the PractiCode name, with its own codebase, landing page and metrics.

The platform also needs to work as evidence of the founder's contribution for funders and global-talent visa assessors. That calls for a distinct product with a clear story: it grew out of a proven academy and scales beyond it.

## Decision

Option C. **PractiCode Learn** at `learn.practicode.tech`, in its own repository, with its own metrics. PractiCode Academy becomes its first delivery partner and runs the paid Mentor plan.

## Consequences

- We reuse the logo, colours and type, so the brand cost is low.
- The product story is continuity → scale → novelty.
- All brand identity lives in `brand/brand.config.json`, so a rename is a one-file change.
- **Required:** before launching outside Nigeria, search for "PractiCode" in the WIPO Global Brand Database, UKIPO and USPTO, and reserve a fallback name, domain and social handles.
- **Required:** code and curriculum must be owned by the founder or company. Anyone contributing to proprietary content signs a written rights assignment.
