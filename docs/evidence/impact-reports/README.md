# Impact reports

A short report each month, from the measured figures only. The first report follows the first monthly snapshot after learners join.

## How a report is made

1. On the 1st of each month, a scheduled job saves that month's figures to `impact_snapshots`. Snapshots hold no personal data.
2. An admin downloads the CSV from `/admin/impact`.
3. The report goes here as `YYYY-MM.md`, with:
   - the headline figures: registered learners, learners who started a lesson, lessons completed, active learners, hours of active learning and countries reached
   - learning figures where there's enough data: activation within 24 hours, week-4 retention and Module 1 completion
   - what changed in the product that month, linked to the [CHANGELOG](../../../CHANGELOG.md)
   - anything not yet measured, stated as such

Every figure uses the definitions in [`impact-metrics.md`](../../product/impact-metrics.md#definitions-in-code). Figures are reported as measured, never rounded up or estimated.

## Reports

None yet.
