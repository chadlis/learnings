#!/usr/bin/env python3
"""Assemble one lesson page from a working directory.

    python3 build.py <lesson_dir> <output.html>

<lesson_dir> holds:
  head.html          doctype → <style> opening tag (metas, title)
  parts/*.html       page body, concatenated in sorted order: from <body> to the
                     </div> that closes .app (footer included)
  js/*.js            figure code, concatenated in sorted order inside the page script
  code/cN.py         code blocks; run_code.py writes code/oN.txt
Placeholders in parts: {{CODE:cN}} and {{OUT:cN}}.
The kit's base.css + lesson.css (+ optional <lesson_dir>/extra.css) are inlined,
and the kit's helpers.js is inlined before js/*.js.
"""
import glob, html, os, re, sys

d, out = sys.argv[1], sys.argv[2]
K = os.path.dirname(os.path.abspath(__file__))
rd = lambda p: open(p, encoding='utf-8').read()

parts = ''.join(rd(p) for p in sorted(glob.glob(os.path.join(d, 'parts', '*.html'))))
js = ''.join(rd(p).rstrip('\n') + '\n\n' for p in sorted(glob.glob(os.path.join(d, 'js', '*.js'))))
for m in sorted(set(re.findall(r'\{\{(?:CODE|OUT):(c\d+)\}\}', parts))):
    code = rd(os.path.join(d, 'code', m + '.py')).rstrip('\n')
    o = os.path.join(d, 'code', 'o' + m[1:] + '.txt')
    if not os.path.exists(o):
        sys.exit(f'missing output {o}: run run_code.py first')
    parts = parts.replace('{{CODE:%s}}' % m, html.escape(code, quote=False)).replace('{{OUT:%s}}' % m, html.escape(rd(o).rstrip('\n'), quote=False))
assert '{{' not in parts, re.findall(r'\{\{[^}]*\}\}', parts)[:5]

def typo(s):
    """French typography outside tags and code: thin nbsp before ; ? !, nbsp before : and inside « »."""
    bits = re.split(r'(<pre class="(?:py|out|tri)">.*?</pre>|<[^>]+>)', s, flags=re.S)
    for i, x in enumerate(bits):
        if x.startswith('<'):
            continue
        bits[i] = (x.replace(' ;', ' ;').replace(' :', ' :').replace(' ?', ' ?')
                    .replace(' !', ' !').replace('« ', '« ').replace(' »', ' »'))
    return ''.join(bits)

css = rd(os.path.join(K, 'base.css')) + rd(os.path.join(K, 'lesson.css'))
if os.path.exists(os.path.join(d, 'extra.css')):
    css += '/* ---- propre à cette leçon ---- */\n' + rd(os.path.join(d, 'extra.css'))
script = ('<div class="ledge"></div>\n<script src="../../assets/sheetlib.js"></script>\n<script>\n(function(){\n'
          + rd(os.path.join(K, 'helpers.js')) + '\n' + js + '})();\n</script>\n</body>\n</html>\n')
doc = rd(os.path.join(d, 'head.html')) + css + '</style>\n</head>\n' + typo(parts) + script
os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
open(out, 'w', encoding='utf-8').write(doc)
print(out, len(doc), 'bytes')
