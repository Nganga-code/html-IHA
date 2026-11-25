// INTERNATIONAL HERB AFRICA — shared safe page interactions
// No credentials or identity documents are transmitted or stored in this demo.
document.addEventListener('DOMContentLoaded', function () {
  const ageGate = document.getElementById('ageGate');
  const ageConfirm = document.getElementById('ageConfirm');
  const enterButton = document.getElementById('enterButton');
  const ageError = document.getElementById('ageError');
  const siteContent = document.getElementById('siteContent');
  if (ageGate && ageConfirm && enterButton) {
    document.body.classList.add('no-scroll');
    enterButton.disabled = !ageConfirm.checked;
    ageConfirm.addEventListener('change', function () {
      enterButton.disabled = !ageConfirm.checked;
      if (ageError) ageError.textContent = '';
    });
    enterButton.addEventListener('click', function () {
      if (!ageConfirm.checked) {
        if (ageError) ageError.textContent = 'Please confirm the age requirement first.';
        return;
      }
      ageGate.hidden = true;
      if (siteContent) siteContent.setAttribute('aria-hidden', 'false');
      document.body.classList.remove('no-scroll');
    });
  }
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    });
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation menu');
      });
    });
  }
  const currentYear = document.getElementById('currentYear');
  if (currentYear) currentYear.textContent = new Date().getFullYear();
  document.querySelectorAll('[data-toggle-password]').forEach(function (button) {
    button.addEventListener('click', function () {
      const input = document.getElementById(button.dataset.togglePassword);
      if (!input) return;
      const visible = input.type === 'password';
      input.type = visible ? 'text' : 'password';
      button.textContent = visible ? 'Hide' : 'Show';
      button.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
      button.setAttribute('aria-pressed', String(visible));
    });
  });
  const roleSelect = document.getElementById('account-type');
  const roleDescription = document.getElementById('role-description');
  if (roleSelect && roleDescription) {
    const descriptions = {
      customer: 'Browse eligible products and marketplace services.',
      vendor: 'Apply to sell eligible products. Business documents and administrator approval will be required.',
      driver: 'Apply as a delivery partner. Identity and driver documentation will be required.'
    };
    roleSelect.addEventListener('change', function () {
      roleDescription.textContent = descriptions[roleSelect.value] || '';
    });
  }
  document.querySelectorAll('form[data-auth-demo]').forEach(function (form) {
    const confirmation = form.elements.namedItem('confirmPassword');
    if (confirmation) confirmation.addEventListener('input', function () { confirmation.setCustomValidity(''); });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const feedback = form.querySelector('.feedback');
      if (form.dataset.authDemo === 'register') {
        const password = form.elements.namedItem('password');
        if (password && confirmation && password.value !== confirmation.value) {
          confirmation.setCustomValidity('Passwords do not match.');
          confirmation.reportValidity();
          if (feedback) feedback.textContent = 'Please make sure both passwords match.';
          return;
        }
        if (confirmation) confirmation.setCustomValidity('');
      }
      if (feedback) feedback.textContent = form.dataset.authDemo === 'reset' ? 'Demo only: no reset email was sent. Email delivery will be enabled with Django.' : 'Demo only: no account was created, and no information was sent or stored.';
    });
  });
});

// IHA PHASE 2 — public-page interactions; existing auth code remains above.
document.addEventListener('DOMContentLoaded', function () {
  // The splash is a first-visit introduction only. localStorage is not age verification.
  if (document.body.classList.contains('iha-splash')) {
    const enter = document.getElementById('splashEnter');
    const timerLabel = document.getElementById('splashTimer');
    const key = 'iha-splash-seen-v1';
    let seen = false;
    try { seen = localStorage.getItem(key) === 'yes'; } catch (_) {}
    const proceed = function () {
      try { localStorage.setItem(key, 'yes'); } catch (_) {}
      window.location.replace('index.html');
    };
    if (seen) { proceed(); return; }
    if (enter) enter.addEventListener('click', function () { try { localStorage.setItem(key, 'yes'); } catch (_) {} });
    let seconds = 4;
    const countdown = window.setInterval(function () {
      seconds -= 1;
      if (seconds <= 0) { window.clearInterval(countdown); proceed(); }
      else if (timerLabel) timerLabel.textContent = 'Continuing in ' + seconds + ' seconds…';
    }, 1000);
  }
  const search = document.getElementById('productSearch');
  const category = document.getElementById('categoryFilter');
  const products = Array.from(document.querySelectorAll('[data-product]'));
  if (search && category) {
    const update = function () {
      const q = search.value.trim().toLowerCase();
      const c = category.value;
      let count = 0;
      products.forEach(function (card) {
        const match = card.dataset.name.includes(q) && (c === 'all' || c === card.dataset.category);
        card.hidden = !match;
        if (match) count++;
      });
      const label = document.getElementById('productCount');
      if (label) label.textContent = count + ' sample product' + (count === 1 ? '' : 's');
      const empty = document.getElementById('productEmpty');
      if (empty) empty.hidden = count !== 0;
    };
    search.addEventListener('input', update);
    category.addEventListener('change', update);
  }
  const dialog = document.getElementById('productDialog');
  if (dialog) {
    document.querySelectorAll('[data-demo-product]').forEach(function (button) {
      button.addEventListener('click', function () {
        document.getElementById('dialogProductTitle').textContent = button.dataset.demoProduct;
        if (typeof dialog.showModal === 'function') dialog.showModal();
      });
    });
    ['closeProductDialog', 'dialogDismiss'].forEach(function (id) {
      const button = document.getElementById(id);
      if (button) button.addEventListener('click', function () { dialog.close(); });
    });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  }
  const contact = document.getElementById('contactForm');
  if (contact) contact.addEventListener('submit', function (event) {
    event.preventDefault();
    document.getElementById('contactFeedback').textContent = 'Preview only — your message has not been sent or saved. Please use the email or WhatsApp contact link.';
  });
  // Browser-only address prototype. Never enter real addresses in this demo.
  const addressForm = document.getElementById('addressForm');
  if (addressForm) {
    const key = 'iha-demo-addresses-v1';
    const list = document.getElementById('addressList');
    const feedback = document.getElementById('addressFeedback');
    let addresses = [];
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || '[]');
      if (Array.isArray(parsed)) addresses = parsed.filter(function (a) { return a && typeof a.id === 'string'; }).slice(0, 20);
    } catch (_) {}
    const save = function () {
      try { localStorage.setItem(key, JSON.stringify(addresses)); return true; }
      catch (_) { feedback.textContent = 'Browser storage is unavailable. Your changes are temporary.'; return false; }
    };
    const clear = function () {
      addressForm.reset();
      document.getElementById('addressId').value = '';
      document.getElementById('addressFormTitle').textContent = 'Add a sample address';
    };
    const makeButton = function (label, action, id) {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = label;
      b.addEventListener('click', function () { action(id); }); return b;
    };
    const render = function () {
      list.replaceChildren();
      document.getElementById('addressCount').textContent = addresses.length + ' saved';
      if (!addresses.length) {
        const empty = document.createElement('p'); empty.className = 'no-addresses';
        empty.textContent = 'No demo addresses yet. Use the form to add one.'; list.append(empty); return;
      }
      addresses.forEach(function (a) {
        const article = document.createElement('article'); article.className = 'saved-address';
        const heading = document.createElement('h3'); heading.textContent = a.label + (a.default ? ' · Default' : '');
        const details = document.createElement('p');
        details.textContent = [a.street, a.unit, a.city, a.province, a.postal].filter(Boolean).join(', ');
        const actions = document.createElement('div'); actions.className = 'address-actions';
        actions.append(makeButton('Edit', edit, a.id));
        if (!a.default) actions.append(makeButton('Set default', setDefault, a.id));
        actions.append(makeButton('Delete', remove, a.id));
        article.append(heading, details, actions); list.append(article);
      });
    };
    const edit = function (id) {
      const a = addresses.find(function (x) { return x.id === id; }); if (!a) return;
      ['id','label','street','unit','city','postal','province'].forEach(function (field) {
        addressForm.elements.namedItem(field).value = a[field] || '';
      });
      document.getElementById('addressDefault').checked = !!a.default;
      document.getElementById('addressFormTitle').textContent = 'Edit sample address';
      addressForm.scrollIntoView({behavior:'smooth',block:'start'});
    };
    const setDefault = function (id) {
      addresses.forEach(function (a) { a.default = a.id === id; }); save(); render();
    };
    const remove = function (id) {
      if (!window.confirm('Delete this demo address?')) return;
      const removedDefault = addresses.some(function (a) { return a.id === id && a.default; });
      addresses = addresses.filter(function (a) { return a.id !== id; });
      if (removedDefault && addresses.length) addresses[0].default = true;
      save(); render(); clear();
    };
    addressForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const fd = new FormData(addressForm);
      const id = String(fd.get('id') || '') || ('demo-' + Date.now() + '-' + Math.random().toString(36).slice(2,7));
      const entry = { id:id, label:String(fd.get('label')||''), street:String(fd.get('street')||'').trim(), unit:String(fd.get('unit')||'').trim(), city:String(fd.get('city')||'').trim(), postal:String(fd.get('postal')||'').trim(), province:String(fd.get('province')||''), default:!!fd.get('default') };
      if (!/^\d{4}$/.test(entry.postal)) { feedback.textContent = 'Please enter a four-digit postal code.'; return; }
      const index = addresses.findIndex(function (a) { return a.id === id; });
      if (index < 0 && addresses.length >= 20) { feedback.textContent = 'Demo limit: 20 addresses.'; return; }
      if (index >= 0) addresses[index] = entry; else addresses.push(entry);
      if (entry.default || addresses.length === 1) {
        addresses.forEach(function (a) { a.default = a.id === id; });
      } else if (!addresses.some(function (a) { return a.default; })) addresses[0].default = true;
      const stored = save(); render(); clear();
      if (stored) feedback.textContent = 'Demo address saved in this browser only.';
    });
    document.getElementById('cancelAddressEdit').addEventListener('click', function () { clear(); feedback.textContent = ''; });
    render();
  }
});


/* PHASE 3 — illustrative, non-transactional shopping and finance UI */
(function(){
'use strict';
const catalog=[{id:'tea',name:'Botanical Tea Sampler',price:120,icon:'🍵',category:'Tea'},{id:'cup',name:'Reusable Travel Cup',price:95,icon:'🥤',category:'Accessories'},{id:'tote',name:'Natural Fibre Tote',price:180,icon:'👜',category:'Lifestyle'},{id:'infuser',name:'Tea Infuser Set',price:145,icon:'🫖',category:'Accessories'},{id:'journal',name:'Wellness Journal',price:110,icon:'📓',category:'Lifestyle'},{id:'gift',name:'Herbal Gift Box (non-restricted)',price:250,icon:'🎁',category:'Tea'}];
const money=n=>'R '+Number(n).toLocaleString('en-ZA',{minimumFractionDigits:2,maximumFractionDigits:2});
const key='iha_phase3_demo_cart';
function readCart(){try{const x=JSON.parse(localStorage.getItem(key)||'{}');if(!x||typeof x!=='object'||Array.isArray(x))return {};return Object.fromEntries(Object.entries(x).filter(([id,q])=>catalog.some(p=>p.id===id)&&Number.isInteger(q)&&q>0&&q<=99));}catch{return {};}}
function saveCart(c){try{localStorage.setItem(key,JSON.stringify(c));}catch{} updateBadge();}
function updateBadge(){const n=Object.values(readCart()).reduce((a,b)=>a+b,0);document.querySelectorAll('[data-cart-count]').forEach(e=>e.textContent=String(n));}
function subtotal(c){return catalog.reduce((s,p)=>s+p.price*(c[p.id]||0),0);}
function renderCart(){const el=document.getElementById('cartItems');if(!el)return;const c=readCart();el.replaceChildren();for(const product of catalog.filter(p=>c[p.id])){const row=document.createElement('div');row.className='iha-row';const info=document.createElement('div');const title=document.createElement('strong');title.textContent=product.icon+' '+product.name;const price=document.createElement('div');price.className='iha-muted';price.textContent=money(product.price)+' each';info.append(title,price);const qty=document.createElement('div');qty.className='iha-qty';const minus=document.createElement('button');minus.type='button';minus.textContent='−';minus.setAttribute('aria-label','Remove one '+product.name);const value=document.createElement('span');value.textContent=c[product.id];const plus=document.createElement('button');plus.type='button';plus.textContent='+';plus.setAttribute('aria-label','Add one '+product.name);const remove=document.createElement('button');remove.type='button';remove.textContent='Remove';remove.className='outline-button';minus.onclick=()=>change(product.id,-1);plus.onclick=()=>change(product.id,1);remove.onclick=()=>{const next=readCart();delete next[product.id];saveCart(next);renderCart();};qty.append(minus,value,plus,remove);row.append(info,qty);el.append(row);}if(!el.children.length){const msg=document.createElement('p');msg.textContent='Your demo cart is empty. Browse the marketplace to add sample items.';el.append(msg);}const total=document.getElementById('cartSubtotal');if(total)total.textContent=money(subtotal(c));const count=document.getElementById('cartTotalItems');if(count)count.textContent=String(Object.values(c).reduce((a,b)=>a+b,0));}
function change(id,delta){const c=readCart();const q=Math.min(99,Math.max(0,(c[id]||0)+delta));if(q)c[id]=q;else delete c[id];saveCart(c);renderCart();}
function setupCatalog(){const el=document.getElementById('phase3Products');if(!el)return;const query=document.getElementById('phase3Search');const category=document.getElementById('phase3Category');const status=document.getElementById('phase3Status');function render(){el.replaceChildren();const q=(query?.value||'').trim().toLowerCase();const matches=catalog.filter(p=>(!q||(p.name+' '+p.category).toLowerCase().includes(q))&&(!category||category.value==='all'||category.value===p.category));for(const product of matches){const card=document.createElement('article');card.className='iha-mini-card';const emoji=document.createElement('div');emoji.className='emoji';emoji.textContent=product.icon;const name=document.createElement('h3');name.textContent=product.name;const description=document.createElement('p');description.textContent=product.category+' · Sample, non-restricted merchandise';const price=document.createElement('strong');price.textContent=money(product.price);const button=document.createElement('button');button.className='iha-btn';button.textContent='Add to demo cart';button.onclick=()=>{change(product.id,1);if(status)status.textContent=product.name+' added to the demo cart.';};card.append(emoji,name,description,price,button);el.append(card);}if(!matches.length)el.textContent='No matching sample products.';}query?.addEventListener('input',render);category?.addEventListener('change',render);const params=new URLSearchParams(location.search);if(query&&params.has('q'))query.value=params.get('q').slice(0,100);render();}
function setupSearch(){document.querySelectorAll('[data-site-search]').forEach(form=>form.addEventListener('submit',event=>{event.preventDefault();const input=form.querySelector('input[name=q]');location.href='marketplace.html?q='+encodeURIComponent((input?.value||'').trim());}));}
function setupCheckout(){const form=document.getElementById('demoCheckout');if(!form)return;const c=readCart();const total=document.getElementById('checkoutSubtotal');if(total)total.textContent=money(subtotal(c));const submit=form.querySelector('button[type=submit]');if(submit)submit.disabled=!Object.keys(c).length;form.addEventListener('submit',e=>{e.preventDefault();document.getElementById('checkoutFeedback').textContent='Demo only: no order was submitted and no payment was collected. Real checkout requires authenticated accounts, age and product checks, and a payment provider.';});}
function setupForms(){document.querySelectorAll('[data-demo-finance-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const target=document.getElementById(form.dataset.feedback);if(target)target.textContent='Preview only. Nothing was submitted, saved or sent. A secure backend is required.';form.reset();}));}
function setupWallet(){const tabs=document.querySelectorAll('[data-wallet-role]');if(!tabs.length)return;const info={customer:['R 150.00','Store credits','Refund credit + R 150.00'],vendor:['R 8,450.00','Illustrative earnings','Sample sale + R 1,200.00'],driver:['R 640.00','Illustrative earnings','Sample trip + R 40.00']};tabs.forEach(button=>button.addEventListener('click',()=>{tabs.forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});const v=info[button.dataset.walletRole];document.getElementById('walletAmount').textContent=v[0];document.getElementById('walletLabel').textContent=v[1];document.getElementById('walletTransaction').textContent=v[2];}));}
document.addEventListener('DOMContentLoaded',()=>{setupSearch();setupCatalog();renderCart();setupCheckout();setupForms();setupWallet();updateBadge();});
})();
