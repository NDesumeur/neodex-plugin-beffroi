# Beffroi

Un jeu de saut en pixel art : un petit sonneur monte les étages d'un clocher en courant et en sautant, des caves jusqu'au sommet sous les étoiles, avant que le clocher ne le rattrape.

*English version: [README.en.md](README.en.md)*

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
