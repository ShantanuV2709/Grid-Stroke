from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    print('Navigating...')
    page.goto('https://brog.framer.website/', wait_until='domcontentloaded', timeout=20000)
    page.wait_for_timeout(3000)

    data = page.evaluate('''() => {
        const results = [];
        const all = document.querySelectorAll('*');
        for (const el of all) {
            const name = el.getAttribute('data-framer-name');
            if (!name) continue;
            
            if (['Hero', 'Introduction', 'Numbers', 'Brands', 'Works', 'Why Choose', 'Service', 'FAQ', 'Footer', 'Navigation', 'Desktop'].includes(name)) {
                const rect = el.getBoundingClientRect();
                const cs = window.getComputedStyle(el);
                results.push({
                    name: name,
                    tag: el.tagName,
                    y: Math.round(rect.top + window.scrollY),
                    w: Math.round(rect.width),
                    h: Math.round(rect.height),
                    bg: cs.backgroundColor,
                    display: cs.display,
                    text: el.innerText ? el.innerText.trim().slice(0, 100).replace(/\\n/g, ' ') : ''
                });
            }
        }
        return results;
    }''')
    
    with open('content/brog_sections_detailed.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    print(f'Found {len(data)} named elements:')
    for d in data:
        print(f"{d['name']:15} y={d['y']:4} w={d['w']:4} h={d['h']:4} bg={d['bg']} text={d['text'][:40]}")
    browser.close()
