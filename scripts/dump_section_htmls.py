from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('https://brog.framer.website/', wait_until='domcontentloaded')
    page.wait_for_timeout(3000)

    # Let's inspect the exact innerHTML and structure of:
    # 1. Hero / Introduction
    # 2. Section (01) Commitment
    # 3. Section (02) Works
    # 4. Section (03) Why Choose
    # 5. Section (04) Services
    # 6. Section (05) FAQ
    # 7. Footer
    sections = ['Introduction', 'Numbers', 'Brands', 'Works', 'Why Choose', 'Service', 'FAQ', 'Footer']
    for s in sections:
        html = page.evaluate(f'''() => {{
            const el = document.querySelector('[data-framer-name="{s}"]');
            return el ? el.outerHTML : 'NOT FOUND';
        }}''')
        with open(f'content/brog_raw_{s.lower().replace(" ", "_")}.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print(f'Saved {s} (length: {len(html)})')
    browser.close()

