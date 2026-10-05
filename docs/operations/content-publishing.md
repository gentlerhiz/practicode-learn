# Content publishing

How a lesson goes from a draft to learners. Lessons live in the private `practicode-learn-content` repository; the tools that build, check and publish them live in this repository (`tools/content-build/`), so the checks and the app always share one lesson format and one runtime.

## The flow

1. **Write** the lesson in MDX, following the [lesson format](../curriculum/lesson-format.md): one file per lesson at `tracks/<track>/<NN-module>/<NN-lesson>.mdx`.
2. **Check** it in the content repository: `npm run check`. This builds every lesson (frontmatter, outcomes, hints, feedback, the two-thirds-interactive rule, the pack budget and the app's own schema), then runs every code step in a real browser at phone and laptop widths.
3. **Review** it in the preview (`npm run preview` writes `dist/preview/lesson-review.html`). An Academy instructor plays it with Reviewer Mode on and leaves notes on any step.
4. **Approve** it in a pull request. A second reviewer approves before merging.
5. **Publish** happens on merge to `main`. The GitHub Action builds and checks again, then `tools/content-build/publish.ts`:
   - uploads only the lessons whose content or version changed, to `lessons-free/<id>/v<version>.json` (or `lessons-pro`)
   - updates the catalogue rows
   - asks the app to refresh those lesson pages, their track pages and the sitemap (`POST /api/revalidate`)

Lessons are described publicly as "designed and reviewed by PractiCode instructors, drafted with AI assistance".

## Versions

Change a lesson's `version` in its frontmatter when the change matters to learners, such as new steps or different answers. Each version is a new, immutable file in storage; older versions stay. Fixing a typo can keep the version: the content hash changes, so the pack is uploaded again under the same path.

## Rolling back a lesson

There's no rollback command yet. Every published version stays in storage, so a rollback is a small change:

- **Preferred:** revert the commit in the content repository and merge. The Action republishes the earlier content as a new version.
- **Urgent:** in the Supabase SQL editor, set the lesson's `version` and `pack_path` back to the previous version. Then refresh its page by publishing again, or wait for the next deploy.

## Trying it before production

Point the content repository's Actions secrets at the **dev** project first, check the lessons on a preview deployment, then switch the secrets to production. Locally, `node tools/content-build/publish.ts --packs <dir> --catalogue <file> --dry-run` shows what would change without writing anything. Without `--dry-run`, it publishes to whichever project `.env.local` points at, which is always dev.
