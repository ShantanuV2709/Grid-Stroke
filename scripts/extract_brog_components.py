from playwright.sync_api import sync_playwright
import json

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=r'C:\Program Files\Google\Chrome\Application\chrome.exe', headless=True)
    page = browser.new_page(viewport={'width': 1440, 'height': 900})
    page.goto('https://brog.framer.website/', wait_until='domcontentloaded')
    page.wait_for_timeout(3000)

    # Extract detailed data for:
    # 1. Navbar
    # 2. Hero & Introduction
    # 3. Numbers / Commitment
    # 4. Brands rail
    # 5. Works cards
    # 6. Why choose cards
    # 7. Services list
    # 8. FAQ items
    # 9. Footer
    details = page.evaluate('''() => {
        function getComputed(el) {
            if (!el) return null;
            const cs = window.getComputedStyle(el);
            return {
                tag: el.tagName,
                class: el.className,
                bg: cs.backgroundColor,
                color: cs.color,
                font: cs.fontFamily,
                fontSize: cs.fontSize,
                fontWeight: cs.fontWeight,
                lineHeight: cs.lineHeight,
                letterSpacing: cs.letterSpacing,
                borderRadius: cs.borderRadius,
                border: cs.border,
                padding: cs.padding,
                margin: cs.margin,
                text: el.innerText ? el.innerText.trim().replace(/\\s+/g, ' ') : ''
            };
        }

        // Works card example
        const workCard = document.querySelector('[data-framer-name="Works"] [data-framer-name="Desktop"]');
        
        // Service row example
        const serviceRow = document.querySelector('[data-framer-name="Service"] [data-framer-name="Desktop"]');
        
        // Why choose card example
        const whyCard = document.querySelector('[data-framer-name="Why Choose"] [data-framer-name="Why Choose"]');

        // FAQ item example
        const faqItem = document.querySelector('[data-framer-name="FAQ"] [data-framer-name="Desktop"]');

        // Number card example
        const numberSection = document.querySelector('[data-framer-name="Numbers"]');

        return {
            workCard: getComputed(workCard),
            serviceRow: getComputed(serviceRow),
            whyCard: getComputed(whyCard),
            faqItem: getComputed(faqItem),
            numberSection: getComputed(numberSection)
        };
    }''')
    
    with open('content/brog_components.json', 'w', encoding='utf-8') as f:
        json.dump(details, f, indent=2)
    print(json.dumps(details, indent=2))
    browser.close()

