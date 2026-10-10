import sys, glob
for p in glob.glob(sys.argv[1] + '/js/*.js'):
    s = open(p, encoding='utf-8').read()
    t = (s.replace(' :', ' :').replace(' ;', ' ;').replace(' ?', ' ?').replace(' !', ' !')
          .replace('« ', '« ').replace(' »', ' »'))
    if t != s:
        open(p, 'w', encoding='utf-8').write(t); print('fixed', p)
