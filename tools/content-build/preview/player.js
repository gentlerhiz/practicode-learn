// Review preview player: plays compiled lesson packs the way learners will meet them, plus reviewer tools
// (show answers, notes per step, copy notes). buildDocument and mergeFiles come from tools/runtime/sandbox.mjs.
;(function () {
  'use strict'
  var DATA = JSON.parse(document.getElementById('pcl-data').textContent)
  var LESSONS = DATA.lessons
  var STAGE = {
    hook: 'Hook',
    predict: 'Predict',
    run: 'Run',
    investigate: 'Investigate',
    modify: 'Modify',
    make: 'Make',
    apply: 'Apply',
    recap: 'Recap',
  }
  var TRACK = { 'front-end-web-development': 'Front-End' }
  var SYMBOLS = ['{', '}', ':', ';', '<', '>', '/', '=', '"', '(', ')', '-', '#', '.']

  var store = {
    get: function (k, d) {
      try {
        var v = localStorage.getItem('pcl-review:' + k)
        return v == null ? d : JSON.parse(v)
      } catch (e) {
        return d
      }
    },
    set: function (k, v) {
      try {
        localStorage.setItem('pcl-review:' + k, JSON.stringify(v))
      } catch (e) {}
    },
  }
  var esc = function (s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  }
  var strip = function (html) {
    var d = document.createElement('div')
    d.innerHTML = html
    return d.textContent
  }

  var L = Math.min(Math.max(store.get('lesson', 0), 0), LESSONS.length - 1)
  var S = 0
  var reviewer = store.get('reviewer', false)
  var notes = store.get('notes', {})
  var state = {}
  var timers = []
  var testListeners = []
  var finished = false

  var app = document.getElementById('app')
  var pack = function () {
    return LESSONS[L].pack
  }
  var sol = function () {
    return LESSONS[L].solutions
  }
  var key = function (i) {
    return pack().id + ':' + i
  }
  var st = function (i) {
    var k = key(i == null ? S : i)
    return state[k] || (state[k] = { hints: 0 })
  }

  // ---------- code display ----------
  // The line that holds {{value}} is highlighted as a whole, so the mark never cuts across syntax colouring.
  function highlight(code, lang, value) {
    var lines = code.split('\n'),
      marked = {}
    if (value != null)
      lines = lines.map(function (l, i) {
        if (l.indexOf('{{value}}') < 0) return l
        marked[i] = true
        return l.split('{{value}}').join(value)
      })
    var s = esc(lines.join('\n'))
    if (lang === 'css') {
      s = s
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="c-com">$1</span>')
        .replace(/^([^{}\n<]+?)(\s*)\{/gm, '<span class="c-sel">$1</span>$2{')
        .replace(
          /([a-z-]+)(\s*:\s*)([^;{}\n<]+)(;)/g,
          '<span class="c-prop">$1</span>$2<span class="c-val">$3</span>$4',
        )
    } else if (lang === 'html') {
      s = s.replace(
        /(&lt;\/?)([a-z0-9-]+)((?:\s+[a-z-]+(?:=&quot;[^&]*?&quot;)?)*)(\s*\/?&gt;)/gi,
        function (m, open, tag, attrs, close) {
          return (
            open +
            '<span class="c-tag">' +
            tag +
            '</span>' +
            attrs.replace(
              /([a-z-]+)=(&quot;[^&]*?&quot;)/gi,
              '<span class="c-attr">$1</span>=<span class="c-str">$2</span>',
            ) +
            close
          )
        },
      )
    }
    return s
      .split('\n')
      .map(function (l, i) {
        return marked[i] ? '<mark>' + l + '</mark>' : l
      })
      .join('\n')
  }

  function filesView(files, opts) {
    opts = opts || {}
    var id = 'f' + Math.random().toString(36).slice(2, 7)
    var active = opts.active || 0
    var tabs = files
      .map(function (f, i) {
        return (
          '<button class="tab" role="tab" id="' +
          id +
          '-t' +
          i +
          '" aria-controls="' +
          id +
          '-p' +
          i +
          '" aria-selected="' +
          (i === active) +
          '" data-tab="' +
          i +
          '">' +
          esc(f.name) +
          (f.readonly && opts.editable ? '<span class="ro">read only</span>' : '') +
          '</button>'
        )
      })
      .join('')
    var panels = files
      .map(function (f, i) {
        var body =
          opts.editable && !f.readonly
            ? '<textarea class="editor" spellcheck="false" autocapitalize="off" autocomplete="off" aria-label="Edit ' +
              esc(f.name) +
              '" data-file="' +
              i +
              '"></textarea>' +
              '<div class="symbols" aria-label="Insert a symbol">' +
              SYMBOLS.map(function (c) {
                return (
                  '<button type="button" data-sym="' +
                  esc(c) +
                  '" aria-label="Insert ' +
                  esc(c) +
                  '">' +
                  esc(c) +
                  '</button>'
                )
              }).join('') +
              '</div>'
            : '<pre class="code"><code>' + highlight(f.code, f.lang, opts.value) + '</code></pre>'
        return (
          '<div role="tabpanel" id="' +
          id +
          '-p' +
          i +
          '" aria-labelledby="' +
          id +
          '-t' +
          i +
          '"' +
          (i === active ? '' : ' hidden') +
          '>' +
          body +
          '</div>'
        )
      })
      .join('')
    return (
      '<div class="files"><div class="tabs" role="tablist" aria-label="Files">' +
      tabs +
      '</div>' +
      panels +
      '</div>'
    )
  }
  function wireTabs(root) {
    root.querySelectorAll('.files').forEach(function (box) {
      box.addEventListener('click', function (e) {
        var t = e.target.closest('[data-tab]')
        if (!t) return
        box.querySelectorAll('.tab').forEach(function (b) {
          b.setAttribute('aria-selected', String(b === t))
        })
        box.querySelectorAll('[role="tabpanel"]').forEach(function (p, i) {
          p.hidden = String(i) !== t.dataset.tab
        })
      })
    })
  }
  function frame(label) {
    return (
      '<div class="frame-wrap"><div class="label"><span>' +
      (label || 'Live preview') +
      '</span><span>Browser</span></div><iframe title="Live preview of the code" sandbox="allow-scripts"></iframe></div>'
    )
  }

  // ---------- shared pieces ----------
  function hintsHTML(step, s) {
    var n = reviewer ? step.hints.length : s.hints
    var shown = step.hints
      .slice(0, n)
      .map(function (h, i) {
        return '<div class="hint"><b>Hint ' + (i + 1) + ' of ' + step.hints.length + ':</b> ' + h + '</div>'
      })
      .join('')
    return '<div class="hints" aria-live="polite">' + shown + '</div>'
  }
  function hintButton(step, s) {
    if (reviewer || s.hints >= step.hints.length) return ''
    return (
      '<button type="button" class="btn small quiet" data-act="hint">' +
      (s.hints ? 'Another Hint' : 'Show a Hint') +
      '</button>'
    )
  }
  function optionsHTML(step, s, reveal) {
    var name = 'o-' + key(S).replace(/[^a-z0-9]/gi, '')
    var opts = step.options
      .map(function (o) {
        var cls = ''
        if (s.checked && s.checkedId === o.id) cls = o.correct ? ' is-correct' : ' is-wrong'
        if (s.checked && reveal && o.correct) cls = ' is-correct'
        var tag = reviewer && o.correct ? '<span class="tag">Answer</span>' : ''
        return (
          '<label class="opt' +
          cls +
          '"><input type="radio" name="' +
          name +
          '" value="' +
          esc(o.id) +
          '"' +
          (s.selected === o.id ? ' checked' : '') +
          '><span class="otext">' +
          o.html +
          '</span>' +
          tag +
          '</label>'
        )
      })
      .join('')
    var locked = s.checked && (reveal || s.correct)
    return (
      '<fieldset class="opts"' +
      (locked ? ' disabled' : '') +
      '><legend class="sr">Choose an answer</legend>' +
      opts +
      '</fieldset>'
    )
  }
  function feedbackHTML(step, s, reveal) {
    if (!s.checked) return ''
    var chosen = step.options.find(function (o) {
      return o.id === s.checkedId
    })
    var right = step.options.find(function (o) {
      return o.correct
    })
    if (chosen.correct)
      return (
        '<div class="fb ok"><span class="verdict">' +
        (reveal ? 'You called it.' : 'Correct.') +
        '</span>' +
        chosen.feedback +
        '</div>'
      )
    if (reveal)
      return (
        '<div class="fb bad"><span class="verdict">Not this time.</span>' +
        chosen.feedback +
        '<p><strong>The answer:</strong> ' +
        right.html +
        '. ' +
        right.feedback +
        '</p></div>'
      )
    return (
      '<div class="fb bad"><span class="verdict">Not quite.</span>' +
      chosen.feedback +
      ' Try another answer.</div>'
    )
  }
  function wireOptions(el, step, s, reveal, rerender, onSelect) {
    el.querySelectorAll('.opts input').forEach(function (inp) {
      inp.addEventListener('change', function () {
        s.selected = inp.value
        if (onSelect) onSelect()
        if (s.checked && !s.correct && !reveal) s.checked = false
        var chk = el.querySelector('[data-act="check"]')
        if (chk) chk.disabled = false
        el.querySelectorAll('.opt').forEach(function (l) {
          l.classList.remove('is-wrong')
        })
        var fb = el.querySelector('.fbslot')
        if (fb && !reveal) fb.innerHTML = ''
      })
    })
    var chk = el.querySelector('[data-act="check"]')
    if (chk)
      chk.addEventListener('click', function () {
        if (!s.selected) return
        s.checked = true
        s.checkedId = s.selected
        s.correct = !!step.options.find(function (o) {
          return o.id === s.selected && o.correct
        })
        rerender()
        var fb = el.querySelector('.fbslot')
        if (fb) fb.focus({ preventScroll: true })
      })
  }
  function wireHints(el, s, rerender) {
    var b = el.querySelector('[data-act="hint"]')
    if (b)
      b.addEventListener('click', function () {
        s.hints++
        rerender()
      })
  }
  function checkButton(s, reveal) {
    var locked = s.checked && (reveal || s.correct)
    if (locked) return ''
    return (
      '<button type="button" class="btn" data-act="check"' +
      (s.selected ? '' : ' disabled') +
      '>Check My Answer</button>'
    )
  }

  // ---------- step types ----------
  var render = {}

  render.explain = function (step, s, el) {
    s.done = true
    el.innerHTML = '<div class="prose">' + step.body + '</div>'
  }

  render.predict = function (step, s, el) {
    choiceStep(step, s, el, true)
  }
  render.question = function (step, s, el) {
    choiceStep(step, s, el, false)
  }

  function choiceStep(step, s, el, reveal) {
    var rerender = function () {
      choiceStep(step, s, el, reveal)
      refreshNav()
    }
    var runnable = step.run && step.files
    if (reveal) s.done = s.checked && (!runnable || s.ran)
    else s.done = s.checked && s.correct
    var after = ''
    if (runnable && s.checked) {
      after = s.ran
        ? frame() + (step.reveal ? '<div class="reveal">' + step.reveal + '</div>' : '')
        : '<div class="actions"><button type="button" class="btn primary" data-act="run">Run It</button><span class="kbd">See what really happens.</span></div>'
    } else if (s.checked && s.correct && step.reveal) after = '<div class="reveal">' + step.reveal + '</div>'
    // Live steps: every answer is a piece of code the learner can try in the preview before choosing.
    var liveIdx = step.live
      ? step.files.findIndex(function (f) {
          return f.code.indexOf('{{value}}') >= 0
        })
      : 0
    var liveValue = function () {
      var o = step.options.find(function (x) {
        return x.id === s.selected
      })
      return o ? o.value : '/* tap an answer to try it */'
    }
    var code = !step.files
      ? ''
      : step.live
        ? '<div class="work">' +
          filesView(step.files, { value: liveValue(), active: liveIdx }) +
          frame('Live preview: tap an answer to try it') +
          '</div>'
        : filesView(step.files)
    el.innerHTML =
      '<div class="prose">' +
      step.body +
      '</div>' +
      code +
      optionsHTML(step, s, reveal) +
      '<div class="actions">' +
      checkButton(s, reveal) +
      hintButton(step, s) +
      '</div>' +
      '<div class="fbslot" tabindex="-1" aria-live="polite">' +
      feedbackHTML(step, s, reveal) +
      '</div>' +
      hintsHTML(step, s) +
      after
    var tryIt = function () {
      if (!step.live) return
      var work = el.querySelector('.work'),
        tmp = document.createElement('div')
      tmp.innerHTML = filesView(step.files, { value: liveValue(), active: liveIdx })
      work.querySelector('.files').replaceWith(tmp.firstChild)
      wireTabs(work)
      work.querySelector('iframe').srcdoc = buildDocument(step.files, { value: liveValue() })
    }
    wireTabs(el)
    wireOptions(el, step, s, reveal, rerender, tryIt)
    wireHints(el, s, rerender)
    var run = el.querySelector('[data-act="run"]')
    if (run)
      run.addEventListener('click', function () {
        s.ran = true
        rerender()
      })
    var f = el.querySelector('iframe')
    if (f) f.srcdoc = buildDocument(step.files, step.live ? { value: liveValue() } : {})
  }

  render.explore = function (step, s, el) {
    var rerender = function () {
      render.explore(step, s, el)
      refreshNav()
    }
    if (s.value == null) s.value = step.values[0]
    s.done = s.checked && s.correct
    var seg =
      '<div class="ctlrow"><span class="lbl" id="ctl-' +
      S +
      '">' +
      esc(step.control) +
      '</span><div class="seg" role="group" aria-labelledby="ctl-' +
      S +
      '">' +
      step.values
        .map(function (v) {
          return (
            '<button type="button" data-val="' +
            esc(v) +
            '" aria-pressed="' +
            (v === s.value) +
            '">' +
            esc(v) +
            '</button>'
          )
        })
        .join('') +
      '</div>' +
      (step.lab === 'page-load'
        ? '<button type="button" class="btn small" data-act="load">Load the Page</button>'
        : '') +
      '</div>'
    var stage = step.lab
      ? '<div class="lab" data-lab="' + step.lab + '"></div>'
      : '<div class="work">' +
        filesView(step.files, {
          value: s.value,
          active: step.files.findIndex(function (f) {
            return f.code.indexOf('{{value}}') >= 0
          }),
        }) +
        frame() +
        '</div>'
    el.innerHTML =
      '<div class="prose">' +
      step.body +
      '</div>' +
      seg +
      stage +
      '<p class="ask">' +
      step.ask +
      '</p>' +
      optionsHTML(step, s, false) +
      '<div class="actions">' +
      checkButton(s, false) +
      hintButton(step, s) +
      '</div>' +
      '<div class="fbslot" tabindex="-1" aria-live="polite">' +
      feedbackHTML(step, s, false) +
      '</div>' +
      hintsHTML(step, s) +
      (s.checked && s.correct && step.reveal ? '<div class="reveal">' + step.reveal + '</div>' : '')
    wireTabs(el)
    wireOptions(el, step, s, false, rerender)
    wireHints(el, s, rerender)
    el.querySelectorAll('[data-val]').forEach(function (b) {
      b.addEventListener('click', function () {
        s.value = b.dataset.val
        el.querySelectorAll('[data-val]').forEach(function (x) {
          x.setAttribute('aria-pressed', String(x === b))
        })
        if (step.lab === 'page-load') {
          s.loaded = s.value
          pageLoad.run(el.querySelector('.lab'), s.value)
        } else {
          var files = el.querySelector('.work .files')
          var tmp = document.createElement('div')
          tmp.innerHTML = filesView(step.files, {
            value: s.value,
            active: step.files.findIndex(function (f) {
              return f.code.indexOf('{{value}}') >= 0
            }),
          })
          files.replaceWith(tmp.firstChild)
          wireTabs(el.querySelector('.work'))
          el.querySelector('iframe').srcdoc = buildDocument(step.files, { value: s.value })
        }
      })
    })
    if (step.lab === 'page-load') {
      var box = el.querySelector('.lab')
      if (s.loaded) pageLoad.run(box, s.loaded, true)
      else pageLoad.mount(box)
      el.querySelector('[data-act="load"]').addEventListener('click', function () {
        s.loaded = s.value
        pageLoad.run(box, s.value)
      })
    } else el.querySelector('iframe').srcdoc = buildDocument(step.files, { value: s.value })
  }

  render.diagram = function (step, s, el) {
    if (s.at == null) s.at = 0
    s.done = true
    var n = step.states.length,
      cur = step.states[s.at]
    el.innerHTML =
      '<div class="prose">' +
      step.body +
      '</div>' +
      '<div class="lab" data-lab="' +
      step.lab +
      '" tabindex="0" aria-label="Diagram. Use the left and right arrow keys to move between steps."></div>' +
      '<div class="statebox" aria-live="polite"><div class="statehead"><h3>' +
      esc(cur.title) +
      '</h3><span>' +
      (s.at + 1) +
      ' of ' +
      n +
      '</span></div><div class="prose">' +
      cur.html +
      '</div></div>' +
      '<div class="statectl"><button type="button" class="btn small" data-act="prev"' +
      (s.at ? '' : ' disabled') +
      '>Previous</button>' +
      '<div class="dots" aria-hidden="true">' +
      step.states
        .map(function (x, i) {
          return '<span class="' + (i === s.at ? 'on' : '') + '"></span>'
        })
        .join('') +
      '</div>' +
      '<button type="button" class="btn small' +
      (s.at < n - 1 ? ' primary' : '') +
      '" data-act="next"' +
      (s.at < n - 1 ? '' : ' disabled') +
      '>Next</button></div>'
    var lab = el.querySelector('.lab')
    LABS[step.lab](lab, s.at)
    // Keep keyboard focus where it was: on the diagram for arrow keys, on the button that was pressed otherwise.
    var go = function (d, from) {
      var t = s.at + d
      if (t < 0 || t >= n) return
      s.at = t
      render.diagram(step, s, el)
      var target =
        from === 'key'
          ? el.querySelector('.lab')
          : el.querySelector('[data-act="' + from + '"]:not(:disabled)') ||
            el.querySelector('.statectl button:not(:disabled)')
      if (target) target.focus({ preventScroll: true })
    }
    el.querySelector('[data-act="prev"]').addEventListener('click', function () {
      go(-1, 'prev')
    })
    el.querySelector('[data-act="next"]').addEventListener('click', function () {
      go(1, 'next')
    })
    lab.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        go(1, 'key')
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        go(-1, 'key')
      }
    })
  }

  render.order = function (step, s, el) {
    var rerender = function () {
      render.order(step, s, el)
      refreshNav()
    }
    if (!s.order) {
      // A fixed shuffle (reversed pairs) so every reviewer sees the same starting order and it is never already solved.
      var idx = step.items.map(function (_, i) {
        return i
      })
      s.order = idx.slice(1).concat(idx[0]).reverse()
      if (
        s.order.every(function (v, i) {
          return v === i
        })
      )
        s.order.reverse()
    }
    s.done = !!s.solved
    var n = s.order.length
    var items = s.order
      .map(function (item, pos) {
        var mark = s.checked ? (item === pos ? ' good' : ' off') : ''
        var state = s.checked
          ? '<span class="sr">' +
            (item === pos ? ', in the right place' : ', not in the right place') +
            '</span>'
          : ''
        return (
          '<li class="' +
          mark +
          '"><span class="n">' +
          (pos + 1) +
          '</span><span class="t">' +
          step.items[item] +
          state +
          '</span>' +
          (s.solved
            ? ''
            : '<span class="mv"><button type="button" data-mv="' +
              pos +
              ':-1" aria-label="Move up"' +
              (pos ? '' : ' disabled') +
              '>↑</button><button type="button" data-mv="' +
              pos +
              ':1" aria-label="Move down"' +
              (pos < n - 1 ? '' : ' disabled') +
              '>↓</button></span>') +
          '</li>'
        )
      })
      .join('')
    var fb = s.checked
      ? s.solved
        ? '<div class="fb ok"><span class="verdict">Correct.</span>That is the whole trip, in order.</div>'
        : '<div class="fb bad"><span class="verdict">Not yet.</span>' + step.wrong + '</div>'
      : ''
    var answer =
      reviewer && !s.solved
        ? '<div class="hint"><b>Answer:</b> ' +
          step.items
            .map(function (t, i) {
              return i + 1 + '. ' + strip(t)
            })
            .join(' → ') +
          '</div>'
        : ''
    el.innerHTML =
      '<div class="prose">' +
      step.body +
      '</div><ol class="order-list">' +
      items +
      '</ol>' +
      '<div class="actions">' +
      (s.solved ? '' : '<button type="button" class="btn" data-act="check">Check the Order</button>') +
      hintButton(step, s) +
      '</div>' +
      '<div class="fbslot" tabindex="-1" aria-live="polite">' +
      fb +
      '</div>' +
      answer +
      hintsHTML(step, s)
    el.querySelectorAll('[data-mv]').forEach(function (b) {
      b.addEventListener('click', function () {
        var p = b.dataset.mv.split(':').map(Number),
          a = p[0],
          t = a + p[1]
        var tmp = s.order[a]
        s.order[a] = s.order[t]
        s.order[t] = tmp
        s.checked = false
        rerender()
        var again =
          el.querySelector('[data-mv="' + t + ':' + p[1] + '"]') ||
          el.querySelector('[data-mv="' + t + ':' + -p[1] + '"]')
        if (again) again.focus()
      })
    })
    var c = el.querySelector('[data-act="check"]')
    if (c)
      c.addEventListener('click', function () {
        s.checked = true
        s.solved = s.order.every(function (v, i) {
          return v === i
        })
        rerender()
        el.querySelector('.fbslot').focus({ preventScroll: true })
      })
    wireHints(el, s, rerender)
  }

  render.code = function (step, s, el) {
    var rerender = function () {
      render.code(step, s, el)
      refreshNav()
    }
    if (!s.files)
      s.files = step.files.map(function (f) {
        return Object.assign({}, f)
      })
    s.done = !!(
      s.results &&
      s.results.every(function (r) {
        return r.pass
      })
    )
    var tests = step.tests
      .map(function (t, i) {
        var r = s.results && s.results[i]
        var cls = r ? (r.pass ? 'pass' : 'fail') : ''
        return (
          '<li class="' +
          cls +
          '"><span class="st">' +
          (r ? (r.pass ? '✓ Passed' : '✕ Needs a fix') : '○ Not run') +
          '</span>' +
          t.name +
          (r && !r.pass ? '<span class="msg">' + esc(r.message) + '</span>' : '') +
          '</li>'
        )
      })
      .join('')
    var allPass = s.done
      ? '<div class="fb ok"><span class="verdict">All checks pass.</span>Nicely done.</div>'
      : ''
    el.innerHTML =
      '<div class="prose">' +
      step.body +
      '</div>' +
      '<div class="work">' +
      filesView(s.files, {
        editable: true,
        active: s.files.findIndex(function (f) {
          return !f.readonly
        }),
      }) +
      frame('Updates when you run it') +
      '</div>' +
      '<div class="actions"><button type="button" class="btn" data-act="run">Run</button><button type="button" class="btn primary" data-act="test">Run Tests</button>' +
      (reviewer
        ? '<button type="button" class="btn small quiet" data-act="solution">Show the Solution</button>'
        : '') +
      hintButton(step, s) +
      '</div>' +
      '<ul class="tests" aria-live="polite" aria-label="Tests">' +
      tests +
      '</ul>' +
      allPass +
      hintsHTML(step, s)
    wireTabs(el)
    wireHints(el, s, rerender)
    el.querySelectorAll('textarea.editor').forEach(function (ta) {
      var f = s.files[Number(ta.dataset.file)]
      ta.value = f.code
      ta.addEventListener('input', function () {
        f.code = ta.value
      })
      ta.addEventListener('keydown', function (e) {
        if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
          e.preventDefault()
          insert(ta, '  ')
          f.code = ta.value
        }
      })
      ta.parentNode.querySelector('.symbols').addEventListener('click', function (e) {
        var b = e.target.closest('[data-sym]')
        if (!b) return
        insert(ta, b.dataset.sym)
        f.code = ta.value
        ta.focus()
      })
    })
    var iframe = el.querySelector('iframe')
    iframe.srcdoc = buildDocument(s.files)
    el.querySelector('[data-act="run"]').addEventListener('click', function () {
      iframe.srcdoc = buildDocument(s.files)
    })
    el.querySelector('[data-act="test"]').addEventListener('click', function () {
      var btn = this
      btn.disabled = true
      btn.textContent = 'Checking…'
      runTests(iframe, s.files, step.tests, function (results) {
        s.results = results
        rerender()
      })
    })
    var sb = el.querySelector('[data-act="solution"]')
    if (sb)
      sb.addEventListener('click', function () {
        s.files = mergeFiles(step.files, sol()[S] || []).map(function (f) {
          return Object.assign({}, f)
        })
        s.results = null
        rerender()
      })
  }

  render.recap = function (step, s, el) {
    s.done = true
    s.flipped = s.flipped || {}
    el.innerHTML =
      '<h2>What you can do now</h2><ol class="points">' +
      step.points
        .map(function (p) {
          return '<li><span>' + p + '</span></li>'
        })
        .join('') +
      '</ol>' +
      '<div class="prose"><p>These cards join your daily review. Tap a card to check yourself.</p></div>' +
      '<div class="cards">' +
      step.cards
        .map(function (c, i) {
          var f = !!s.flipped[i]
          return (
            '<button type="button" class="card" data-card="' +
            i +
            '" aria-pressed="' +
            f +
            '"><span class="side">' +
            (f ? 'Answer' : 'Review card ' + (i + 1)) +
            '</span><span class="face">' +
            (f ? c.back : c.front) +
            '</span></button>'
          )
        })
        .join('') +
      '</div>'
    el.querySelectorAll('[data-card]').forEach(function (b) {
      b.addEventListener('click', function () {
        var i = b.dataset.card
        s.flipped[i] = !s.flipped[i]
        render.recap(step, s, el)
        el.querySelector('[data-card="' + i + '"]').focus()
      })
    })
  }

  function insert(ta, text) {
    var a = ta.selectionStart,
      b = ta.selectionEnd
    ta.value = ta.value.slice(0, a) + text + ta.value.slice(b)
    ta.selectionStart = ta.selectionEnd = a + text.length
  }

  // Tests run inside the sandboxed preview and report back with postMessage.
  window.addEventListener('message', function (e) {
    if (!e.data || e.data.type !== 'pcl-tests') return
    testListeners = testListeners.filter(function (l) {
      if (l.win === e.source) {
        l.done(e.data.results)
        return false
      }
      return true
    })
  })
  function runTests(iframe, files, tests, done) {
    var settled = false
    var finish = function (r) {
      if (settled) return
      settled = true
      done(r)
    }
    testListeners.push({ win: iframe.contentWindow, done: finish })
    iframe.srcdoc = buildDocument(files, { tests: tests })
    timers.push(
      setTimeout(function () {
        finish(
          tests.map(function (t) {
            return {
              name: t.name,
              pass: false,
              message: 'The checks took too long. Is there a loop that never ends?',
            }
          }),
        )
      }, 4000),
    )
  }

  // ---------- labs ----------
  var LABS = {}
  var NS = 'http://www.w3.org/2000/svg'

  LABS['request-journey'] = function (box, at) {
    // Which parts are lit in each state (0-based): phone, dns, request arrow, response arrow, extra files, finished page.
    var on = {
      phone: [0, 1, 2, 3, 4, 5],
      addr: [0, 1, 2],
      typed: [0],
      dns: [1],
      req: [2],
      server: [2, 3, 4],
      res: [3],
      extras: [4],
      page: [5],
      tap: [0],
    }
    var cls = function (part) {
      return on[part].indexOf(at) >= 0 ? 'on' : 'dim'
    }
    var show = function (part) {
      return on[part].indexOf(at) >= 0 ? 'on' : 'hide'
    }
    var T = function (x, y, size, str, opts) {
      opts = opts || {}
      return (
        '<text x="' +
        x +
        '" y="' +
        y +
        '" text-anchor="middle" font-size="' +
        size +
        '" fill="' +
        (opts.fill || 'var(--text)') +
        '" font-family="' +
        (opts.mono ? 'JetBrains Mono, monospace' : 'Poppins, sans-serif') +
        '"' +
        (opts.weight ? ' font-weight="' + opts.weight + '"' : '') +
        '>' +
        str +
        '</text>'
      )
    }
    box.innerHTML =
      '<svg viewBox="0 0 320 210" role="img" aria-label="A phone on the left and a server on the right, with messages passing between them">' +
      '<g class="' +
      cls('phone') +
      '"><rect x="8" y="14" width="92" height="166" rx="16" fill="none" stroke="var(--soft)" stroke-width="2"/>' +
      '<rect x="16" y="28" width="76" height="138" rx="6" fill="var(--row)" stroke="var(--line)"/>' +
      T(54, 202, 13, 'Your phone', { fill: 'var(--muted)' }) +
      '</g>' +
      // The address is too long to read inside a drawn phone, so the bar holds a placeholder and a callout shows what was typed.
      '<g class="' +
      show('addr') +
      '"><rect x="20" y="34" width="68" height="18" rx="9" fill="var(--sunken)" stroke="var(--track-line)"/><rect x="28" y="41" width="40" height="4" rx="2" fill="var(--muted)"/></g>' +
      '<g class="' +
      show('typed') +
      '"><path d="M90 43 C 102 43, 106 23, 118 23" fill="none" stroke="var(--track-line)" stroke-width="1.5" stroke-dasharray="3 3"/>' +
      '<rect x="118" y="6" width="194" height="34" rx="10" fill="var(--track-tint)" stroke="var(--track-line)"/>' +
      T(215, 28, 12, 'learn.practicode.tech', { mono: true }) +
      '</g>' +
      '<g class="' +
      show('tap') +
      '"><circle cx="80" cy="43" r="10" fill="var(--track)" opacity="0.35"/><circle cx="80" cy="43" r="4.5" fill="var(--track)"/></g>' +
      '<g class="' +
      show('page') +
      '"><rect x="22" y="36" width="50" height="9" rx="2" fill="var(--track)"/><rect x="22" y="51" width="64" height="5" rx="2" fill="var(--muted)"/><rect x="22" y="60" width="56" height="5" rx="2" fill="var(--muted)"/>' +
      '<rect x="22" y="71" width="64" height="40" rx="4" fill="#E8792F"/><rect x="22" y="117" width="64" height="5" rx="2" fill="var(--muted)"/><rect x="22" y="126" width="48" height="5" rx="2" fill="var(--muted)"/><rect x="22" y="138" width="36" height="13" rx="6.5" fill="#FED606"/></g>' +
      '<g class="' +
      cls('server') +
      '">' +
      [44, 80, 116]
        .map(function (y) {
          return (
            '<rect x="222" y="' +
            y +
            '" width="90" height="30" rx="6" fill="var(--row)" stroke="var(--soft)" stroke-width="2"/><circle cx="236" cy="' +
            (y + 15) +
            '" r="3.5" fill="var(--ok)"/><rect x="248" y="' +
            (y + 13) +
            '" width="50" height="4" rx="2" fill="var(--line-control)"/>'
          )
        })
        .join('') +
      T(267, 168, 13, 'Server', { fill: 'var(--muted)' }) +
      '</g>' +
      '<g class="' +
      show('dns') +
      '"><rect x="112" y="4" width="104" height="44" rx="10" fill="var(--track-tint)" stroke="var(--track-line)"/>' +
      T(164, 22, 12, 'Where is the') +
      T(164, 39, 12, 'server?') +
      '<path d="M100 56 C 104 40, 106 32, 110 28" fill="none" stroke="var(--track-line)" stroke-width="1.5" stroke-dasharray="3 3"/></g>' +
      // Arrows run level with the centres of the server boxes (y = 59, 95, 131).
      '<g class="' +
      show('req') +
      '"><line x1="106" y1="95" x2="210" y2="95" stroke="var(--track-line)" stroke-width="3"/><path d="M208 88 L218 95 L208 102 Z" fill="var(--track-line)"/>' +
      T(162, 85, 13, 'Request', { weight: 600 }) +
      '</g>' +
      '<g class="' +
      show('res') +
      '"><line x1="114" y1="95" x2="218" y2="95" stroke="var(--ok)" stroke-width="3"/><path d="M116 88 L106 95 L116 102 Z" fill="var(--ok)"/>' +
      T(162, 85, 13, 'Response', { weight: 600 }) +
      '<rect x="134" y="105" width="56" height="22" rx="5" fill="var(--ok-tint)" stroke="var(--ok)"/>' +
      T(162, 120, 11, 'HTML', { mono: true }) +
      '</g>' +
      '<g class="' +
      show('extras') +
      '">' +
      ['CSS', 'Image', 'JS']
        .map(function (t, i) {
          var y = 59 + i * 36
          return (
            '<line x1="114" y1="' +
            y +
            '" x2="216" y2="' +
            y +
            '" stroke="var(--track-line)" stroke-width="2" stroke-dasharray="5 4"/><path d="M116 ' +
            (y - 6) +
            ' L106 ' +
            y +
            ' L116 ' +
            (y + 6) +
            ' Z" fill="var(--track-line)"/>' +
            '<rect x="134" y="' +
            (y - 11) +
            '" width="56" height="22" rx="5" fill="var(--row)" stroke="var(--track-line)"/>' +
            T(162, y + 4, 11, t, { mono: true })
          )
        })
        .join('') +
      '</g>' +
      '</svg>'
  }

  LABS['flex-axes'] = function (box, at) {
    var col = at >= 3
    var align = at === 2 || at === 4 ? 'center' : 'stretch'
    var mainHot = at === 0 || at === 3 || at === 4,
      crossHot = at === 1 || at === 2 || at === 4
    var mainLabel = 'main axis · justify-content',
      crossLabel = 'cross axis · align-items'
    // In a column the main axis is vertical and the cross axis horizontal, so the labels trade places.
    var h = col ? crossLabel : mainLabel,
      v = col ? mainLabel : crossLabel
    var hHot = col ? crossHot : mainHot,
      vHot = col ? mainHot : crossHot
    box.innerHTML =
      '<div class="axes' +
      (col ? ' col' : '') +
      '" style="align-items:' +
      align +
      '" role="img" aria-label="' +
      (col ? 'A flex column' : 'A flex row') +
      ' with align-items: ' +
      align +
      '">' +
      '<div class="arrow h' +
      (hHot ? ' hot' : ' off') +
      '"><em>' +
      h +
      '</em><i></i></div>' +
      '<div class="arrow v' +
      (vHot ? ' hot' : ' off') +
      '"><em>' +
      v +
      '</em><i></i></div>' +
      '<span class="bx big">MN</span><span class="bx">Menu</span><span class="bx">Find us</span><span class="bx">Order</span></div>' +
      '<p class="status" style="margin:10px 0 0;font-family:var(--font-code)">.nav { display: flex;' +
      (col ? ' flex-direction: column;' : '') +
      ' align-items: ' +
      align +
      '; }</p>'
  }

  var pageLoad = {
    FILES: [
      { name: 'index.html', kb: 6, fast: [0, 120], slow: [0, 900] },
      { name: 'styles.css', kb: 14, fast: [120, 230], slow: [900, 2100] },
      { name: 'logo.svg', kb: 3, fast: [120, 180], slow: [900, 1500] },
      { name: 'script.js', kb: 9, fast: [120, 260], slow: [900, 2600] },
      { name: 'jollof.webp', kb: 85, fast: [120, 420], slow: [900, 5600] },
    ],
    mount: function (box) {
      box.innerHTML =
        '<div class="mock"><div class="bar"><span class="spin"></span><span class="addr">Tap “Load the Page” to start</span></div>' +
        '<div class="page blank"><h4>Mama Nkechi\'s Kitchen</h4><p>Jollof rice, fried plantain and pepper soup, cooked fresh every day.</p><div class="photo">Photo of jollof rice</div><p>Open every day, 10am to 9pm.</p><span class="order">Order Now</span></div></div>' +
        '<p class="status" aria-live="polite"></p>' +
        '<div class="net" aria-label="Files the browser downloads">' +
        this.FILES.map(function (f) {
          return (
            '<div class="row" data-f="' +
            f.name +
            '"><span class="nm">' +
            f.name +
            '</span><span class="kb">' +
            f.kb +
            ' KB</span><span class="pb"><i></i></span></div>'
          )
        }).join('') +
        '</div>'
    },
    // instant: jump straight to the finished state (used when the step redraws after a load has started).
    run: function (box, speed, instant) {
      if (!instant) clearTimers()
      this.mount(box)
      var slow = speed === 'Slow'
      var page = box.querySelector('.page'),
        status = box.querySelector('.status'),
        spin = box.querySelector('.spin'),
        addr = box.querySelector('.addr')
      var say = function (t) {
        status.textContent = t
      }
      var events = []
      var later = function (t, fn) {
        if (instant) events.push([t, fn])
        else timers.push(setTimeout(fn, t))
      }
      if (!instant) {
        spin.classList.add('go')
        addr.textContent = 'Loading on a ' + speed.toLowerCase() + ' connection…'
        say('Waiting for the server to send index.html…')
      }
      var steps = instant || matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 8
      this.FILES.forEach(function (f) {
        var t = slow ? f.slow : f.fast,
          row = box.querySelector('[data-f="' + f.name + '"]'),
          bar = row.querySelector('i')
        for (var k = 1; k <= steps; k++)
          (function (k) {
            later(t[0] + ((t[1] - t[0]) * k) / steps, function () {
              bar.style.width = (100 * k) / steps + '%'
              if (k === steps) row.classList.add('done')
            })
          })(k)
      })
      var FILES = this.FILES
      var at = function (name) {
        var f = FILES.find(function (x) {
          return x.name === name
        })
        return (slow ? f.slow : f.fast)[1]
      }
      later(at('index.html'), function () {
        say(
          'The HTML has arrived. The browser asks for the CSS, logo, script and photo, and waits for the CSS before drawing.',
        )
      })
      later(at('styles.css'), function () {
        page.classList.remove('blank')
        page.classList.add('styled')
        say('The CSS has arrived, so the browser draws the page. The photo is still downloading.')
      })
      later(at('script.js'), function () {
        page.querySelector('.order').classList.add('live')
      })
      later(at('jollof.webp'), function () {
        page.querySelector('.photo').classList.add('loaded')
        page.querySelector('.photo').setAttribute('aria-label', 'Photo of jollof rice, loaded')
        spin.classList.remove('go')
        addr.textContent = 'Loaded on a ' + speed.toLowerCase() + ' connection'
        say(
          slow
            ? 'The photo arrived last. It is by far the biggest file.'
            : 'Done. On a fast connection it all seems to arrive at once. Try Slow.',
        )
      })
      events
        .sort(function (a, b) {
          return a[0] - b[0]
        })
        .forEach(function (e) {
          e[1]()
        })
    },
  }
  function clearTimers() {
    timers.forEach(clearTimeout)
    timers = []
  }

  // ---------- shell ----------
  function lessonLabel(p) {
    return 'Module ' + p.module + ', Lesson ' + p.lesson + ': ' + p.title
  }

  function shell() {
    var seen = store.get('banner-closed', false)
    app.innerHTML =
      '<header class="top"><div class="brand"><span class="wm">Practi<b>Code</b> Learn</span><span class="tag">Lesson review</span></div>' +
      '<button type="button" class="pill" id="reviewer" aria-pressed="' +
      reviewer +
      '"><span class="dot" aria-hidden="true"></span>Reviewer Mode</button>' +
      '<label class="pick"><span class="sr">Choose a lesson</span><select id="lesson-pick">' +
      LESSONS.map(function (x, i) {
        return (
          '<option value="' +
          i +
          '"' +
          (i === L ? ' selected' : '') +
          '>' +
          esc(lessonLabel(x.pack)) +
          '</option>'
        )
      }).join('') +
      '</select></label></header>' +
      (seen
        ? ''
        : '<div class="banner" id="banner"><p>This preview plays each lesson the way learners will see it. Turn on <strong>Reviewer Mode</strong> to see the answers and solutions, skip steps and leave a note on any step. Notes stay on this device until you copy them.</p><button type="button" id="banner-x" aria-label="Close this message">Close</button></div>') +
      '<main id="main"></main>'
    document.getElementById('lesson-pick').addEventListener('change', function (e) {
      openLesson(Number(e.target.value))
    })
    document.getElementById('reviewer').addEventListener('click', function () {
      reviewer = !reviewer
      store.set('reviewer', reviewer)
      this.setAttribute('aria-pressed', String(reviewer))
      draw(false)
    })
    var x = document.getElementById('banner-x')
    if (x)
      x.addEventListener('click', function () {
        store.set('banner-closed', true)
        document.getElementById('banner').remove()
      })
  }

  function openLesson(i) {
    L = i
    store.set('lesson', L)
    S = Math.min(store.get('step:' + pack().id, 0), pack().steps.length - 1)
    finished = false
    draw(true)
  }

  function draw(focus) {
    clearTimers()
    testListeners = []
    var p = pack(),
      step = p.steps[S],
      n = p.steps.length,
      s = st()
    var main = document.getElementById('main')
    if (finished) return drawDone(main)
    var segs = p.steps
      .map(function (_, i) {
        return '<span class="' + (i < S ? 'done' : i === S ? 'now' : '') + '"></span>'
      })
      .join('')
    main.innerHTML =
      '<section class="lesson" aria-labelledby="ltitle">' +
      '<div class="crumbs"><span class="track">' +
      esc(TRACK[p.track] || p.track) +
      '</span> · Module ' +
      p.module +
      ' · Lesson ' +
      p.lesson +
      ' · ' +
      p.minutes +
      ' min</div>' +
      '<h1 class="ltitle" id="ltitle">' +
      esc(p.title) +
      '</h1>' +
      '<div class="progress" role="progressbar" aria-label="Lesson progress" aria-valuemin="1" aria-valuemax="' +
      n +
      '" aria-valuenow="' +
      (S + 1) +
      '">' +
      segs +
      '</div>' +
      '<div class="stepline"><span><b>Step ' +
      (S + 1) +
      ' of ' +
      n +
      '</b> · ' +
      STAGE[step.stage] +
      '</span>' +
      (reviewer && step.assesses
        ? '<span class="assess">assesses ' + step.assesses.join(', ') + '</span>'
        : '') +
      '</div>' +
      '<article class="step" id="step" tabindex="-1" aria-label="Step ' +
      (S + 1) +
      ', ' +
      STAGE[step.stage] +
      '"></article>' +
      (reviewer
        ? '<div class="note"><label for="note-' +
          S +
          '">Note for the author about this step (saved on this device)</label><textarea id="note-' +
          S +
          '" placeholder="What is unclear, wrong or missing?"></textarea></div>'
        : '') +
      '<nav class="navbar" aria-label="Lesson steps"><button type="button" class="btn" id="back"' +
      (S ? '' : ' disabled') +
      '>Back</button>' +
      '<div class="right">' +
      (reviewer
        ? '<button type="button" class="btn small quiet" id="skip">Skip Step</button>'
        : '<span class="kbd" id="kbd">Press Enter to continue</span>') +
      '<button type="button" class="btn primary" id="next">' +
      (S === n - 1 ? 'Finish Lesson' : 'Continue') +
      '</button></div></nav>' +
      '</section>'
    var el = document.getElementById('step')
    render[step.type](step, s, el)
    var ta = document.getElementById('note-' + S)
    if (ta) {
      ta.value = notes[key(S)] || ''
      ta.addEventListener('input', function () {
        notes[key(S)] = ta.value
        store.set('notes', notes)
      })
    }
    document.getElementById('back').addEventListener('click', function () {
      go(-1)
    })
    document.getElementById('next').addEventListener('click', function () {
      go(1)
    })
    var skip = document.getElementById('skip')
    if (skip)
      skip.addEventListener('click', function () {
        go(1, true)
      })
    refreshNav()
    if (focus) el.focus({ preventScroll: false })
  }

  function refreshNav() {
    var next = document.getElementById('next')
    if (!next) return
    var ok = !!st().done
    next.disabled = !ok
    var k = document.getElementById('kbd')
    if (k) k.hidden = !ok
  }

  function go(d, force) {
    var n = pack().steps.length
    if (d > 0 && !st().done && !force) return
    if (d > 0 && S === n - 1) {
      finished = true
      draw(true)
      return
    }
    S = Math.max(0, Math.min(n - 1, S + d))
    store.set('step:' + pack().id, S)
    draw(true)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  function notesText() {
    var lines = []
    LESSONS.forEach(function (x) {
      var p = x.pack,
        mine = []
      p.steps.forEach(function (s, i) {
        var t = (notes[p.id + ':' + i] || '').trim()
        if (t) mine.push('Step ' + (i + 1) + ' (' + STAGE[s.stage] + '): ' + t)
      })
      if (mine.length) lines.push(p.id + ' · ' + p.title, ...mine, '')
    })
    return lines.length ? 'Lesson review notes\n\n' + lines.join('\n') : ''
  }

  function drawDone(main) {
    var p = pack(),
      next = LESSONS[L + 1]
    var txt = notesText()
    main.innerHTML =
      '<section class="lesson"><div class="crumbs"><span class="track">' +
      esc(TRACK[p.track] || p.track) +
      '</span> · Module ' +
      p.module +
      ' · Lesson ' +
      p.lesson +
      '</div>' +
      '<article class="step done" id="step" tabindex="-1"><h2>Lesson complete</h2><div class="prose"><p>You finished <strong>' +
      esc(p.title) +
      "</strong>. In the app, this is where progress saves and the review cards join the learner's daily review.</p></div>" +
      '<div class="actions">' +
      (next
        ? '<button type="button" class="btn primary" id="nextlesson">Next: ' +
          esc(next.pack.title) +
          '</button>'
        : '') +
      '<button type="button" class="btn" id="again">Start This Lesson Again</button></div>' +
      '<h2 style="font-size:18px!important">Your review notes</h2>' +
      (txt
        ? '<div class="actions"><button type="button" class="btn" id="copy">Copy All Notes</button><span class="status" id="copied" aria-live="polite"></span></div><textarea class="copybox" id="copybox" readonly aria-label="All review notes">' +
          esc(txt) +
          '</textarea>'
        : '<div class="prose"><p>No notes yet. Turn on Reviewer Mode to add a note to any step. Copy them here and send them to the author.</p></div>') +
      '</article></section>'
    var n = document.getElementById('nextlesson')
    if (n)
      n.addEventListener('click', function () {
        document.getElementById('lesson-pick').value = String(L + 1)
        openLesson(L + 1)
      })
    document.getElementById('again').addEventListener('click', function () {
      pack().steps.forEach(function (_, i) {
        delete state[key(i)]
      })
      S = 0
      store.set('step:' + pack().id, 0)
      finished = false
      draw(true)
    })
    var c = document.getElementById('copy')
    if (c)
      c.addEventListener('click', function () {
        var box = document.getElementById('copybox'),
          out = document.getElementById('copied')
        var fallback = function () {
          box.focus()
          box.select()
          out.textContent = 'Selected. Copy it with your keyboard or the Copy menu.'
        }
        try {
          navigator.clipboard.writeText(txt).then(function () {
            out.textContent = 'Copied'
          }, fallback)
        } catch (e) {
          fallback()
        }
      })
    document.getElementById('step').focus()
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' || e.target.closest('input, textarea, select, button, a, .lab')) return
    var next = document.getElementById('next')
    if (next && !next.disabled) {
      e.preventDefault()
      go(1)
    }
  })

  shell()
  openLesson(L)
})()
