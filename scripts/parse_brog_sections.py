from bs4 import BeautifulSoup
import re

sections = ['introduction', 'numbers', 'brands', 'works', 'why_choose', 'service', 'faq', 'footer']

for s in sections:
    print(f"\n==================== SECTION: {s.upper()} ====================")
    with open(f'content/brog_raw_{s}.html', encoding='utf-8') as f:
        soup = BeautifulSoup(f.read(), 'html.parser')
    
    # Extract all text blocks with their tag and classes
    for tag in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'a']):
        text = tag.get_text(strip=True)
        if text and len(text) > 1 and not tag.find(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p']):
            print(f"<{tag.name}> {text}")

