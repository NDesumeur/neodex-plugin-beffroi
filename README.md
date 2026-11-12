# Beffroi

Un jeu de saut en pixel art : un petit sonneur monte les étages d'un clocher en courant et en sautant, avant que le clocher ne le rattrape. Monte le plus haut possible.

*English version: [README.en.md](README.en.md)*

## Commandes

- **← →** (ou **Q D**, **A D**) : courir.
- **Espace**, **↑** ou **Z** : sauter.
- **Souris** ou **doigt** : appuie à gauche ou à droite du jeu pour courir, au milieu pour sauter.
- **P** ou **Échap** : pause.

## Comment ça marche

- **Plus tu cours vite, plus tu sautes haut.** La jauge en haut montre ta vitesse : à fond, un saut passe 3 étages.
- Les **murs** te renvoient sans te freiner : cours contre un mur pour repartir dans l'autre sens à pleine vitesse.
- Les **poutres** se traversent par en dessous : tu te poses dessus en retombant. Elles raccourcissent en montant, et passent du bois à la pierre puis au cuivre tous les 25 étages. Un panneau marque chaque dizaine.
- Dès le **5e étage**, le clocher défile tout seul, un peu plus vite toutes les 30 secondes. S'il te rattrape par le bas, c'est perdu.
- Chaque nouvel étage rapporte **10 points**.
- Les **combos** : enchaîne des sauts d'au moins 2 étages. Le combo s'arrête sur un petit saut ou après 3 secondes, et rapporte le carré des étages gagnés (8 étages en combo = 64 points), à partir de 2 sauts.

## Statistiques

Le panneau Records garde ton **meilleur score**, le nombre de **parties**, le total des **étages montés** et le nombre de **combos**.

## Données et synchronisation

Ton record et tes totaux sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Beffroi → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
