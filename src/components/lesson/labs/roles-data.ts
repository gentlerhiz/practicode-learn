// Tech roles for IT Fundamentals Module 13: what the work is like day to day. Describes the work only:
// no promises about jobs or pay. Course suggestions name only courses that are open today.

export type Role = {
  family: string
  does: string
  day: [string, string][]
  enjoy: string
  tools: string
}

export const ROLES: Record<string, Role> = {
  'IT support technician': {
    family: 'Support and networking',
    does: 'Keeps people’s computers, phones and accounts working, and helps when they don’t.',
    day: [
      ['09:00', 'Check the ticket queue, and pick up anything urgent'],
      ['10:30', 'Set up a laptop for a new starter'],
      ['12:00', 'Walk someone through a printer problem on a call'],
      ['14:00', 'Reset passwords, and fix a shared drive’s permissions'],
      ['16:00', 'Write up today’s fixes in the knowledge base'],
    ],
    enjoy: 'You like helping people, solving puzzles, and explaining things simply.',
    tools: 'Ticket systems, remote support tools, Windows and Mac settings, the command line',
  },
  'Network engineer': {
    family: 'Support and networking',
    does: 'Designs, builds and fixes the networks that join everything together.',
    day: [
      ['09:00', 'Check overnight alerts: one office’s internet went slow'],
      ['10:00', 'Trace the problem to a faulty switch, and swap it'],
      ['12:00', 'Plan Wi-Fi for a new floor of the building'],
      ['14:30', 'Update router firmware, out of working hours, with a rollback plan'],
      ['16:00', 'Review firewall rules with the security team'],
    ],
    enjoy: 'You like understanding how things connect, and finding exactly where something breaks.',
    tools: 'Routers, switches, firewalls, monitoring dashboards, ping and similar tools',
  },
  'Cloud engineer': {
    family: 'Cloud and infrastructure',
    does: 'Builds and runs systems on cloud platforms such as AWS, Azure and Google Cloud.',
    day: [
      ['09:00', 'Check last night’s costs and alerts'],
      ['10:00', 'Set up servers and storage for a new app, written as code'],
      ['12:30', 'Help developers understand why their app is slow'],
      ['14:00', 'Test that backups restore in another region'],
      ['16:00', 'Plan how to cut next month’s cloud bill'],
    ],
    enjoy: 'You like building reliable systems, and making them automatic.',
    tools: 'Cloud consoles, Linux, the command line, infrastructure as code',
  },
  'DevOps engineer': {
    family: 'Cloud and infrastructure',
    does: 'Builds the pipelines that test and release software automatically, safely and often.',
    day: [
      ['09:00', 'A release failed overnight: read the logs, and find why'],
      ['10:30', 'Fix the automated test that broke it'],
      ['12:00', 'Pair with a developer on speeding up the build'],
      ['14:00', 'Add monitoring, so problems show up before users notice'],
      ['16:00', 'Write a runbook for the on-call team'],
    ],
    enjoy: 'You like automating repeated work, and making releases boring and safe.',
    tools: 'Git, build pipelines, containers, Linux, monitoring',
  },
  'Systems administrator': {
    family: 'Cloud and infrastructure',
    does: 'Looks after an organisation’s servers, accounts, updates and backups.',
    day: [
      ['09:00', 'Check that last night’s backups worked'],
      ['10:00', 'Install this month’s security updates on the servers'],
      ['12:00', 'Create accounts for three new starters'],
      ['14:00', 'Investigate why a server’s disk is filling up'],
      ['16:00', 'Update the change log'],
    ],
    enjoy: 'You like keeping things running smoothly, and thinking ahead.',
    tools: 'Windows Server, Linux, the command line, directory and backup tools',
  },
  'Front-end developer': {
    family: 'Software',
    does: 'Builds the parts of websites and apps that people see and use.',
    day: [
      ['09:30', 'Stand-up: a short team meeting about today’s work'],
      ['10:00', 'Build a new checkout page from the designer’s file'],
      ['12:30', 'Fix a bug where the menu breaks on small phones'],
      ['14:30', 'Review a teammate’s code'],
      ['16:00', 'Test the page with a screen reader and a keyboard'],
    ],
    enjoy: 'You like making things people can see and click, and getting the details right.',
    tools: 'HTML, CSS, JavaScript, a code editor, the browser’s developer tools, Git',
  },
  'Back-end developer': {
    family: 'Software',
    does: 'Builds the servers, databases and APIs behind websites and apps.',
    day: [
      ['09:30', 'Stand-up with the team'],
      ['10:00', 'Write the code that saves an order to the database'],
      ['12:30', 'Speed up a slow database query'],
      ['14:30', 'Write tests for the new payments API'],
      ['16:00', 'Check the logs after a release'],
    ],
    enjoy: 'You like logic, data and making systems work correctly behind the scenes.',
    tools: 'JavaScript or Python, SQL databases, APIs, Git, the command line',
  },
  'Mobile developer': {
    family: 'Software',
    does: 'Builds apps for phones and tablets.',
    day: [
      ['09:30', 'Stand-up with the team'],
      ['10:00', 'Build a new screen for the app'],
      ['12:30', 'Fix a crash that only happens on older phones'],
      ['14:30', 'Test on several real devices'],
      ['16:00', 'Prepare an update for the app stores'],
    ],
    enjoy: 'You like apps people carry everywhere, and making them smooth on small screens.',
    tools: 'Swift or Kotlin, or JavaScript with React Native, phone simulators, Git',
  },
  'Data analyst': {
    family: 'Data and AI',
    does: 'Turns data into answers that help people decide.',
    day: [
      ['09:00', 'A manager asks: why did sales drop last month?'],
      ['10:00', 'Write SQL to pull the sales data'],
      ['12:00', 'Clean it: duplicates, gaps and odd values'],
      ['14:00', 'Build charts that show what happened'],
      ['16:00', 'Present the findings, in plain words'],
    ],
    enjoy: 'You like questions, patterns, and explaining what numbers mean.',
    tools: 'Spreadsheets, SQL, Python, charting and dashboard tools',
  },
  'Data scientist': {
    family: 'Data and AI',
    does: 'Uses statistics and machine learning to predict and explain.',
    day: [
      ['09:30', 'Explore data on which customers stop subscribing'],
      ['11:00', 'Train a model to predict who might leave'],
      ['13:30', 'Test it fairly, on data it hasn’t seen'],
      ['15:00', 'Check it isn’t biased against any group'],
      ['16:30', 'Explain the results, and their limits'],
    ],
    enjoy: 'You like maths, experiments, and careful thinking about evidence.',
    tools: 'Python, notebooks, statistics, machine learning libraries, SQL',
  },
  'Machine learning engineer': {
    family: 'Data and AI',
    does: 'Builds AI models into real products, and keeps them working.',
    day: [
      ['09:30', 'Check how the live recommendation model is doing'],
      ['10:30', 'Retrain it on this month’s data'],
      ['13:00', 'Make it answer faster, for the app'],
      ['15:00', 'Set up alerts if its accuracy drops'],
      ['16:30', 'Review a teammate’s model code'],
    ],
    enjoy: 'You like both software and AI, and making clever things reliable.',
    tools: 'Python, machine learning frameworks, cloud platforms, Git',
  },
  'Security analyst': {
    family: 'Security',
    does: 'Watches for attacks, investigates alerts, and responds to incidents.',
    day: [
      ['09:00', 'Review overnight security alerts'],
      ['10:00', 'Investigate a phishing email that reached ten people'],
      ['12:00', 'Block the sender, and check nobody entered a password'],
      ['14:00', 'Check which systems still need a critical update'],
      ['16:00', 'Write up the incident, and lessons learned'],
    ],
    enjoy: 'You like investigating, staying calm, and protecting people.',
    tools: 'Security dashboards, logs, email filters, ticket systems',
  },
  'Penetration tester': {
    family: 'Security',
    does: 'Is paid, with written permission, to try to break into systems, so their owners can fix the weaknesses first.',
    day: [
      ['09:30', 'Agree what’s in scope with the client, in writing'],
      ['10:30', 'Look for weaknesses in a test copy of their website'],
      ['13:00', 'Try a weak password policy against their test accounts'],
      ['15:00', 'Confirm each finding, carefully'],
      ['16:30', 'Write the report: each weakness, its risk and the fix'],
    ],
    enjoy: 'You like puzzles, thinking like an attacker, and working strictly within the rules.',
    tools: 'Linux, testing tools, Python, very careful notes',
  },
  'UX designer': {
    family: 'Design and product',
    does: 'Finds out what people need, and designs products that are easy to use.',
    day: [
      ['09:30', 'Watch three people try to book an appointment in the app'],
      ['11:00', 'Note where they got stuck'],
      ['13:00', 'Sketch a simpler booking flow'],
      ['14:30', 'Build a clickable prototype'],
      ['16:00', 'Walk the team through it, and the evidence for it'],
    ],
    enjoy: 'You like understanding people, and making hard things feel simple.',
    tools: 'Design tools, prototypes, interviews, usability tests',
  },
  'Product manager': {
    family: 'Design and product',
    does: 'Decides what a team builds next, and why, with users, designers and developers.',
    day: [
      ['09:30', 'Read last week’s customer feedback'],
      ['10:30', 'Decide with the team what to build next'],
      ['12:00', 'Write a clear description of the next feature'],
      ['14:00', 'Check usage numbers for last month’s release'],
      ['16:00', 'Update the plan, and explain it to everyone'],
    ],
    enjoy: 'You like organising, deciding with evidence, and bringing people together.',
    tools: 'Roadmaps, data dashboards, user research, lots of conversations',
  },
}

export const FAMILIES: { name: string; roles: string[]; course?: string }[] = [
  { name: 'Support and networking', roles: ['IT support technician', 'Network engineer'] },
  { name: 'Cloud and infrastructure', roles: ['Cloud engineer', 'DevOps engineer', 'Systems administrator'] },
  { name: 'Software', roles: ['Front-end developer', 'Back-end developer', 'Mobile developer'], course: 'Front-End Web Development, or Back-End Web Development' },
  { name: 'Data and AI', roles: ['Data analyst', 'Data scientist', 'Machine learning engineer'], course: 'SQL and Databases, or Python Programming' },
  { name: 'Security', roles: ['Security analyst', 'Penetration tester'], course: 'Introduction to Cybersecurity' },
  { name: 'Design and product', roles: ['UX designer', 'Product manager'] },
]
