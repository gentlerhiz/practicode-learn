# Privacy and data protection

> This is an engineering and product overview, not legal advice. Before launch, have a qualified data-protection professional review it, and register with the relevant regulators.

## Applicable laws

| Jurisdiction | Law | Regulator | Applies when |
|---|---|---|---|
| Nigeria | **Nigeria Data Protection Act 2023** (NDPA) and the NDPC's General Application and Implementation Directive | Nigeria Data Protection Commission (NDPC) | Always, since we are established in Nigeria |
| EU | **GDPR** | National data protection authorities | We offer services to people in the EU |
| UK | **UK GDPR** and the Data Protection Act 2018 | Information Commissioner's Office (ICO) | We offer services to people in the UK |
| Kenya | **Data Protection Act 2019** | Office of the Data Protection Commissioner | Kenyan learners |
| Ghana | **Data Protection Act 2012 (Act 843)** | Data Protection Commission | Ghanaian learners |
| South Africa | **POPIA** | Information Regulator | South African learners |

## Principles we build in

1. **Data minimisation.** At sign-up we collect only name, email and country. Gender, age range and employment status are optional, used only for aggregate impact reporting, and can be withdrawn at any time.
2. **Purpose limitation.** Learning data is used to teach (progress, review scheduling) and for aggregate impact reports. It is never sold, and never used for third-party advertising.
3. **Lawful basis.** Contract for providing the service. Consent for analytics, marketing email and optional demographics. Legitimate interest for security and fraud prevention.
4. **Consent that is real.** Analytics are off until the learner opts in, and declining is as easy as accepting.
5. **Security.** Row Level Security, encryption in transit (TLS 1.2 or later) and at rest, least-privilege access, audit logs for administrative access.
6. **Retention.** Accounts inactive for 3 years are warned, then deleted. Payment records are kept as tax law requires.
7. **Learner rights.** Access, correction, export (machine-readable, including xAPI records), deletion and objection, all self-service in settings where possible, and answered within the statutory time limits.

## Children

The minimum age is **13**. Learners under 18 may need parental consent depending on their country (GDPR Article 8 lets EU member states set it between 13 and 16). Schools and teams plans for younger learners will need a separate assessment.

## Cross-border transfers

Learner data may be processed outside Nigeria, for example by the hosting and database providers. We will:

- choose providers and regions deliberately and document them in a public subprocessor list
- use the transfer mechanisms required by the NDPA's cross-border transfer provisions and GDPR Chapter V, such as adequacy decisions or standard contractual clauses
- reassess if regulators require local storage

## Before launch

- [ ] Privacy notice (plain language) and cookie notice
- [ ] Record of processing activities
- [ ] Data Protection Impact Assessment, covering learning analytics and any future AI features
- [ ] Register with the NDPC as required, and appoint a Data Protection Officer if required
- [ ] Processor agreements with every subprocessor
- [ ] Breach response plan: NDPC notification within 72 hours of becoming aware of a breach that is likely to pose risk
- [ ] Accessibility statement (see [UX principles](../design/ux-principles.md#accessibility))
