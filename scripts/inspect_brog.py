import json

with open('content/brog_full_dom.json', encoding='utf-8') as f:
    dom = json.load(f)

def print_summary(node, indent=0):
    if not node or indent > 3: return
    fn = node.get('framerName')
    txt = node.get('text')
    tag = node.get('tag')
    rect = node.get('rect', {})
    st = node.get('styles', {})
    
    desc = f"{tag}"
    if fn: desc += f" [name={fn}]"
    if rect: desc += f" ({rect.get('w')}x{rect.get('h')}, top={rect.get('top')})"
    if st.get('bg') and st.get('bg') != 'rgba(0, 0, 0, 0)': desc += f" bg={st.get('bg')}"
    if st.get('font'): desc += f" font={st.get('font')[:20]} {st.get('fontSize')}"
    if txt: desc += f" '{txt[:35]}'"
    
    print('  ' * indent + desc)
    for c in node.get('children', []):
        print_summary(c, indent + 1)

print_summary(dom)

