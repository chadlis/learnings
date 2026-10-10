import sys
def edit(p, reps):
    s = open(p).read()
    for a, b in reps:
        assert s.count(a) == 1, (p, s.count(a), a[:70])
        s = s.replace(a, b)
    open(p, 'w').write(s)

# ---------- chapeau ----------
if 'top' in sys.argv: edit('parts/00-top.html', [
 ("mais <b>pas en recopiant la densité</b> : on passe", "mais pas en recopiant la densité : on passe"),
 ("Sa fonction de répartition est F<sub><i>X</i></sub>(<i>x</i>) = P(<i>X</i> ≤ <i>x</i>)", "Sa fonction de répartition (CDF) est F<sub><i>X</i></sub>(<i>x</i>) = P(<i>X</i> ≤ <i>x</i>)"),
])

# ---------- n1 ----------
if 'n1' in sys.argv: edit('parts/01-n1.html', [
 ("Une densité est un <b>taux de probabilité par unité de longueur</b> :", "Une densité est un taux de probabilité par unité de longueur :"),
 ("écrire ≤ ou &lt; ne change rien (Brunton hésite, sans conséquence).</li>", "écrire ≤ ou &lt; ne change rien.</li>"),
 ("<li>g strictement monotone : l'événement", "<li>g strictement monotone sur l'ensemble des valeurs de <i>X</i> (<i>x</i>² l'est sur [0, 1], pas sur ℝ) : l'événement"),
 ("Sinon il a plusieurs morceaux (notion 4).</li>", "Sinon il a plusieurs morceaux (notion 4)."),
 ("""C'est la méthode d'inversion : à partir d'un générateur uniforme, on simule toute loi dont on sait inverser la fonction de répartition.</li>""",
  """Avec la formule : g⁻¹(<i>y</i>) = e<sup>−<i>y</i></sup>, (g⁻¹)′(<i>y</i>) = −e<sup>−<i>y</i></sup>, donc <i>f</i><sub><i>Y</i></sub>(<i>y</i>) = <i>f</i><sub><i>U</i></sub>(e<sup>−<i>y</i></sup>) · e<sup>−<i>y</i></sup> = e<sup>−<i>y</i></sup>. C'est la méthode d'inversion : la fonction de répartition de l'exponentielle de taux 1 est F(<i>y</i>) = 1 − e<sup>−<i>y</i></sup>, d'inverse F⁻¹(<i>u</i>) = −ln(1 − <i>u</i>), et 1 − <i>U</i> est encore uniforme. À partir d'un générateur uniforme, on simule ainsi toute loi dont on sait inverser la fonction de répartition.</li>
      <li><b>Le carré sur [0, 1], celui de la figure 1.</b> <i>X</i> uniforme sur [0, 1] et <i>Y</i> = <i>X</i>² : g est croissante sur [0, 1], g⁻¹(<i>y</i>) = √<i>y</i> et (g⁻¹)′(<i>y</i>) = 1/(2√<i>y</i>). Donc <i>f</i><sub><i>Y</i></sub>(<i>y</i>) = 1 · 1/(2√<i>y</i>) = 1/(2√<i>y</i>) sur ]0, 1], la densité exacte de la figure 1. Sur [0 ; 0,01], elle donne P = √0,01 = 0,1 : la première tranche.</li>"""),
 ("<li><b>g non monotone.</b> Pour g(<i>x</i>) = <i>x</i>², deux valeurs de <i>x</i> donnent le même <i>y</i>", "<li><b>g non monotone.</b> Pour g(<i>x</i>) = <i>x</i>² et une <i>X</i> qui prend des valeurs des deux signes, deux valeurs de <i>x</i> donnent le même <i>y</i>"),
 ("Brunton (13, 16, 23) dit « cumulative density function ».", "Brunton (13, 16, 23) dit souvent « cumulative density function »."),
 ("""<p class="garde">Pour la loi de Y = g(X) : écrire F<sub>Y</sub>(y) = P(g(X) ≤ y), le réécrire comme un événement sur X, puis dériver. Une densité ne se recopie pas : pour g monotone, f<sub>Y</sub>(y) = f<sub>X</sub>(g⁻¹(y)) · |(g⁻¹)′(y)|, elle se divise par l'étirement.</p>""",
  """<p class="garde">X à densité, g strictement monotone sur les valeurs de X, Y = g(X) : f<sub>Y</sub>(y) = f<sub>X</sub>(g⁻¹(y)) · |(g⁻¹)′(y)|. On l'obtient en dérivant F<sub>Y</sub>(y) = P(g(X) ≤ y), jamais en recopiant la densité.</p>"""),
 ("""Dans""", """Dans""") if False else ("<p class=\"cap\"><i>X</i> est uniforme sur [0, 1], coupée en dix tranches de largeur 0,1 : chacune porte une probabilité de 0,1. À gauche, la courbe", "<p class=\"cap\"><i>X</i> est uniforme sur [0, 1], coupée en dix tranches de largeur 0,1 : chacune porte une probabilité de 0,1. Dans le premier panneau, la courbe"),
 ("de la même couleur. À droite, la densité de <i>Y</i>, couchée le long du même axe <i>y</i>", "de la même couleur. Dans le second, la densité de <i>Y</i>, couchée le long du même axe <i>y</i>"),
])
if 'n1' in sys.argv: print('n1 ok')

# ---------- n2 ----------
if 'n2' in sys.argv:
    edit('parts/02-n2.html', [
     ("<p>Brunton suppose <i>a</i> &gt; 0 et ajoute que « ça ne compte pas tant que ça ». Si. Prenons", "<p>Brunton suppose <i>a</i> &gt; 0. Prenons"),
     ("« <i>X</i> ≥ 20 » : <b>l'inégalité se retourne</b>, et", "« <i>X</i> ≥ 20 » : l'inégalité se retourne, et"),
     ("<li>La variance <i>a</i>²σ² vaut pour toute loi,", "<li>μ = E[<i>X</i>] et σ est l'écart-type de <i>X</i>. La variance <i>a</i>²σ² vaut pour toute loi,"),
     ("<li>N(μ, σ²) : le second paramètre est la variance. Brunton dit tantôt l'un, tantôt l'autre.</li>", "<li>N(μ, σ²) : le second paramètre est la variance.</li>"),
     ("""    <p>Brunton laisse ce dernier calcul en exercice, et décrit l'exposant comme « y moins b sur a, au carré, sur σ² » : il y manque μ et le facteur 2.</p>\n""", ""),
     ("En 24, il rectifie en « a fois σ », sans la valeur absolue.</div>", "En 24, il rectifie en « a fois σ », sans la valeur absolue. Enfin, il laisse le cas normal en exercice et en esquisse l'exposant (« e to the minus whatever… et cetera ») sans μ ni le facteur 2 : le calcul complet est dans la preuve.</div>"),
     ("""<p class="garde">Y = aX + b avec a ≠ 0 : f<sub>Y</sub>(y) = f<sub>X</sub>((y − b)/a)/|a|, moyenne aμ + b, écart-type |a|σ ; si a &lt; 0, l'inégalité se retourne, F<sub>Y</sub>(y) = 1 − F<sub>X</sub>((y − b)/a). Une normale reste normale : N(aμ + b, a²σ²).</p>""",
      """<p class="garde">Y = aX + b, a ≠ 0 : f<sub>Y</sub>(y) = f<sub>X</sub>((y − b)/a)/|a| ; si a &lt; 0, l'inégalité se retourne, F<sub>Y</sub>(y) = 1 − F<sub>X</sub>((y − b)/a).</p>"""),
    ])
    print('n2 ok')

# ---------- n3 ----------
H_MU, H_SIG = '<span class="hat">μ</span>', '<span class="hat">σ</span>'
if 'n3' in sys.argv:
    edit('parts/03-n3.html', [
     ("<p>Avant les ordinateurs, raconte Brunton, on ne trouvait Φ", "<p>Quand les ordinateurs étaient lents, raconte Brunton, on ne trouvait Φ"),
     ("compte en écarts-types la distance à la moyenne, dans n'importe quelle unité.</p>", "compte en écarts-types la distance à la moyenne : il est sans unité.</p>"),
     ("cinq fois plus, puisque l'unité est cinq fois plus courte.", "cinq fois plus, puisqu'une unité de <i>z</i> couvre 5 °C."),
     ("<li>Moyenne 0 et écart-type 1 pour toute loi de variance finie :", "<li>C'est la preuve promise en l04 (<a href=\"lesson-00-04-variables-binomiale-normale.html#n6\">notion 6</a>) : la notion 2 avec <i>a</i> = 1/σ, <i>b</i> = −μ/σ, et une normale reste normale.</li>\n      <li>Moyenne 0 et écart-type 1 pour toute loi de variance finie :"),
     ("<li><i>c</i> et <i>d</i> sont les bornes. Brunton les appelle <i>a</i> et <i>b</i>, comme les coefficients de la notion 2 : on les renomme.</li>", "<li><i>c</i> et <i>d</i> sont les bornes de l'intervalle.</li>"),
     ("""<li>En pratique μ et σ sont inconnus : on standardise avec <span class="m">μ̂</span> et <span class="m">σ̂</span>, estimés sur les données d'apprentissage. Pour la moyenne de <i>n</i> variables normales, (<i>X̄</i> − μ)/(<i>S</i>/√<i>n</i>) suit alors une loi de Student à <i>n</i> − 1 degrés de liberté, pas N(0, 1) (""",
      f"""<li>En pratique μ et σ sont inconnus : on standardise avec {H_MU} et {H_SIG}, estimés sur l'apprentissage, et ce n'est plus la standardisation exacte. Pour la moyenne de <i>n</i> variables i.i.d. N(μ, σ²) standardisée par l'écart-type estimé, la loi devient une Student à <i>n</i> − 1 degrés de liberté, pas N(0, 1) ("""),
     ("Choisis <b>exponentielle</b> : <i>Z</i> = <i>T</i> − 1 commence", "Choisis <b>exponentielle</b> : <i>Z</i> = <i>T</i> − 1 (taux 1 : μ = σ = 1 ; toute exponentielle donne la même <i>Z</i>) commence"),
     ("Pour toute normale : 68,3 %, 95,4 % et 99,7 %.", "Pour toute normale : 68,3 %, 95,4 % et 99,7 % (vus en <a href=\"lesson-00-04-variables-binomiale-normale.html#n6\">l04, notion 6</a>)."),
     ("entre 190 et 230, c'est Φ((230 − 200)/10) − Φ((190 − 200)/10) = Φ(3) − Φ(−1) = 0,840. C'était déjà une standardisation.", "entre 190 et 230, la normale sans correction donne Φ((230 − 200)/10) − Φ((190 − 200)/10) = Φ(3) − Φ(−1) = 0,840 (la valeur exacte, 0,852, demande la correction de continuité, l04 notion 7). C'était déjà une standardisation."),
     ("<li><b>En ML : standardiser des features.</b>", "<li><b>En ML : standardiser des variables explicatives (features).</b>"),
     ("Divise chaque feature par son écart-type", "Divise chaque variable par son écart-type"),
     ("""<li><b>Les statistiques du test.</b> <span class="m">μ̂</span> et <span class="m">σ̂</span> se calculent sur l'apprentissage seul, puis s'appliquent tels quels au test.""",
      f"""<li><b>Les statistiques du jeu de test (test set).</b> {H_MU} et {H_SIG} se calculent sur le jeu d'apprentissage seul, puis s'appliquent telles quelles au jeu de test."""),
     ("""<li><b><span class="m">μ̂</span> et <span class="m">σ̂</span> ne sont pas μ et σ.</b> Une moyenne standardisée par l'écart-type estimé suit une Student,""",
      f"""<li><b>{H_MU} et {H_SIG} ne sont pas μ et σ.</b> Une moyenne standardisée par l'écart-type estimé suit une Student si les données sont normales,"""),
     ("elle ne change l'ordre d'aucune valeur, donc aucun seuil de découpe (", "elle ne change l'ordre d'aucune valeur, donc les mêmes partitions, seule la valeur du seuil change ("),
     ("on écrit N(μ, σ²), le second paramètre est la variance.</div>", "on écrit N(μ, σ²), le second paramètre est la variance. Enfin, il appelle <i>a</i> et <i>b</i> à la fois les coefficients de la notion 2 et les bornes de l'intervalle : ici, les bornes sont <i>c</i> et <i>d</i>.</div>"),
     ("""<p class="garde">Z = (X − μ)/σ a une moyenne 0 et un écart-type 1 pour toute loi, mais suit N(0, 1) seulement si X est normale. Alors P(c &lt; X &lt; d) = Φ((d − μ)/σ) − Φ((c − μ)/σ).</p>""",
      """<p class="garde">X ~ N(μ, σ²) : P(c &lt; X &lt; d) = Φ((d − μ)/σ) − Φ((c − μ)/σ), parce que Z = (X − μ)/σ suit N(0, 1), ce qui n'est vrai que si X est normale.</p>"""),
    ])
    print('n3 ok')

# ---------- n4 ----------
if 'n4' in sys.argv:
    edit('parts/04-n4.html', [
     ("à gauche et à droite, <b>se replient</b> sur un seul côté", "à gauche et à droite, se replient sur un seul côté"),
     ("porte déjà 8 % de la masse, entassés dans [0 ; 0,01] ; la densité du χ² y sort par le haut du cadre.</p>", "porte déjà 8 % de la masse, entassée dans [0 ; 0,01] : densité moyenne 7,97 (valeur affichée).</p>"),
     ("c'est elle que servent les tests.", "c'est elle qui sert aux tests."),
     ("<small>trois valeurs de y, la densité, la moyenne, une loss</small>", "<small>trois valeurs de y, la densité, la moyenne, une perte</small>"),
     ("<li><b>En ML : une loss est une somme de carrés normalisés.</b>", "<li><b>En ML : une perte (loss) est une somme de carrés normalisés.</b>"),
     ("""<li><b>Ce qui est normal, c'est l'erreur standardisée.</b> Brunton enchaîne « on soustrait le modèle aux données, on élève l'erreur au carré » et « ces erreurs suivent à peu près une normale », sans dire lesquelles. Ce sont les erreurs divisées par leur écart-type qui sont ≈ N(0, 1), et la somme de leurs carrés qui est ≈ χ².""",
      """<li><b>Ce qui est normal, c'est l'erreur standardisée.</b> Une erreur divisée par son écart-type est ≈ N(0, 1), avant tout carré ; c'est la somme des carrés de ces erreurs standardisées qui est ≈ χ²."""),
     ("""Brunton (25) peine sur la dérivée et l'explique par « les pentes en +√y et −√y sont égales et opposées ». Elles sont égales : φ est paire, φ(−√<i>y</i>) = φ(√<i>y</i>). Le signe vient de la dérivée intérieure de −√<i>y</i>, qui vaut −1/(2√<i>y</i>) et annule le moins placé devant Φ(−√<i>y</i>) : les deux termes s'ajoutent (figure 4). Son résultat final, <i>f</i><sub><i>Y</i></sub>(<i>y</i>) = <i>y</i><sup>−1/2</sup> φ(√<i>y</i>), est juste.""",
      """Brunton (25) écrit d'abord juste : « I'm going to get minus and minus. So plus… ». Puis il doute, « I think this should be a minus here », et justifie ce doute par « les pentes en +√y et −√y sont égales et opposées ». Elles sont égales : φ est paire, φ(−√<i>y</i>) = φ(√<i>y</i>). Le signe vient de la dérivée intérieure de −√<i>y</i>, qui vaut −1/(2√<i>y</i>) et annule le moins placé devant Φ(−√<i>y</i>) : les deux termes s'ajoutent, comme dans sa première ligne (figure 4). Son résultat final, tiré de ses notes, <i>f</i><sub><i>Y</i></sub>(<i>y</i>) = <i>y</i><sup>−1/2</sup> φ(√<i>y</i>), est juste."""),
     ("""c'est e<sup>−<i>x</i>²/2</sup>/√(2π).</div>""", """c'est e<sup>−<i>x</i>²/2</sup>/√(2π). Enfin, pour les tests, il enchaîne « on soustrait le modèle aux données, on élève l'erreur au carré » et « ces erreurs suivent à peu près une normale », sans dire lesquelles : ce sont les erreurs standardisées, avant le carré.</div>"""),
    ])
    print('n4 ok')

# ---------- fin ----------
if 'end' in sys.argv:
    edit('parts/99-end.html', [
     ("Standardiser une feature exponentielle la rend-elle normale ?", "Standardiser une variable explicative exponentielle la rend-elle normale ?"),
     ("<small>z = β̂₁/SE et p", "<small>z = <span class=\"hat\">β</span>₁/SE et p"),
     ("""<small><span class="m">μ̂</span> et <span class="m">σ̂</span> de la standardisation""", """<small><span class="hat">μ</span> et <span class="hat">σ</span> de la standardisation"""),
     ("<small>La NLL gaussienne, ½ Σ (rᵢ/σ)² :", "<small>La log-vraisemblance négative gaussienne, ½ Σ (rᵢ/σ)² :"),
    ])
    print('end ok')
