/* Health App revamp — SIMULATED feature previews.
   All data below is fake, generated in the browser only, to demonstrate
   the interactions the final website will showcase with real product data. */
(function () {
  'use strict';
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e }

  /* ---------- OPD: live token queue ---------- */
  function opdDemo() {
    var root = document.querySelector('#tokBoard'); if (!root) return;
    var docs = [
      { name: 'Dr. Meera Rao', spec: 'General Medicine', serving: 42, waiting: 5 },
      { name: 'Dr. Arjun Nair', spec: 'Paediatrics', serving: 17, waiting: 2 },
      { name: 'Dr. Kavitha', spec: 'Ortho', serving: 8, waiting: 7 }
    ];
    var tick = document.createElement('p'); tick.className = 'demo-tick';
    function render() {
      root.innerHTML = '';
      docs.forEach(function (d) {
        root.appendChild(el('div', 'tok-card',
          '<div class="tok-top"><b>' + d.name + '</b><span class="dot on"></span></div>' +
          '<span class="tok-spec">' + d.spec + '</span>' +
          '<div class="tok-now">Now serving <b>#' + d.serving + '</b></div>' +
          '<div class="tok-meta">' + d.waiting + ' waiting · ~' + (d.waiting * 7) + ' min</div>'));
      });
      tick.textContent = 'Running token status updates live · last change ' + new Date().toLocaleTimeString('en-IN');
    }
    root.parentNode.appendChild(tick); render();
    setInterval(function () {
      var d = docs[Math.floor(Math.random() * docs.length)];
      d.serving++; if (d.waiting > 0 && Math.random() > .6) d.waiting--;
      render();
    }, 4000);
  }

  /* ---------- IPD: bed availability board ---------- */
  function ipdDemo() {
    var root = document.querySelector('#bedBoard'); if (!root) return;
    var floors = [
      { f: 'Floor 1 · General', beds: ['occupied','available','occupied','cleaning','available','occupied','occupied','available'] },
      { f: 'Floor 2 · Private', beds: ['available','occupied','available','available','occupied','cleaning','available','available'] }
    ];
    function render() {
      root.innerHTML = '';
      var free = 0;
      floors.forEach(function (fl) {
        var row = el('div', 'floor');
        row.appendChild(el('div', 'floor-name', fl.f));
        var grid = el('div', 'bed-grid');
        fl.beds.forEach(function (st, i) {
          if (st === 'available') free++;
          grid.appendChild(el('span', 'bed ' + st, 'B' + (i + 1)));
        });
        row.appendChild(grid); root.appendChild(row);
      });
      root.appendChild(el('p', 'demo-tick', free + ' beds available now · the real product shows live ward status'));
    }
    render();
    setInterval(function () {
      var fl = floors[Math.floor(Math.random() * floors.length)];
      var i = Math.floor(Math.random() * fl.beds.length);
      fl.beds[i] = fl.beds[i] === 'occupied' ? 'cleaning' : (fl.beds[i] === 'cleaning' ? 'available' : 'occupied');
      render();
    }, 6000);
  }

  /* ---------- Appointments: booking + live token tracking ---------- */
  function apptDemo() {
    var root = document.querySelector('#bookFlow'); if (!root) return;
    root.innerHTML =
      '<div class="book-form">' +
      '<label>Patient name<input id="bkName" placeholder="e.g. Priya S." /></label>' +
      '<label>Doctor<select id="bkDoc"><option>Dr. Meera Rao — General Medicine</option><option>Dr. Arjun Nair — Paediatrics</option><option>Dr. Kavitha — Ortho</option></select></label>' +
      '<label>Date<input id="bkDate" type="date" /></label>' +
      '<div class="slots" id="bkSlots"></div>' +
      '<button class="btn btn-p" id="bkGo">Get my token</button></div>' +
      '<div id="bkOut"></div>';
    var slots = root.querySelector('#bkSlots');
    ['09:00', '09:20', '09:40', '10:00', '10:20', '11:00'].forEach(function (t) {
      var b = el('button', 'slot', t); b.type = 'button';
      b.onclick = function () { [].forEach.call(slots.children, function (c) { c.classList.remove('sel') }); b.classList.add('sel') };
      slots.appendChild(b);
    });
    var d = new Date(); d.setDate(d.getDate() + 1);
    root.querySelector('#bkDate').value = d.toISOString().slice(0, 10);
    root.querySelector('#bkGo').onclick = function () {
      var name = root.querySelector('#bkName').value || 'Patient';
      var slot = root.querySelector('.slot.sel');
      var token = 'A-' + String(Math.floor(Math.random() * 90) + 10);
      var ahead = 3;
      root.querySelector('#bkOut').innerHTML =
        '<div class="confirm-card"><b>Booked ✓</b>' +
        '<p>' + name + ' · ' + (slot ? slot.textContent : '09:40') + ' · ' + root.querySelector('#bkDate').value + '</p>' +
        '<p>Your token: <b>' + token + '</b> · <span id="bkAhead">' + ahead + ' ahead of you</span></p>' +
        '<p class="demo-tick">Live token tracking — like the patient booking page in the real product</p></div>';
      var span = root.querySelector('#bkAhead');
      var iv = setInterval(function () {
        if (!document.body.contains(span)) { clearInterval(iv); return }
        if (ahead > 0) { ahead--; span.textContent = ahead + ' ahead of you' }
        else { span.textContent = 'It is your turn now'; clearInterval(iv) }
      }, 5000);
    };
  }

  /* ---------- Billing: invoice with GST ---------- */
  function billDemo() {
    var root = document.querySelector('#invoiceDemo'); if (!root) return;
    var items = [
      { n: 'OPD Consultation', p: 300, c: true },
      { n: 'Medicines (2 days)', p: 150, c: true },
      { n: 'Dressing', p: 200, c: false }
    ];
    root.innerHTML = '<div class="inv"><h3>Sample final bill</h3><div id="invLines"></div><label class="gst"><input type="checkbox" id="gTog" /> Apply GST 18%</label></div>';
    var gTog = root.querySelector('#gTog');
    function render() {
      var sub = items.filter(function (i) { return i.c }).reduce(function (a, i) { return a + i.p }, 0);
      var g = gTog.checked ? Math.round(sub * .18) : 0;
      root.querySelector('#invLines').innerHTML = items.map(function (i) {
        return '<div class="inv-line"><label><input type="checkbox" data-n="' + i.n + '" ' + (i.c ? 'checked' : '') + '/> ' + i.n + '</label><span>₹' + i.p + '</span></div>';
      }).join('') + '<div class="inv-total inv-line"><label><b>Total' + (g ? ' incl. GST' : '') + '</b></label><span>₹' + (sub + g) + '</span></div>';
      root.querySelectorAll('#invLines input[type=checkbox]').forEach(function (cb) {
        cb.onchange = function () {
          items.forEach(function (it) { if (it.n === cb.dataset.n) it.c = cb.checked });
          render();
        };
      });
    }
    gTog.onchange = render;
    render();
  }

  /* ---------- HR: punch clock ---------- */
  function hrDemo() {
    var root = document.querySelector('#punchDemo'); if (!root) return;
    var inAt = null, workedIv = null;
    root.innerHTML = '<div class="punch"><span id="clock"></span><button class="btn btn-p" id="pBtn">Punch in</button><span id="worked"></span></div><ul class="att-log" id="attLog"><li>09:02 — punched in ✓</li><li>13:40 — punched out ✓</li></ul>';
    var clock = root.querySelector('#clock');
    setInterval(function () { clock.textContent = new Date().toLocaleTimeString('en-IN') }, 1000);
    clock.textContent = new Date().toLocaleTimeString('en-IN');
    var btn = root.querySelector('#pBtn');
    btn.onclick = function () {
      var now = new Date().toLocaleTimeString('en-IN');
      if (!inAt) {
        inAt = Date.now(); btn.textContent = 'Punch out';
        root.querySelector('#attLog').insertAdjacentHTML('afterbegin', '<li>' + now + ' — punched in ✓</li>');
        workedIv = setInterval(function () {
          if (!inAt) return;
          root.querySelector('#worked').textContent = 'Working: ' + Math.round((Date.now() - inAt) / 60000) + ' min';
        }, 30000);
      } else {
        var mins = Math.round((Date.now() - inAt) / 60000);
        btn.textContent = 'Punch in';
        root.querySelector('#attLog').insertAdjacentHTML('afterbegin', '<li>' + now + ' — punched out ✓ (' + mins + ' min)</li>');
        root.querySelector('#worked').textContent = '';
        inAt = null; clearInterval(workedIv);
      }
    };
  }

  /* ---------- Pharmacy: stock table ---------- */
  function pharmDemo() {
    var root = document.querySelector('#stockDemo'); if (!root) return;
    var meds = [
      { n: 'Paracetamol 500mg', b: 'P-1024', s: 120 },
      { n: 'Amoxicillin 250mg', b: 'A-331', s: 18 },
      { n: 'ORS sachets', b: 'O-77', s: 60 },
      { n: 'Cetirizine 10mg', b: 'C-590', s: 6 }
    ];
    function badge(s) { return s === 0 ? '<span class="st out">OUT</span>' : s < 15 ? '<span class="st low">LOW</span>' : '<span class="st ok">OK</span>' }
    root.innerHTML = '<table class="stock"><tr><th>Medicine</th><th>Batch</th><th>Stock</th><th>Status</th></tr>' +
      meds.map(function (m) { return '<tr><td>' + m.n + '</td><td>' + m.b + '</td><td>' + m.s + '</td><td>' + badge(m.s) + '</td></tr>' }).join('') + '</table>' +
      '<p class="demo-tick">Low-stock alerts like this connect pharmacy inventory to your billing flow.</p>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    opdDemo(); ipdDemo(); apptDemo(); billDemo(); hrDemo(); pharmDemo();
  });
})();
