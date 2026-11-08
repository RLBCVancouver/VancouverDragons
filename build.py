#!/usr/bin/env python3
"""Builds the Vancouver Dragons site.

Reads the editable content in data/*.json, fills it into the marked regions
(<!--cms:NAME--> ... <!--/cms:NAME-->) of the HTML pages, refreshes the structured
data (JSON-LD) and llms.txt, and writes the finished site to dist/.

Netlify runs this on every deploy. If anything in the data is invalid the build
fails and the previous version of the site stays live.
"""
import json, re, html, os, shutil, struct, datetime, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)
OUT = 'dist'
SKIP_DIRS = {'.git', 'dist', 'data', 'node_modules', '.netlify', '.github'}
SKIP_FILES = {'build.py', 'netlify.toml', '.pages.yml', 'README.md', '.gitignore'}
SITE = 'https://vancouverdragons.ca'
IG = 'https://www.instagram.com/vancouver_dragons_/'
esc = lambda x: html.escape(str(x), quote=True)

def load(name):
    with open(os.path.join('data', name), encoding='utf-8') as f:
        return json.load(f)

def need(cond, msg):
    if not cond:
        sys.exit('DATA ERROR: ' + msg)

# ---------- image sizes (so the browser can reserve space) ----------
def img_size(src):
    p = src.lstrip('/')
    if not os.path.isfile(p):
        return None
    try:
        with open(p, 'rb') as f:
            d = f.read(64)
        if d[:8] == b'\x89PNG\r\n\x1a\n':
            return struct.unpack('>II', d[16:24])
        if d[:4] == b'RIFF' and d[8:12] == b'WEBP':
            k = d[12:16]
            if k == b'VP8 ':
                return struct.unpack('<HH', d[26:30])[0] & 0x3fff, struct.unpack('<HH', d[26:30])[1] & 0x3fff
            if k == b'VP8L':
                b = struct.unpack('<I', d[21:25])[0]
                return (b & 0x3fff) + 1, ((b >> 14) & 0x3fff) + 1
            if k == b'VP8X':
                return int.from_bytes(d[24:27], 'little') + 1, int.from_bytes(d[27:30], 'little') + 1
    except Exception:
        pass
    return None

def img_tag(src, alt):
    wh = img_size(src)
    dim = f' width="{wh[0]}" height="{wh[1]}"' if wh else ''
    return f'<img src="{esc(src)}" alt="{esc(alt)}"{dim} loading="lazy">'

# ---------- renderers ----------
def r_sponsors(d):
    out = []
    for s in d['sponsors']:
        need(s.get('name') and s.get('website') and s.get('logo'), 'every sponsor needs a name, website and logo')
        feat = bool(s.get('quote'))
        cls = 'spon spon-feature' if feat else 'spon'
        q = ''
        if feat:
            q = f'<blockquote>“{esc(s["quote"])}”<cite>{esc(s.get("quote_by", ""))}</cite></blockquote>'
        tag = f'<span class="tag">{esc(s["label"])}</span>' if s.get('label') else ''
        out.append(f'<a class="{cls}" href="{esc(s["website"])}" target="_blank" rel="noopener"><div class="spon-logo">{img_tag(s["logo"], s["name"])}</div>{q}<div class="spon-meta"><span>{esc(s["name"])}</span>{tag}</div></a>')
    return '<div class="spon-grid three rv">' + ''.join(out) + '</div>'

def r_strip(d):
    out = []
    for s in d['sponsors']:
        c = f' class="{esc(s["strip_class"])}"' if s.get('strip_class') else ''
        out.append(f'<a{c} href="{esc(s["website"])}" target="_blank" rel="noopener" title="{esc(s["name"])}"><img src="{esc(s["logo"])}" alt="{esc(s["name"])}" loading="lazy"></a>')
    return ''.join(out)

def r_board(d):
    out = []
    for p in d['people']:
        need(p.get('name') and p.get('role'), 'every board member needs a name and a role')
        e = p.get('email', '').strip()
        if e:
            link = f'<a href="mailto:{esc(e)}">{esc(e).replace("@", "@<wbr>", 1)}</a>'
        else:
            link = '<a href="/contact/?topic=general">Contact the club</a>'
        out.append(f'\n        <div class="person"><b>{esc(p["name"])}</b><span>{esc(p["role"])}</span>{link}</div>')
    return ''.join(out) + '\n      '

def r_life(d):
    li = ''.join(f'<li><span>{esc(n)}</span></li>' for n in d['members'])
    return f'<ul class="roll" style="margin-top:24px;grid-template-columns:1fr">{li}</ul>'

def r_awards(d):
    li = ''
    for a in d['awards']:
        c = ' class="hm"' if a.get('smaller_text') else ''
        li += f'<li{c}><b>{esc(a["award"])}</b><span>{esc(a["winner"])}</span></li>'
    return f'<ul class="roll rv">{li}</ul>'

def r_sched_lede(d):
    return esc(d['lede'])

def link_ig(t):
    return esc(t).replace('@vancouver_dragons_', f'<a href="{IG}" target="_blank" rel="noopener">@vancouver_dragons_</a>')

def r_sched_notice(d):
    if not d.get('show_notice'):
        return ''
    t = f'<b>{esc(d["notice_title"])}</b> ' if d.get('notice_title') else ''
    return f'<p class="prov" role="note"><span aria-hidden="true">⏳</span><span>{t}{link_ig(d.get("notice_text", ""))}</span></p>'

def r_fixtures(d):
    fx = d.get('fixtures') or []
    if not fx:
        return ''
    rows = []
    for f in fx:
        need(f.get('date') and f.get('opponent'), 'every fixture needs a date and an opponent')
        try:
            dt = datetime.date.fromisoformat(str(f['date'])[:10])
        except ValueError:
            sys.exit(f'DATA ERROR: fixture date "{f["date"]}" is not a valid date')
        rows.append((dt, f))
    rows.sort(key=lambda r: r[0])
    li = ''
    for dt, f in rows:
        ha = (f.get('home_away') or '').strip()
        badge = f'<span class="fx-ha {esc(ha.lower())}">{esc(ha)}</span>' if ha else ''
        meta = ' · '.join(esc(x) for x in (f.get('time'), f.get('venue'), f.get('competition')) if x)
        meta = f'<p class="fx-meta">{meta}</p>' if meta else ''
        notes = f'<p class="fx-note">{esc(f["notes"])}</p>' if f.get('notes') else ''
        res = f'<p class="fx-res">{esc(f["result"])}</p>' if f.get('result') else ''
        li += (f'<li><div class="fx-date"><b>{dt.strftime("%b")} {dt.day}</b><span>{dt.strftime("%a")} {dt.year}</span></div>'
               f'<div class="fx-main"><p class="fx-opp">{esc(f["opponent"])}</p>{meta}{res}{notes}</div>{badge}</li>')
    return f'<h2 class="h3">Fixtures</h2><ol class="fx">{li}</ol>'

# ---------- structured data ----------
PARTNERS_LD = [
    {"@type": "Organization", "name": "How's That? Podcast", "url": "https://www.howsthatpodcast.com/"},
    {"@type": "Organization", "name": "McLeod Technologies Corp.", "url": "https://mcleodtech.ca/"},
]

def update_ld(page, sponsors, board):
    def fix(m):
        try:
            obj = json.loads(m.group(2))
        except ValueError:
            return m.group(0)
        nodes = obj.get('@graph', [obj]) if isinstance(obj, dict) else []
        for n in nodes:
            if isinstance(n, dict) and n.get('@type') == 'SportsTeam':
                n['sponsor'] = [{"@type": "Organization", "name": s['name'], "url": s['website']} for s in sponsors] + PARTNERS_LD
                n['member'] = [{"@type": "OrganizationRole", "roleName": p['role'], "member": {"@type": "Person", "name": p['name']}} for p in board]
        return m.group(1) + json.dumps(obj) + m.group(3)
    return re.sub(r'(<script type="application/ld\+json">)(.*?)(</script>)', fix, page, flags=re.S)

def update_llms(txt, sponsors, board, life):
    names = lambda L: ', '.join(L)
    txt = re.sub(r'^- Board: .*$', '- Board: ' + ', '.join(f"{p['name']} ({p['role']})" for p in board) + '.', txt, flags=re.M)
    txt = re.sub(r'^- Life members.*$', f'- Life members ({len(life)}): ' + names(life) + '.', txt, flags=re.M)
    def short(n):
        return n.replace(' Inc.', '').replace(' Wellness', '') if False else n
    txt = re.sub(r'^- 2027 sponsors: .*$', '- 2027 sponsors: ' + names(s['name'] for s in sponsors), txt, flags=re.M)
    return txt

# ---------- main ----------
def main():
    sponsors = load('sponsors.json'); board = load('board.json'); life = load('life-members.json')
    awards = load('awards.json'); sched = load('schedule.json')
    need(sponsors['sponsors'], 'sponsors.json has no sponsors')
    regions = {
        'sponsors': r_sponsors(sponsors), 'strip': r_strip(sponsors), 'board': r_board(board),
        'life': r_life(life), 'awards': r_awards(awards), 'sched-lede': r_sched_lede(sched),
        'sched-notice': r_sched_notice(sched), 'fixtures': r_fixtures(sched),
        'sched-preview': None if sched.get('show_preview_image', True) else '',
    }
    if os.path.isdir(OUT):
        shutil.rmtree(OUT)
    os.makedirs(OUT)
    used = set()
    for dp, dn, fn in os.walk('.'):
        dn[:] = [d for d in dn if d not in SKIP_DIRS]
        for f in fn:
            if f in SKIP_FILES:
                continue
            src = os.path.join(dp, f)
            dst = os.path.join(OUT, os.path.relpath(src, '.'))
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            if f.endswith('.html'):
                page = open(src, encoding='utf-8').read()
                for k, v in regions.items():
                    pat = re.compile(r'(<!--cms:' + re.escape(k) + r'-->)(.*?)(<!--/cms:' + re.escape(k) + r'-->)', re.S)
                    if pat.search(page):
                        used.add(k)
                        page = pat.sub(lambda m: m.group(1) + (m.group(2) if v is None else v) + m.group(3), page)
                page = update_ld(page, sponsors['sponsors'], board['people'])
                open(dst, 'w', encoding='utf-8').write(page)
            elif f == 'llms.txt':
                t = open(src, encoding='utf-8').read()
                open(dst, 'w', encoding='utf-8').write(update_llms(t, sponsors['sponsors'], board['people'], life['members']))
            else:
                shutil.copy2(src, dst)
    missing = set(regions) - used
    need(not missing, 'page markers missing for: ' + ', '.join(sorted(missing)))
    print('Built', OUT, '- regions filled:', ', '.join(sorted(used)))

main()
