INTERNATIONAL HERB AFRICA — FRONTEND PHASE 2

This package includes your existing Phase 1 pages and updated authentication files, plus the new splash, marketplace, contact and addressbook pages.

SETUP
1. Back up your current IHA folder.
2. Extract this ZIP to a new folder. Open the folder in VS Code.
3. Start Live Server and open splash.html.
4. First visit: click Enter Experience or wait 4 seconds. Subsequent visits to splash.html skip automatically.
5. Navigate to marketplace.html, contact.html and addressbook.html.
6. To retest first-time splash, in browser DevTools > Application > Local Storage delete iha-splash-seen-v1, or use a private window.

Important: open splash.html as the website entry point. Static hosting can later redirect the site root to splash.html for first-time users; index.html itself remains the homepage.

FRONTEND ONLY
No real products, accounts, checkout, messages, or password-reset emails are operational.
Address-book entries are stored in browser localStorage ONLY, unencrypted, so use fictional data. They are not authenticated or synced.
No age verification or regulated product sales are implemented.

Files: splash.html, index.html, marketplace.html, contact.html, addressbook.html, other existing pages, css/style.css, js/script.js, assets/iha-logo.png.
