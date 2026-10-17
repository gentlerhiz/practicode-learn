// The runner's sandbox has no network, so pages with JavaScript get a practice one instead (Module 11).
// fetch reaches a small practice API, and emailjs delivers to a simulated inbox under the preview. Every
// request shows in the console, the way DevTools' Network panel lists it. Node runs this file directly in
// the content tools, so it uses only erasable syntax.
//
//   https://api.example.com          answers in about a quarter of a second
//   https://slow-api.example.com     the same API, taking a second and a half
//   https://broken-api.example.com   always 500 Internal Server Error
//   any other address                fails like being offline: TypeError: Failed to fetch
//
// Routes: GET /rates (?base=NGN), GET /weather?city=Lagos, GET /menu, GET /orders, POST /orders (JSON with
// dish and quantity), GET /premium-rates (needs the header X-Api-Key: demo-key-123).
// EmailJS: public key kitchen-public-key, service service_kitchen, template template_contact (from_name,
// reply_to, message).

export const NETWORK = `
(function () {
  window.__pclPending = 0;
  window.__pclNetwork = [];
  var TEXT = { 200: 'OK', 201: 'Created', 400: 'Bad Request', 401: 'Unauthorized', 404: 'Not Found', 405: 'Method Not Allowed', 500: 'Internal Server Error' };
  var USD = { USD: 1, NGN: 1540, GBP: 0.76, EUR: 0.86, GHS: 15.2, KES: 129 };
  var CITIES = {
    lagos: { city: 'Lagos', tempC: 29, condition: 'Light rain', humidity: 82 },
    abuja: { city: 'Abuja', tempC: 31, condition: 'Sunny', humidity: 40 },
    enugu: { city: 'Enugu', tempC: 27, condition: 'Cloudy', humidity: 70 },
    kano: { city: 'Kano', tempC: 34, condition: 'Hot and dusty', humidity: 18 },
    'port harcourt': { city: 'Port Harcourt', tempC: 28, condition: 'Thunderstorms', humidity: 88 }
  };
  var MENU = [
    { id: 1, name: 'Jollof rice', price: 2500 },
    { id: 2, name: 'Ofada stew', price: 2800 },
    { id: 3, name: 'Moi moi', price: 800 },
    { id: 4, name: 'Pepper soup', price: 3000 }
  ];
  var orders = [];
  var round = function (n) { return Number(n.toPrecision(4)); };
  var header = function (init, name) {
    var h = init && init.headers;
    if (!h) return null;
    if (typeof h.get === 'function') return h.get(name);
    for (var k in h) if (k.toLowerCase() === name.toLowerCase()) return h[k];
    return null;
  };
  var route = function (method, url, init) {
    var path = url.pathname.replace(/\\/+$/, '') || '/';
    var q = url.searchParams;
    if (path === '/rates' || path === '/premium-rates') {
      if (method !== 'GET') return [405, { error: 'Use GET for /rates.' }];
      if (path === '/premium-rates' && header(init, 'X-Api-Key') !== 'demo-key-123') return [401, { error: 'Missing or wrong API key.' }];
      var base = (q.get('base') || 'USD').toUpperCase();
      if (!USD[base]) return [400, { error: 'Unknown currency: ' + base }];
      var rates = {};
      for (var c in USD) if (c !== base) rates[c] = round(USD[c] / USD[base]);
      return [200, { base: base, date: '2026-10-17', rates: rates }];
    }
    if (path === '/weather') {
      if (method !== 'GET') return [405, { error: 'Use GET for /weather.' }];
      var city = (q.get('city') || '').trim().toLowerCase();
      if (!city) return [400, { error: 'Add a city, like ?city=Lagos' }];
      return CITIES[city] ? [200, CITIES[city]] : [404, { error: 'City not found' }];
    }
    if (path === '/menu') return method === 'GET' ? [200, MENU] : [405, { error: 'Use GET for /menu.' }];
    if (path === '/orders') {
      if (method === 'GET') return [200, orders];
      if (method !== 'POST') return [405, { error: 'Use GET or POST for /orders.' }];
      var body;
      try { body = JSON.parse(init && typeof init.body === 'string' ? init.body : ''); } catch (e) { return [400, { error: 'Send the order as JSON.' }]; }
      if (!body || typeof body.dish !== 'string' || !body.dish || typeof body.quantity !== 'number' || body.quantity < 1) {
        return [400, { error: 'An order needs a dish and a quantity of 1 or more.' }];
      }
      var order = { id: 101 + orders.length, dish: body.dish, quantity: body.quantity, status: 'received' };
      orders.push(order);
      return [201, order];
    }
    return [404, { error: 'Not found' }];
  };
  var note = function (method, url, result) {
    window.__pclNetwork.push({ method: method, url: url, result: result });
    if (window.__pclShow) window.__pclShow(method + ' ' + url + '  →  ' + result, 'net');
  };
  window.__pclNote = note;
  window.fetch = function (input, init) {
    init = init || {};
    var method = String(init.method || 'GET').toUpperCase();
    var url;
    try { url = new URL(typeof input === 'string' ? input : String(input && input.url ? input.url : input)); }
    catch (e) { return Promise.reject(new TypeError("Failed to execute 'fetch': the address isn't a full URL. Start it with https://")); }
    var host = url.hostname;
    window.__pclPending++;
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        window.__pclPending--;
        if (host !== 'api.example.com' && host !== 'slow-api.example.com' && host !== 'broken-api.example.com') {
          note(method, url.href, 'failed: no connection');
          reject(new TypeError('Failed to fetch'));
          return;
        }
        var r = host === 'broken-api.example.com' ? [500, { error: 'Something went wrong on the server.' }] : route(method, url, init);
        note(method, url.href, r[0] + ' ' + TEXT[r[0]]);
        resolve(new Response(JSON.stringify(r[1]), { status: r[0], statusText: TEXT[r[0]], headers: { 'Content-Type': 'application/json' } }));
      }, host === 'slow-api.example.com' ? 1500 : 250);
    });
  };
})();
`

export const EMAIL = `
(function () {
  window.__pclEmails = [];
  var key = null;
  var inbox = null;
  var deliver = function (p) {
    if (!inbox) {
      inbox = document.createElement('pcl-inbox');
      inbox.setAttribute('role', 'region');
      inbox.setAttribute('aria-label', 'Simulated inbox');
      inbox.style.cssText = 'display:block;margin:16px 0 0;padding:12px;border:1px solid #D6D3E3;border-radius:8px;background:#F7F6FB;color:#15122A;font:14px/1.5 system-ui,sans-serif;text-align:left';
      var h = document.createElement('pcl-line');
      h.style.cssText = 'display:block;font-weight:700;margin-bottom:4px';
      h.textContent = '📬 Simulated inbox · mama.nkechi@example.com';
      inbox.appendChild(h);
      (document.body || document.documentElement).appendChild(inbox);
    }
    var mail = document.createElement('pcl-line');
    mail.style.cssText = 'display:block;padding:8px 0;border-top:1px solid #D6D3E3;white-space:pre-wrap;overflow-wrap:anywhere';
    mail.textContent = 'From: ' + (p.from_name || '(no name)') + ' <' + (p.reply_to || 'no email') + '>\\nSubject: New message from your website\\n\\n' + (p.message || '(empty message)');
    inbox.appendChild(mail);
  };
  var send = function (service, template, params, opts) {
    var publicKey = (opts && (typeof opts === 'string' ? opts : opts.publicKey)) || key;
    var url = 'https://api.emailjs.com/api/v1.0/email/send';
    window.__pclPending++;
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        window.__pclPending--;
        var fail = function (text) { window.__pclNote('POST', url, '400 Bad Request'); reject({ status: 400, text: text }); };
        if (publicKey !== 'kitchen-public-key') return fail('The Public Key is invalid.');
        if (service !== 'service_kitchen') return fail('The service ID is invalid.');
        if (template !== 'template_contact') return fail('The template ID is invalid.');
        var p = {};
        for (var k in params) p[k] = String(params[k]);
        window.__pclEmails.push(p);
        window.__pclNote('POST', url, '200 OK');
        deliver(p);
        resolve({ status: 200, text: 'OK' });
      }, 400);
    });
  };
  window.emailjs = {
    init: function (o) { key = typeof o === 'string' ? o : o && o.publicKey; },
    send: send,
    sendForm: function (service, template, form, opts) {
      var el = typeof form === 'string' ? document.querySelector(form) : form;
      var params = {};
      if (el && el.elements) {
        for (var i = 0; i < el.elements.length; i++) {
          var f = el.elements[i];
          if (f.name) params[f.name] = f.value;
        }
      }
      return send(service, template, params, opts);
    }
  };
})();
`
