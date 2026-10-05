# Impact metrics

Funders, visa assessors and partners will ask the same question: *what difference does this make, for how many people, at what cost?* We instrument for that from day one.

## North-star metric

**Weekly mastered modules:** the number of modules in which a learner passes the mastery check in a given week.

It rewards actual learning rather than sign-ups or time spent, and it rises only when lessons work.

## Learning metrics

| Metric | Definition | Why it matters |
|---|---|---|
| Activation rate | % of sign-ups who finish their first lesson within 24 hours | First-session experience |
| Module 1 completion | % of learners who start Module 1 and pass its mastery check | Core learning funnel |
| Track completion | % of learners who start a track and earn its certificate, within 12 months | Long-run outcome |
| Learning gain | Mean improvement from the pre-module diagnostic to the mastery check | Evidence that lessons teach |
| Review adherence | % of due review cards completed within 48 hours | Retention habit |
| Week-4 retention | % of learners active in week 4 after sign-up | Habit formation |

## Reach and inclusion metrics

| Metric | Definition |
|---|---|
| Active learners | Learners who completed at least one lesson in the last 28 days |
| Countries | Count of countries with 10 or more active learners |
| Gender split | Self-reported, optional, and reported only in aggregate |
| Scholarship share | % of Pro learners on need-based scholarships |
| Low-bandwidth share | % of sessions on connections slower than 1.5 Mbps (from the Network Information API, where available) |
| Offline share | % of lessons completed offline |

## Efficiency metrics

| Metric | Definition |
|---|---|
| Data per lesson | Median bytes transferred per lesson, against a budget of 150 KB |
| Cost per active learner | Monthly infrastructure plus content cost ÷ active learners |
| Cost per certificate | Monthly total cost ÷ certificates issued |

## Business metrics

Visitor → sign-up conversion · trial → paid conversion · monthly recurring revenue by region · churn · customer acquisition cost by channel.

## How we measure

- Learning events are recorded as **xAPI statements** (IEEE 9274.1.1-2023), for example "learner *completed* lesson", stored in our database and exportable to any learning record store.
- Product analytics are cookieless and aggregate (Vercel Web Analytics and Speed Insights): they store nothing on the device and identify no one, so they run without a consent banner. Anything that used cookies or identified people would need consent first (see [Privacy](../compliance/privacy-and-data-protection.md)).
- We report **only measured numbers**. Estimates are labelled as estimates. Testimonials are published only with written consent and attribution.

## Definitions in code

These are the figures on the admin impact page (`/admin/impact`) and in its CSV export, exactly as `impact_summary()` and `impact_countries()` compute them in [`supabase/migrations/20261004120200_impact_functions.sql`](../../supabase/migrations/20261004120200_impact_functions.sql). Progress reaches the database only through `record_progress()`, which validates every event, so learners can't inflate these numbers.

| Figure | Exactly what is counted |
|---|---|
| Registered learners | Rows in `profiles`. A profile is created only once the email address is confirmed (or the learner signs in with Google), so people who ask for a code and never confirm aren't counted ([`20261005130000_profiles_on_confirmation.sql`](../../supabase/migrations/20261005130000_profiles_on_confirmation.sql)). |
| Learners who started a lesson | Learners with at least one row in `lesson_progress`. |
| Lessons completed | Rows in `lesson_progress` with status `completed`: once per learner per lesson. |
| Active learners (28 days) | Learners with a `lesson_completed` event in the last 28 days. |
| Hours of active learning | Sum of `active_seconds` ÷ 3600. Time counts only while the lesson page is visible; a gap between interactions counts at most 2 minutes; one event adds at most three times the lesson's length, and a lesson's total is capped at ten times its length. |
| Countries reached | Distinct `country_code` values. The country is read once, on the server, from Vercel's `x-vercel-ip-country` header at first sign-in; it never comes from the browser. This is broader than the "Countries" reach metric above (10 or more active learners), which the countries table supports. |
| Activation within 24 hours | % of learners whose account is more than a day old who completed a lesson within 24 hours of their profile being created. |
| Week-4 retention | % of learners whose account is more than 28 days old with any learning event between day 21 and day 28. |
| Module 1 completion | % of learners who started a Front-End Module 1 lesson and completed every Module 1 lesson. Until mastery checks exist, completing every lesson stands in for "passes its mastery check". |
| Offline completions | `lesson_completed` events recorded while the device was offline and saved later. |
| Countries table | Per country: learners, and learners with a `lesson_completed` event in the last 28 days. |

A scheduled job (`vercel.json`, 06:00 UTC on the 1st of each month) saves the figures to `impact_snapshots`. Snapshots hold no personal data, so they stay accurate after learners delete their accounts.

**Not measured yet.** Learning gain, review adherence, track completion, assessments, certificates, scholarships, revenue, testimonials, partnerships and institutions arrive with the features that create them. Until then they are not reported, not even as estimates.

## Reporting

- **Monthly:** an internal dashboard.
- **Quarterly:** a funder report covering reach, learning, inclusion and cost, as a PDF and a public web page.
- **Yearly:** a public impact report.
