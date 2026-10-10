"""Apply the fresh-context review of l03 to the parts (spaces matched loosely: normal, nbsp, narrow nbsp)."""
import re, sys
D = '/tmp/claude-0/-home-claude-learnings/5a5f671b-988f-5313-8701-3e8988b39f43/scratchpad/work/l03/'
SP = '[ \u00a0\u202f]'
def pat(old):
    return re.compile(''.join(SP if c in ' \u00a0\u202f' else re.escape(c) for c in old))
E = {
'parts/00-top.html': [
 ('<code>stats::independance</code></div>', '<code>stats::independance</code><code>ml::metriques</code></div>'),
],
'parts/01-n1.html': [
 ("On lui apprend que la carte est <b>noire</b>. Il ne reste", "On lui apprend B : la carte est noire. Il ne reste"),
 ("L'image est celle d'un <b>zoom</b>. Savoir", "L'image est celle d'un zoom. Savoir"),
 ("n'a donc aucun sens pour la population", "ne vaut donc pas pour la population"),
 ('<p class="garde">P(A ∣ B) = P(A ∩ B)/P(B), pour P(B) &gt; 0 : on ne garde que les issues de B et on renormalise. Seul le dénominateur choisit le sens, donc P(A ∣ B) ≠ P(B ∣ A) en général.</p>',
  '<p class="garde">Pour P(B) &gt; 0, P(A ∣ B) = P(A ∩ B)/P(B) : on ne garde que les issues de B et on renormalise par P(B), pour que B pèse 1.</p>'),
],
'parts/02-n2.html': [
 ("L'image est l'<b>arbre</b>. Tire deux cartes", "Une image utile : l'arbre. Tire deux cartes"),
 ("vaut le <b>produit de ses branches</b>,", "vaut le produit de ses branches,"),
 ('<p class="garde">P(A ∩ B) = P(A ∣ B) P(B) = P(B ∣ A) P(A), sans aucune hypothèse ; sur un arbre, un chemin vaut le produit de ses branches. Le produit simple P(A) P(B) demande l\'indépendance.</p>',
  '<p class="garde">Pour tous événements A et B, sans hypothèse d\'indépendance, P(A ∩ B) = P(A ∣ B) P(B) = P(B ∣ A) P(A) : sur un arbre, un chemin vaut le produit de ses branches.</p>'),
],
'parts/03-n3.html': [
 ("C'est plus précis : la formule découpe A", "C'est imprécis : la formule découpe A"),
],
'parts/04-n4.html': [
 ("<h3>Bayes : prior, vraisemblance, posterior", "<h3>Bayes : a priori, vraisemblance, a posteriori"),
 ("la <b>cause</b>, chère ou invasive à observer, sachant le <b>symptôme</b>, facile", "la cause, chère ou invasive à observer, sachant le symptôme, facile"),
 ("ce qu'on savait avant le test : le prior.", "ce qu'on savait avant le test : l'<b>a priori</b> (prior)."),
 ("P(malade ∣ +) = <b>9,0 %</b>.", "P(malade ∣ +) = 9,0 %."),
 ("<b>Cancer</b> (Brunton 10, 100 000 testés)", "<b>Cancer</b> (Brunton 10 ; ici sur 100 000 testés)"),
 ("(Brunton 11, 1 000 employés, 10 % d'usagers)", "(Brunton 11 ; ici sur 1 000 employés, 10 % d'usagers)"),
 ("<li>P(B), le <b>prior</b> (a priori) :", "<li>P(B), l'<b>a priori</b> (prior) :"),
 ("<li>P(B ∣ A), le <b>posterior</b> (a posteriori) : la croyance après l'observation. Comme le dénominateur est commun, posterior ∝ vraisemblance × prior.</li>",
  "<li>P(B ∣ A), l'<b>a posteriori</b> (posterior) : la croyance après l'observation. Comme le dénominateur est commun, a posteriori ∝ vraisemblance × a priori.</li>"),
 ("<i>est</i> P(malade ∣ +). Au départ", "<i>est</i> P(malade ∣ +), la valeur prédictive positive (VPP). Au départ"),
 ("Baisse la prévalence : la part bleue fond", "Choisis consultation · 10 %, puis baisse la prévalence : la part bleue fond"),
 ("<li><b>Oublier le prior</b> (base rate neglect)", "<li><b>Oublier l'a priori</b> (base rate neglect)"),
 ("<li><b>Un prior tiré d'un échantillon construit.</b>", "<li><b>Un a priori tiré d'un échantillon construit.</b>"),
 ("la mise à jour, c'est le passage du prior au posterior.", "la mise à jour, c'est le passage de l'a priori à l'a posteriori."),
 ("diffèrent en général (notion 6). Enfin, il annonce", "diffèrent en général (notion 6). Il dit « 91 % du temps, c'est un faux positif » : c'est 91 % des positifs ; sur l'ensemble des tests, environ 1 % seulement (999 sur 100 000) sont des faux positifs. Enfin, il annonce"),
 ('<p class="garde">P(B ∣ A) = P(A ∣ B) P(B) / P(A), avec P(A) par les probabilités totales : posterior ∝ vraisemblance × prior. Le prior compte : un test à 99 % sur une maladie à 0,1 % ne donne que 9 % de malades parmi les positifs.</p>',
  '<p class="garde">Pour P(A) &gt; 0, P(B ∣ A) = P(A ∣ B) P(B) / P(A) : l\'a posteriori est proportionnel à vraisemblance × a priori. Test à 99 % (sensibilité = spécificité = 0,99), maladie à 0,1 % : 9 % de malades parmi les positifs.</p>'),
],
'parts/05-n5.html': [
 ("Brunton conseille de refaire un test. Que vaut un second positif ? Les <b>effectifs</b> le disent sans formule.",
  "Brunton conseille un second test, plus précis. Que vaut un second positif si ce test a les mêmes taux et des erreurs indépendantes du premier ? Les effectifs le disent sans formule."),
 ("Un second test indépendant multiplie encore par 99. Le test est un multiplicateur",
  "Un second test indépendant multiplie encore par 99 : « l'a posteriori d'une expérience devient l'a priori de la suivante », dit Brunton (10). Le test est un multiplicateur"),
 ("Voir l'idée — dépister, puis refaire un test", "Voir l'idée — dépister, puis un second test"),
 ("À gauche les effectifs, à droite la cote.", "Au-dessus de chaque barre les effectifs, en bout de barre la cote et P(malade)."),
 ("LR = 1 ne change rien : le test est alors indépendant de la maladie (notion 7).</li>",
  "LR = 1 ne change rien : le test est alors indépendant de la maladie (notion 7). Repères d'usage : LR &gt; 10 déplace fortement la cote, LR entre 2 et 5 un peu, LR = 1 pas du tout.</li>"),
 ("parce qu'il rend la maladie plus probable.</li>",
  "parce qu'il rend la maladie plus probable.</li>\n      <li>Indépendants sachant l'état : P(T<sub>1</sub><sup>+</sup> ∩ T<sub>2</sub><sup>+</sup> ∣ B) = P(T<sub>1</sub><sup>+</sup> ∣ B) P(T<sub>2</sub><sup>+</sup> ∣ B), et de même sachant Bᶜ. C'est l'indépendance de la notion 7, appliquée à la probabilité P(· ∣ B).</li>"),
 ("À faible prévalence, un négatif rassure beaucoup et un positif inquiète peu.",
  "À faible prévalence, un négatif exclut presque la maladie (0,1 %) ; un positif ne l'établit pas (15 %), bien que son LR soit le plus fort (18, contre 1/0,105 = 9,5 pour le négatif)."),
 ('<p class="garde">Cote a posteriori = cote a priori × LR, avec LR<sup>+</sup> = sensibilité/(1 − spécificité) ; deux tests indépendants sachant l\'état multiplient leurs LR. Doubler une cote ne double p qu\'approximativement, quand p est petit : 0,5 devient 0,667.</p>',
  '<p class="garde">Cote a posteriori = cote a priori × LR, avec LR<sup>+</sup> = sensibilité/(1 − spécificité) pour un test positif ; deux tests indépendants sachant l\'état multiplient leurs LR.</p>'),
],
'parts/06-n6.html': [
 ("« je peux avoir 99,9 % d'accuracy en ne prédisant", "« je peux avoir 99,9 % de taux de bonnes réponses (accuracy) en ne prédisant"),
 ("Pour un même test, sensibilité 0,9 et spécificité 0,95, elle vaut", "Pour le test du dépistage (sensibilité 0,9 et spécificité 0,95), elle vaut"),
 ("<li>TP, FN, FP, TN : vrais positifs, faux négatifs, faux positifs, vrais négatifs ; s la sensibilité",
  "<li>TP, FN, FP, TN : vrais positifs, faux négatifs, faux positifs, vrais négatifs. TPR, TNR, FPR : taux de vrais positifs, de vrais négatifs, de faux positifs (true positive rate…). VPP et VPN : valeurs prédictives positive, P(M ∣ +), et négative, P(Mᶜ ∣ −). s la sensibilité"),
 ("<li>La précision est le posterior de Bayes (notion 4).", "<li>La précision est l'a posteriori de Bayes (notion 4)."),
 ("<li><b>L'accuracy en déséquilibre.</b>",
  "<li><b>La sensibilité ne compense pas la prévalence.</b> Même à sensibilité 1, le dépistage à 1 % (spécificité 0,95, sur 100 000) donne 1 000 vrais positifs contre 4 950 faux : précision 0,168 au mieux. C'est la spécificité qui décide (figure 5).</li>\n      <li><b>L'accuracy en déséquilibre.</b>"),
 ('<p class="garde">Le rappel (sensibilité) et le FPR (1 − spécificité) se lisent dans une seule ligne du tableau et ne dépendent pas de la prévalence ; la précision P(M ∣ +) mélange les deux lignes et tombe avec la prévalence : 0,667 à 10 %, 0,154 à 1 %, pour le même test.</p>',
  '<p class="garde">Pour un même test, la précision P(M ∣ +) dépend de la prévalence, parce que son dénominateur mélange malades et sains : 0,667 à 10 %, 0,154 à 1 %. Le rappel et le FPR, lus dans une seule ligne, n\'en dépendent pas.</p>'),
],
'parts/07-n7.html': [
 ("a pour probabilité le <b>produit</b>,", "a pour probabilité le produit,"),
 ("<b>Cœur</b> : aucune case commune, 0 au lieu de 1/16, disjoints donc dépendants.",
  "<b>Cœur</b> : aucune case commune, P(A ∩ B) = 0 au lieu de P(A)P(B) = 1/16, et P(A ∣ B) = 0 ; disjoints, donc dépendants."),
 ("<span>indépendance, puis complément (l02, notion 2)</span>",
  "<span>indépendance, puis complément (l02, notion 2)</span>\n      <div>de même pour A et Bᶜ, puis pour Aᶜ et Bᶜ</div><span>par symétrie, puis en appliquant le résultat deux fois</span>"),
 ('<p class="garde">A et B indépendants ⇔ P(A ∩ B) = P(A) P(B) ⇔ P(A ∣ B) = P(A) (si P(B) &gt; 0) : savoir B ne change rien sur A. Deux événements disjoints de probabilités non nulles ne sont jamais indépendants.</p>',
  '<p class="garde">A et B sont indépendants si P(A ∩ B) = P(A) P(B), ce qui revient à P(A ∣ B) = P(A) quand P(B) &gt; 0 : savoir B ne change rien sur A.</p>'),
],
'parts/08-n8.html': [
 ("Active la <b>cause commune</b> (une surtension, 1 fois sur 1 000, qui tue tout) : la parallèle tombe alors environ une fois sur mille, quel que soit n.",
  "Active la <b>cause commune</b> (une surtension, 1 fois sur 1 000, qui tue tout) : le bouton tire alors 20 000 systèmes, et la parallèle en voit tomber une vingtaine, environ une fois sur mille, quel que soit n."),
 ('<p class="garde">n composants indépendants de panne p : en série P(panne) = 1 − (1 − p)<sup>n</sup>, en parallèle p<sup>n</sup>. Une cause commune de probabilité q fixe un plancher : la panne en parallèle ne descend jamais sous q.</p>',
  '<p class="garde">Pour n composants de panne p, aux pannes mutuellement indépendantes : en série P(panne) = 1 − (1 − p)<sup>n</sup>, en parallèle p<sup>n</sup>. Une cause commune de probabilité q fixe à la parallèle un plancher q.</p>'),
],
'parts/09-n9.html': [
 ("et c'est elle que supposent p<sup>n</sup>, la binomiale et Naive Bayes.</p>", "et c'est elle que supposent p<sup>n</sup> et la binomiale ; Naive Bayes la suppose sachant la classe.</p>"),
],
'parts/99-end.html': [
 ("<li>Bayes : posterior = vraisemblance × prior / normalisation ;", "<li>Bayes : a posteriori = vraisemblance × a priori / normalisation ;"),
 ("Bayes passe de l'un à l'autre avec le prior :", "Bayes passe de l'un à l'autre avec l'a priori :"),
 ("Une cause commune de probabilité q borne la parallèle à q.", "Une cause commune de probabilité q fixe un plancher : la parallèle ne descend jamais sous q."),
 ("rééchantillonner à 50/50 change le prior :", "rééchantillonner à 50/50 change l'a priori :"),
 ("<small>posterior ∝ vraisemblance × prior, lu en logarithme : le prior devient une pénalité.</small>", "<small>a posteriori ∝ vraisemblance × a priori, lu en logarithme : l'a priori devient une pénalité.</small>"),
 ("<code>stats::independance</code> (notions 7, 8 ; notion 9 sans carte).</p>", "<code>stats::independance</code> (notions 7, 8 ; notion 9 sans carte) · <code>ml::metriques</code> (notion 6).</p>"),
],
}
bad = 0
for f, reps in E.items():
    s = open(D + f, encoding='utf-8').read()
    for old, new in reps:
        p = pat(old); n = len(p.findall(s))
        if n != 1:
            print('MISS' if n == 0 else f'MULTI {n}', f, '|', old[:70]); bad += 1; continue
        s = p.sub(lambda m: new, s)
    for _ in range(3):
        s = re.sub(r'(\d) (\d{3})(?!\d)', '\\1\u202f\\2', s)
    s = re.sub(r'(\d) %', '\\1\u00a0%', s)
    open(D + f, 'w', encoding='utf-8').write(s)
print('misses', bad)
