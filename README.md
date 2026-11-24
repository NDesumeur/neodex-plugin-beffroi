# Beffroi

Un jeu de saut en pixel art : un petit sonneur monte les étages d'un clocher en courant et en sautant, des caves jusqu'au sommet sous les étoiles, avant que le clocher ne le rattrape.

*English version: [README.en.md](README.en.md)*

## Combos annoncés, personnages et succès (nouveau en 1.2.0)

- **L'annonce des gros combos** : à la fin d'un combo (au moins deux sauts de 2 étages ou plus), le mot jaillit en grand au milieu de l'écran, selon la taille du combo : BIEN (4 étages), SUPER (7), GÉNIAL (12), FORMIDABLE (20), INCROYABLE (30), FABULEUX (45), EXTRAORDINAIRE (70), LÉGENDAIRE (100). Dessous : les étages, le nombre de sauts et les points (le carré des étages). Une gerbe d'étincelles part du sonneur, l'arpège est plus long pour les gros combos, l'écran s'illumine dès GÉNIAL et les couleurs tournent. Un saut de 4 étages ou plus d'un coup s'affiche aussi (« 5 ÉTAGES ! ») ; le compteur du combo grossit à partir de 12.
- **Trois personnages**, à choisir avec ← → sur l'écran de départ : **le sonneur**, équilibré ; **la funambule** (ouverte à 30 étages de record), qui accélère plus vite et court plus vite mais saute un peu moins haut ; **l'acrobate** (ouvert à 60), qui peut **sauter une seconde fois en l'air**, une fois par saut. Chacun a ses couleurs.
- **Six succès de figure**, dans la carte SUCCÈS : 100 étages sans toucher un mur, un combo de 50 étages, 10 cloches dans une partie, 30 notes dans une partie, l'étage 100, 80 étages sans toucher un oiseau. Un bandeau vert annonce chaque succès débloqué.

## Commandes

- **← →** (ou **Q D**, **A D**) : courir.
- **Espace**, **↑** ou **Z** : sauter. **Garde la touche** pour monter plus haut, lâche-la vite pour un petit saut.
- **Manette** : stick ou croix pour courir, **A**, **B** ou haut pour sauter, **Start** pour partir ou mettre en pause.
- **Souris** ou **doigt** : appuie à gauche ou à droite du jeu pour courir, au milieu pour sauter.
- **P** ou **Échap** : pause. Le bouton **Plein écran** est à côté de Nouvelle partie.

## Comment ça marche

- **Plus tu cours vite, plus tu sautes haut.** La jauge en haut montre ta vitesse : à fond, un saut passe 3 étages, avec un salto.
- Les **murs** te renvoient sans te freiner : cours contre un mur pour repartir dans l'autre sens à pleine vitesse.
- Le saut pardonne : il part même si tu appuies un peu avant de retomber, ou un tout petit peu après avoir quitté une poutre.
- Les **poutres** se traversent par en dessous et raccourcissent en montant. À partir du 12e étage, certaines **bougent**, d'autres sont **fissurées** et tombent peu après qu'on s'y pose ; dans l'horloge, certaines **glissent**.
- Les premiers étages rappellent les gestes sur le mur. Au **5e étage**, un compte à rebours, puis le clocher défile tout seul, un peu plus vite toutes les 30 secondes. S'il te rattrape par le bas, c'est perdu.

## Le clocher

On traverse **les caves** (torches), **la charpente** (lanternes), **la salle des cloches**, **l'horloge** (engrenages, cadran), **les vitraux**, puis **le sommet** à ciel ouvert, sous les étoiles et la lune.

- Les **cloches** te relancent vers le haut quand tu les touches en l'air (+15 points).
- Les **notes** de musique rapportent 25 points chacune.
- Les **oiseaux** (pigeons, puis chauves-souris) coupent ton élan et ton combo.

## Points

- Chaque nouvel étage rapporte **10 points**.
- Les **combos** : enchaîne des sauts d'au moins 2 étages. Le combo s'arrête sur un petit saut ou après 3 secondes, et rapporte le carré des étages gagnés (8 étages en combo = 64 points), à partir de 2 sauts.

## Statistiques

Le panneau Records garde ton **meilleur score**, ton **plus haut étage**, le nombre de **parties**, le total des **étages montés**, des **combos**, des **notes** et des **cloches sonnées**.

## Données et synchronisation

Ton record et tes totaux sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Beffroi → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
