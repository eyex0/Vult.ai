from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
import requests, xml.etree.ElementTree as ET, hashlib, json, time

BASE = Path(__file__).parent
RAW = BASE / 'raw'
RAW.mkdir(exist_ok=True)
urls = [node.text for node in ET.parse(BASE / 'sitemap.xml').getroot().iter() if node.tag.endswith('loc')]

def capture(url):
    key = hashlib.sha256(url.encode()).hexdigest()[:20]
    target = RAW / (key + '.html')
    if target.exists():
        return {'url': url, 'file': key + '.html', 'status': 200, 'bytes': target.stat().st_size}
    for attempt in range(3):
        try:
            response = requests.get(url, timeout=45)
            if response.status_code == 200:
                target.write_text(response.text)
                return {'url': url, 'file': key + '.html', 'status': 200, 'bytes': len(response.content)}
            if response.status_code < 500:
                return {'url': url, 'status': response.status_code}
        except requests.RequestException as exc:
            error = str(exc)
        time.sleep(attempt + 1)
    return {'url': url, 'status': 0, 'error': locals().get('error', 'request failed')}

results = []
with ThreadPoolExecutor(max_workers=16) as pool:
    jobs = {pool.submit(capture, url): url for url in urls}
    for future in as_completed(jobs):
        results.append(future.result())
        if len(results) % 25 == 0 or len(results) == len(urls):
            print(f'Captured {len(results)}/{len(urls)} public pages; successful {sum(r["status"] == 200 for r in results)}', flush=True)
            (BASE / 'public-capture.json').write_text(json.dumps(sorted(results, key=lambda r: r['url']), indent=2))
print('Public reference capture finished.', flush=True)
