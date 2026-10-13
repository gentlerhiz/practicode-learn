import { describe, expect, it } from 'vitest'
import { resolvePath } from './file-paths'

describe('resolvePath', () => {
  it('starts from the folder of the page that holds the link', () => {
    expect(resolvePath('index.html', 'menu/drinks.html')).toMatchObject({
      target: 'menu/drinks.html',
      found: true,
    })
    expect(resolvePath('menu/drinks.html', 'about.html')).toMatchObject({
      target: 'menu/about.html',
      found: false,
    })
    expect(resolvePath('menu/soups.html', 'images/jollof.jpg')).toMatchObject({
      target: 'menu/images/jollof.jpg',
      found: false,
    })
  })

  it('goes up with .., and stays at the top of the site', () => {
    expect(resolvePath('menu/drinks.html', '../about.html')).toMatchObject({
      target: 'about.html',
      found: true,
    })
    expect(resolvePath('menu/soups.html', '../../index.html')).toMatchObject({
      target: 'index.html',
      found: true,
    })
  })

  it('treats . as here and / as the top of the site', () => {
    expect(resolvePath('menu/soups.html', './drinks.html')).toMatchObject({
      target: 'menu/drinks.html',
      found: true,
    })
    expect(resolvePath('menu/soups.html', '/images/jollof.jpg')).toMatchObject({
      target: 'images/jollof.jpg',
      found: true,
    })
  })
})
