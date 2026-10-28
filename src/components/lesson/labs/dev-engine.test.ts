import { describe, expect, it } from 'vitest'
import { complete, graph, newDev, prompt, run, saveFile, tree, type Dev } from './dev-engine'

const play = (dev: Dev, ...lines: string[]) =>
  lines.reduce<{ dev: Dev; outs: string[]; errors: boolean[] }>(
    (acc, line) => {
      const r = run(acc.dev, line)
      return { dev: r.dev, outs: [...acc.outs, r.out], errors: [...acc.errors, r.error] }
    },
    { dev, outs: [], errors: [] },
  )

describe('the shell', () => {
  it('moves around Ada’s home folder and reads files', () => {
    const start = newDev('Home')
    expect(prompt(start)).toBe('ada@laptop:~$')
    const { dev, outs } = play(start, 'pwd', 'ls', 'cd cafe-api', 'pwd', 'ls', 'cat notes.txt', 'cd data', 'cd ../..')
    expect(outs[0]).toBe('/home/ada')
    expect(outs[1]).toBe('cafe-api  Desktop  Documents')
    expect(outs[3]).toBe('/home/ada/cafe-api')
    expect(outs[4]).toBe('app.js  data  greet.js  notes.txt  prices.js')
    expect(outs[5]).toContain('loyalty card')
    expect(prompt(dev)).toBe('ada@laptop:~$')
    expect(run(start, 'cd cafe').out).toBe('bash: cd: cafe: No such file or directory')
    expect(run(start, 'dir').out).toContain('Windows command')
  })

  it('makes, writes, appends, moves and removes files', () => {
    const { dev, outs } = play(newDev('Project'), 'mkdir routes', "echo 'GET /menu' > routes/plan.txt", "echo 'GET /orders' >> routes/plan.txt", 'cat routes/plan.txt', 'mv notes.txt routes', 'rm greet.js', 'ls')
    expect(outs[3]).toBe('GET /menu\nGET /orders')
    expect(outs[6]).toBe('app.js  data  prices.js  routes')
    expect(run(dev, 'rm routes').out).toBe("rm: cannot remove 'routes': Is a directory")
    expect(run(dev, 'ls routes').out).toBe('notes.txt  plan.txt')
  })

  it('runs programs with node, with arguments', () => {
    const dev = newDev('Project')
    expect(run(dev, 'node app.js').out).toBe('Order total: 6')
    expect(run(dev, 'node greet.js Ada').out).toBe('Hello, Ada. Welcome to Corner Café.')
    expect(run(dev, 'node greet.js').out).toBe('Hello, undefined. Welcome to Corner Café.')
    expect(run(dev, 'node --version').out).toBe('v24.11.0')
    const missing = run(dev, 'node ap.js')
    expect(missing.error).toBe(true)
    expect(missing.out).toContain("Error: Cannot find module '/home/ada/cafe-api/ap.js'")
    expect(run(dev, "echo 'console.log(2 * 3.5)' > sum.js && node sum.js").out).toBe('7')
  })

  it('finishes names with Tab and runs commands joined with &&', () => {
    const dev = newDev('Project')
    expect(complete(dev, 'cat pr')).toBe('cat prices.js')
    expect(complete(dev, 'cd da')).toBe('cd data/')
    expect(complete(dev, 'cat ')).toBeNull()
    const r = run(dev, 'cd nowhere && pwd')
    expect(r.error).toBe(true)
    expect(r.out).not.toContain('/home/ada')
  })
})

describe('git: init, add and commit', () => {
  it('starts a repository and walks a file from untracked to committed', () => {
    const { dev, outs, errors } = play(newDev('Project'), 'git status', 'git init', 'git status', 'git add app.js prices.js', 'git status', "git commit -m 'Add the order total'", 'git status')
    expect(errors[0]).toBe(true)
    expect(outs[0]).toBe('fatal: not a git repository (or any of the parent directories): .git')
    expect(outs[1]).toBe('Initialized empty Git repository in /home/ada/cafe-api/.git/')
    expect(outs[2]).toContain('No commits yet')
    expect(outs[2]).toContain('Untracked files:')
    expect(outs[2]).toContain('data/')
    expect(outs[4]).toContain('new file:   app.js')
    expect(outs[4]).toContain('Untracked files:')
    expect(outs[5]).toMatch(/^\[main \(root-commit\) [0-9a-f]{7}\] Add the order total\n 2 files changed, 12 insertions\(\+\)\n create mode 100644 app.js/)
    expect(outs[6]).toContain('Untracked files:')
    expect(prompt(dev)).toBe('ada@laptop:~/cafe-api (main)$')
  })

  it('asks for a message instead of opening an editor', () => {
    const r = run(newDev('Repository'), "echo 'x' >> notes.txt && git add . && git commit")
    expect(r.error).toBe(true)
    expect(r.out).toContain('git commit -m')
  })

  it('shows changes, diffs and restores them', () => {
    const start = newDev('Repository')
    const { dev, outs } = play(start, "echo '// Prices in pounds' >> prices.js", 'git status', 'git diff', 'git add prices.js', 'git diff', 'git diff --staged', 'git restore --staged prices.js', 'git restore prices.js', 'git status')
    expect(outs[1]).toContain('modified:   prices.js')
    expect(outs[2]).toContain('+// Prices in pounds')
    expect(outs[4]).toBe('')
    expect(outs[5]).toContain('+// Prices in pounds')
    expect(outs[8]).toBe('On branch main\n\nnothing to commit, working tree clean')
    expect(dev.files['cafe-api/prices.js']).not.toContain('pounds')
  })

  it('keeps history, newest first', () => {
    const { dev, outs } = play(newDev('Repository'), "echo 'Oat milk: 0.30' >> notes.txt", "git commit -am 'Note the oat milk price'", 'git log --oneline', 'git log -1')
    const lines = outs[2]!.split('\n')
    expect(lines).toHaveLength(2)
    expect(lines[0]).toMatch(/^[0-9a-f]{7} \(HEAD -> main\) Note the oat milk price$/)
    expect(lines[1]).toMatch(/^[0-9a-f]{7} Add the price list and order total$/)
    expect(outs[3]).toMatch(/^commit [0-9a-f]{40} \(HEAD -> main\)\nAuthor: Ada Obi <ada@example.com>\nDate: {3}.+\n\n {4}Note the oat milk price$/)
    expect(graph(dev)).toHaveLength(2)
  })
})

describe('git: branches and merging', () => {
  it('branches, switches and fast-forwards', () => {
    const { dev, outs } = play(
      newDev('Repository'),
      'git switch -c add-tea',
      "echo 'Tea: 2' >> notes.txt",
      "git commit -am 'Add tea'",
      'git branch',
      'git switch main',
      'cat notes.txt',
      'git merge add-tea',
      'git branch -d add-tea',
    )
    expect(outs[0]).toBe("Switched to a new branch 'add-tea'")
    expect(outs[3]).toBe('* add-tea\n  main')
    expect(outs[5]).not.toContain('Tea')
    expect(outs[6]).toMatch(/^Updating [0-9a-f]{7}\.\.[0-9a-f]{7}\nFast-forward\n notes.txt \| {2}1 \+\n 1 file changed, 1 insertion\(\+\)$/)
    expect(dev.files['cafe-api/notes.txt']).toContain('Tea: 2')
    expect(outs[7]).toMatch(/^Deleted branch add-tea/)
  })

  it('makes a merge commit when both branches moved on', () => {
    const { dev, outs } = play(newDev('Branches'), 'git switch -c add-tea HEAD~1', 'git log --oneline')
    expect(outs[0]).toBe("Switched to a new branch 'add-tea'")
    const r = play(newDev('Repository'), 'git branch tea', "echo 'Loyalty: every 10th free' >> notes.txt", "git commit -am 'Loyalty card'", 'git switch tea', "echo 'tea' > tea.txt", 'git add tea.txt', "git commit -m 'Tea'", 'git switch main', 'git merge tea')
    expect(r.outs[8]).toContain("Merge made by the 'ort' strategy.")
    expect(graph(r.dev)[0]).toMatchObject({ message: "Merge branch 'tea'", merge: true })
    expect(dev).toBeTruthy()
  })

  it('stops on a conflict and finishes once it is fixed', () => {
    const start = newDev('Conflict')
    const merged = run(start, 'git merge new-prices')
    expect(merged.error).toBe(true)
    expect(merged.out).toBe('Auto-merging prices.js\nCONFLICT (content): Merge conflict in prices.js\nAutomatic merge failed; fix conflicts and then commit the result.')
    const file = merged.dev.files['cafe-api/prices.js']!
    expect(file).toContain("<<<<<<< HEAD\n  'Espresso': 2.6,\n=======\n  'Espresso': 2.7,\n>>>>>>> new-prices")
    expect(prompt(merged.dev)).toBe('ada@laptop:~/cafe-api (main|MERGING)$')
    expect(run(merged.dev, 'git status').out).toContain('both modified:   prices.js')
    expect(run(merged.dev, "git commit -m 'Merge'").out).toContain('Committing is not possible because you have unmerged files.')
    const fixed = saveFile(merged.dev, 'cafe-api/prices.js', file.replace(/<<<<<<< HEAD\n.*\n=======\n(.*)\n>>>>>>> new-prices\n/, '$1\n'))
    const { dev, outs } = play(fixed, 'git add prices.js', 'git status', 'git commit')
    expect(outs[1]).toContain('All conflicts fixed but you are still merging.')
    expect(outs[2]).toMatch(/^\[main [0-9a-f]{7}\] Merge branch 'new-prices'/)
    expect(prompt(dev)).toBe('ada@laptop:~/cafe-api (main)$')
    expect(dev.files['cafe-api/prices.js']).toContain("'Espresso': 2.7")
  })

  it('won’t switch away from changes that would be lost', () => {
    const dev = run(newDev('Conflict'), "echo '// draft' >> prices.js").dev
    const r = run(dev, 'git switch new-prices')
    expect(r.error).toBe(true)
    expect(r.out).toContain('Your local changes to the following files would be overwritten by checkout:')
  })
})

describe('git: .gitignore and GitHub', () => {
  it('leaves ignored files out of status and add', () => {
    const start = newDev('Ignore')
    expect(run(start, 'git status').out).toContain('        .env\n        node_modules/\n        server.log')
    const { dev, outs } = play(start, "echo 'node_modules/' > .gitignore", "echo '.env' >> .gitignore", "echo '*.log' >> .gitignore", 'git status', 'git add .env', 'git add .', "git commit -m 'Ignore secrets, packages and logs'")
    expect(outs[3]).toContain('.gitignore')
    expect(outs[3]).not.toContain('.env\n')
    expect(outs[3]).not.toContain('node_modules')
    expect(outs[4]).toContain('The following paths are ignored by one of your .gitignore files:')
    expect(outs[6]).toContain(' 1 file changed, 3 insertions(+)')
    expect(tree(dev).find((r) => r.name === '.env')?.mark).toBe('ignored')
    expect(tree(dev).find((r) => r.name === 'node_modules')?.mark).toBe('ignored')
  })

  it('pushes to a practice GitHub, and needs an upstream for a new branch', () => {
    const { dev, outs, errors } = play(
      newDev('GitHub'),
      'git push',
      'git remote add origin https://github.com/ada/cafe-api.git',
      'git push -u origin main',
      'git status',
      'git switch -c add-hours',
      "echo 'Open 8 to 4' > hours.txt && git add hours.txt && git commit -m 'Add opening hours'",
      'git push',
      'git push -u origin add-hours',
    )
    expect(errors[0]).toBe(true)
    expect(outs[2]).toBe("To https://github.com/ada/cafe-api.git\n * [new branch]      main -> main\nbranch 'main' set up to track 'origin/main'.")
    expect(outs[3]).toContain("Your branch is up to date with 'origin/main'.")
    expect(outs[6]).toContain('fatal: The current branch add-hours has no upstream branch.')
    expect(outs[7]).toContain('Create a pull request for')
    expect(graph(dev)[0]!.labels).toEqual(['HEAD → add-hours', 'origin/add-hours'])
  })
})
