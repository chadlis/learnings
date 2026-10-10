#!/usr/bin/env python3
"""Paste several screenshots into one image, 2 per row, to look at them in one Read.

    python3 grid.py out.png a.png b.png c.png ...
"""
import sys
from PIL import Image
ims = [Image.open(p) for p in sys.argv[2:]]; cols = 2
w = max(i.width for i in ims); rows = (len(ims) + cols - 1) // cols
hs = [max(ims[r * cols + c].height for c in range(cols) if r * cols + c < len(ims)) for r in range(rows)]
G = Image.new('RGB', (w * cols, sum(hs)), 'white'); y = 0
for r in range(rows):
    for c in range(cols):
        k = r * cols + c
        if k < len(ims): G.paste(ims[k], (c * w, y))
    y += hs[r]
G.save(sys.argv[1]); print(sys.argv[1], G.size)
