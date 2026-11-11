import urllib.request
import json
import re

url = "https://brog.framer.website/"
req = urllib.request.Request(
    url, 
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
)

try:
    with urllib.request.urlopen(req, timeout=15) as response:
        html = response.read().decode('utf-8')
        with open('content/brog_raw.html', 'w', encoding='utf-8') as f:
            f.write(html)
        print(f"Successfully downloaded brog_raw.html ({len(html)} bytes)")
except Exception as e:
    print(f"Error downloading brog: {e}")

