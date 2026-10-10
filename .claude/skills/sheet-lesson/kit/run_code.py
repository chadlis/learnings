#!/usr/bin/env python3
"""Run every <lesson_dir>/code/cN.py and save its stdout to code/oN.txt (fails loudly on error).

    python3 run_code.py <lesson_dir> [cN ...]
"""
import glob, os, subprocess, sys, tempfile
d = sys.argv[1]
names = sys.argv[2:] or [os.path.basename(p)[:-3] for p in sorted(glob.glob(os.path.join(d, 'code', 'c*.py')), key=lambda p: int(os.path.basename(p)[1:-3]))]
for n in names:
    src = os.path.abspath(os.path.join(d, 'code', n + '.py'))
    with tempfile.TemporaryDirectory() as tmp:
        r = subprocess.run([sys.executable, src], cwd=tmp, capture_output=True, text=True, timeout=300)
    if r.returncode:
        sys.exit(f'{n} failed:\n{r.stderr}')
    open(os.path.join(d, 'code', 'o' + n[1:] + '.txt'), 'w', encoding='utf-8').write(r.stdout)
    print(f'--- {n}\n{r.stdout.rstrip()}')
