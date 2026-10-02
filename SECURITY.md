# Security policy

PractiCode Learn will handle learner accounts, progress records and payments. We take that responsibility seriously.

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Email **practicodeacademy@gmail.com** with the subject line `Security report`, and include:

- a description of the issue and its potential impact
- steps to reproduce it, or a proof of concept
- the affected URL, component or commit
- your name or handle, if you would like credit

What to expect from us:

| Step | Target |
|---|---|
| We acknowledge your report | Within 3 working days |
| We give you an initial assessment | Within 10 working days |
| We fix confirmed critical issues | As quickly as possible, typically within 30 days |

We will keep you informed, and with your permission we will credit you when we publish the fix.

## Scope

In scope, once they exist: `learn.practicode.tech`, its APIs and the code in this repository.<br>
Out of scope: denial-of-service testing, social engineering of staff or learners, and physical attacks.

## Safe harbour

We will not take legal action against good-faith research that follows this policy, avoids privacy violations and service disruption, and gives us reasonable time to fix the issue before disclosure.

## Our security baseline

The planned application targets [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) Level 2. Learner code runs only inside sandboxed browser contexts (see [Architecture](docs/architecture/overview.md#code-execution)). Data protection obligations are described in [Privacy and data protection](docs/compliance/privacy-and-data-protection.md).

> A dedicated `security@practicode.tech` address will replace the email above before launch.
