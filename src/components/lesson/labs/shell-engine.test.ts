import { describe, expect, it } from 'vitest'
import { complete, newShell, prompt, run, walk, type Shell } from './shell-engine'

const play = (shell: Shell, ...lines: string[]) =>
  lines.reduce<{ shell: Shell; outs: string[]; errors: boolean[] }>(
    (acc, line) => {
      const r = run(acc.shell, line)
      return { shell: r.shell, outs: [...acc.outs, r.out], errors: [...acc.errors, r.error] }
    },
    { shell, outs: [], errors: [] },
  )
const names = (s: Shell) => walk(s).map((e) => e.path.split('/').slice(2).join('/'))

describe('Linux and Mac (bash)', () => {
  const start = newShell('posix')

  it('shows where you are and what is there', () => {
    expect(prompt(start)).toBe('ada@laptop:~$')
    expect(run(start, 'pwd').out).toBe('/home/ada')
    expect(run(start, 'ls').out).toBe('Desktop  Documents  Downloads  Music  Pictures')
    expect(run(start, 'ls Documents').out).toBe('budget.xlsx  School')
  })

  it('moves around with cd, .., ~ and full paths, and cares about capitals', () => {
    const { shell, outs } = play(start, 'cd Documents/School', 'pwd', 'cd ..', 'pwd', 'cd ~', 'pwd', 'cd /home', 'pwd')
    expect(outs.filter(Boolean)).toEqual(['/home/ada/Documents/School', '/home/ada/Documents', '/home/ada', '/home'])
    expect(prompt(shell)).toBe('ada@laptop:/home$')
    expect(run(start, 'cd documents')).toMatchObject({ error: true, out: 'bash: cd: documents: No such file or directory' })
    expect(run(start, 'cd Desktop/notes.txt').out).toBe('bash: cd: Desktop/notes.txt: Not a directory')
  })

  it('makes, copies, moves, renames and removes, marking what changed', () => {
    const made = run(start, 'mkdir Projects && touch Projects/plan.txt')
    expect(made.shell.added).toEqual(['home/ada/Projects', 'home/ada/Projects/plan.txt'])
    const { shell } = play(made.shell, 'cp Desktop/notes.txt Documents', 'mv Downloads/beach.jpg Pictures', 'mv Pictures/cat.jpg Pictures/kitten.jpg', 'rm Downloads/setup.exe')
    const all = names(shell)
    expect(all).toContain('Documents/notes.txt')
    expect(all).toContain('Desktop/notes.txt')
    expect(all).toContain('Pictures/beach.jpg')
    expect(all).not.toContain('Downloads/beach.jpg')
    expect(all).toContain('Pictures/kitten.jpg')
    expect(all).not.toContain('Downloads/setup.exe')
    expect(shell.removed).toEqual(['home/ada/Downloads/setup.exe'])
  })

  it('needs -r for folders, and has no undo', () => {
    expect(run(start, 'rm Music').out).toBe("rm: cannot remove 'Music': Is a directory")
    expect(run(start, 'cp Documents Backup').out).toBe("cp: -r not specified; omitting directory 'Documents'")
    expect(names(run(start, 'cp -r Documents Backup').shell)).toContain('Backup/School/essay.docx')
    expect(names(run(start, 'rm -r Documents').shell).some((p) => p.startsWith('Documents'))).toBe(false)
    expect(run(start, 'mkdir Music').out).toBe("mkdir: cannot create directory 'Music': File exists")
  })

  it('expands * to matching names', () => {
    const r = run(start, 'cd Downloads && rm *.jpg && ls')
    expect(r.out).toBe('photos.zip  setup.exe')
  })

  it('answers unknown commands as bash does', () => {
    expect(run(start, 'dir')).toMatchObject({ error: true, out: 'dir: command not found' })
  })
})

describe('Windows (Command Prompt)', () => {
  const start = newShell('windows')

  it('shows where you are with cd, and what is there with dir', () => {
    expect(prompt(start)).toBe('C:\\Users\\Ada>')
    expect(run(start, 'cd').out).toBe('C:\\Users\\Ada')
    const out = run(start, 'dir').out
    expect(out).toContain(' Directory of C:\\Users\\Ada')
    expect(out).toMatch(/<DIR>\s+Documents/)
    expect(out).toContain('5 Dir(s)')
  })

  it('ignores capitals, and uses backslashes', () => {
    const r = run(start, 'cd documents\\school')
    expect(prompt(r.shell)).toBe('C:\\Users\\Ada\\Documents\\School>')
    expect(prompt(run(r.shell, 'cd ..').shell)).toBe('C:\\Users\\Ada\\Documents>')
    expect(run(start, 'cd Nowhere').out).toBe('The system cannot find the path specified.')
  })

  it('makes, copies, moves, renames and deletes', () => {
    const { shell, outs } = play(start, 'mkdir Projects', 'type nul > Projects\\plan.txt', 'copy Desktop\\notes.txt Documents', 'move Downloads\\beach.jpg Pictures', 'ren Pictures\\cat.jpg kitten.jpg', 'del Downloads\\setup.exe')
    expect(outs[2]).toContain('1 file(s) copied.')
    const all = names(shell)
    expect(all).toEqual(expect.arrayContaining(['Projects/plan.txt', 'Documents/notes.txt', 'Pictures/beach.jpg', 'Pictures/kitten.jpg']))
    expect(all).not.toContain('Downloads/setup.exe')
  })

  it('refuses to remove a folder with things in it, unless asked with /s', () => {
    expect(run(start, 'rmdir Documents').out).toBe('The directory is not empty.')
    expect(names(run(start, 'rmdir /s Documents').shell).some((p) => p.startsWith('Documents'))).toBe(false)
  })

  it('answers unknown commands as cmd does', () => {
    expect(run(start, 'ls').out).toBe("'ls' is not recognized as an internal or external command,\noperable program or batch file.")
  })
})

describe('Tab completion', () => {
  it('finishes a unique name, adding the separator after a folder', () => {
    expect(complete(newShell('posix'), 'cd Doc')).toBe('cd Documents/')
    expect(complete(newShell('posix'), 'ls Documents/Sc')).toBe('ls Documents/School/')
    expect(complete(newShell('windows'), 'cd doc')).toBe('cd Documents\\')
  })

  it('goes as far as every match agrees, and gives up when nothing matches', () => {
    expect(complete(newShell('posix'), 'cd D')).toBe(null)
    expect(complete(newShell('posix'), 'rm Downloads/p')).toBe(null)
    expect(complete(run(newShell('posix'), 'cd Downloads').shell, 'rm pa')).toBe('rm party.jpg')
    expect(complete(newShell('posix'), 'cd Zebra')).toBe(null)
    expect(complete(newShell('posix'), 'pw')).toBe(null)
  })
})
