---
title: "PHP et programmation fonctionnelle"
description: "Procédural, impératif, fonctionnel : PHP est multi-paradigmes, mais ce que l'on écrit au quotidien relève rarement du fonctionnel."
pubDatetime: 2023-08-09T18:00:00+01:00
author: "Grégoire Hébert"
ogImage: "/assets/programmation-fonctionnelle/header.jpg"
tags:
  - "php"
  - "programmation"
featured: true
---

L'autre jour, au détour d'un café, j'entends à la table d'à côté ceci.

Si j'écris du PHP dans un long fichier de script, sans classes, sans objets.\
Est-ce que je fais de la programmation fonctionnelle, de la programmation procédurale, ou c'est pareil ?

Je me serais bien retourné pour répondre, mais je me suis ravisé.

TL;DR: Eh bah, ça dépends. Mais en général ce que je vois c'est plutôt du procédural.

Lorsqu'un langage de programmation ne possède pas de classes ou d'objets, ses fonctions sont des ordres, des commandes. C'est pourquoi on dit que c'est un langage impératif. Si ses ordres effectuent une liste d'actions dans un ordre précis et invariant. Cette succession, est appelée une procédure. C'est donc un langage Impératif et procédural.

Une procédure qui retourne un résultat est une fonction.

PHP, permet d'écrire des procédures.\
PHP, permet d'écrire des fonctions.

C'est dont un langage impératif, et procédural.

PHP permet également d'implémenter des classes et des objets.\
C'est donc un langage Orienté Objet.

Il est multi-paradigmes.

Mais alors, un langage orienté objet, peut-il **ne pas** être impératif, ou procédural ? Pas vraiment, puisque dans nos classes nous allons déclarer des procédures et des fonctions.

Comme moi, vous avez surement déjà entendu les termes : programmation procédurale et programmation fonctionnelle. On pourrait en déduire que c'est la même chose selon si la procédure retourne une valeur ou non. Il y a une part de vérité, mais c'est insuffisant. Dans une approche procédurale les appels se chaînent.

``` php
<?php

recupererDonnees('./donnees.csv');
preparerDonnees('./donnees.csv');
afficherDonnees('./donnees.csv' );
```

Et il y a de grandes chances que ce soit ce que vous faites dans vos projets.\
L'approche fonctionnelle, s'exprime plutôt en expressions et en composition.

``` php
<?php

afficher(preparer(recuperer('./donnees.csv')));
```

Il y a un autre domaine pour lequel on parle de fonction. Les maths. Et dans celui-ci, une fonction prend un certains nombre de paramètres en entrée, et offre un résultat en sortie. Tel que plusieurs appels à une fonction avec les mêmes paramètres en entrées produira toujours le même résultat.

``` php
<?php

function moinsUn($x) {
    return $x - 1;
}
```

Creusons l'idée de fonction.\
Imaginons ceci : Une fonction qui retourne le produit de 2 valeurs auxquelles on a retranché 1.

``` php
<?php

function produitMoinsUn($x, $y) {
    return ($x - 1) * ($y - 1);
}
```

On pourrait simplifier la lecture et la maintenance avec une séparation des responsabilités .

``` php
<?php

function moinsUn($x) {
    return $x - 1;
}

function produit($x, $y) {
    return $x * $y;
}

function produitMoinsUn($x, $y) {
    $a = moinsUn($x);
    $b = moinsUn($y);

    return produit($a, $b);
}
```

Mais puisqu'en programmation fonctionnelle, on compose les appels. Il faudrait plutôt écrire ceci :

``` php
<?php

function moinsUn($x) {
    return $x - 1;
}

function produit($x, $y) {
    return $x * $y;
}

function produitMoinsUn($x, $y) {
    return produit(moinsUn($x), moinsUn($y));
}
```

Cependant il reste un problème pour vraiment respecter la notion de fonction. C'est la présence des mots clés `return` partout. En particulier celui de `produitMoinsUn`.\
`return` est une commande. Pour afficher le résultat ou l'obtenir, cela revient à concaténer 2 commandes.

Pour corriger ceci, les langages offrent la possibilité de stocker des procédures et fonctions dans des variables. Si on applique ceci à notre dernière fonction elle s'écrit alors comme cela :

``` php
<?php

function moinsUn($x) {
    return $x - 1;
}

function produit($x, $y) {
    return $x * $y;
}

$produitMoinsUn = fn($x, $y) => produit(moinsUn($x), moinsUn($y));
echo $produitMoinsUn(4, 4); // 9
```

Commençons à nous faire des noeuds au cerveaux.\
Ces fonctions assignées à des variables sont des fonctions dites, anonyme, ou lambda.

Si je peux assigner des fonctions anonymes à des variables, tout comme des nombres.\
Si je peux passer des nombres comme valeurs d'entrée et de sortie de fonction, qui plus est par l'intermédiaires de variables.\
Alors je peux avoir des fonctions anonymes en entrées et sorties de fonction.

Un exemple peut aider.\
Si au lieu de `moinsUn` je dis `MoinsX` et je permet de préciser la valeur à retrancher.

``` php
<?php

function moinsUn($x) {
    return $x - 1;
}

// devient
function moinsX($a, $x) {
    return $a - $x;
}
```

Je transforme mes fonctions en fonctions anonymes.

``` php
<?php

$moinsX = fn($a, $x) => $a - $x;
$produitMoinsX = fn($a, $b, $x) => $moinsX($a, $x) * $moinsX($b, $x);

echo $produitMoinsX(4, 4, 1); // 9
```

Mais, que se passe-t'il si (peu importe la raison), je n'ai pas encore la valeur 1 en ma possession ?\
Alors au lieu de retourner le résultat, je vais, dans ma fonction anonyme, retourner une fonction anonyme, pour réclamer le résultat plus tard. Une fois que j'aurais la valeur à soustraire.

``` php
<?php

$moinsX = fn($a, $x) => $a - $x;
$produitMoinsX = fn($a, $b) =>
                    fn($x) => $moinsX($a, $x) * $moinsX($b, $x);

echo ($produitMoinsX(4, 4))(1); // 9
```

Ceci nous permet de séparer les responsabilités et le travail de logique ou de préparations à plusieurs "moment" de l'exécution de notre programme. Cool non ?

Bon d'après la définition c'est pas encore tout à fait juste... Une fonction ne doit prendre qu'un seul paramètre en entrée. Pour respecter ce critère, il faut pousser les inclusions de fonctions anonymes encore plus loin, et passer de ceci :

``` php
<?php

$moinsX = fn($a, $x) => $a - $x;
$produitMoinsX = fn($a, $b) =>
                    fn($x) => $moinsX($a, $x) * $moinsX($b, $x);

echo ($produitMoinsX(4, 4))(1); // 9
```

à cela :

``` php
<?php

$moinsX = fn($a) =>
            fn($x) => $a - $x;

$produitMoinsX = fn($a) =>
                    fn($b) =>
                        fn($x) => ($moinsX($a))($x) * ($moinsX($b))($x);

echo (($produitMoinsX(4))(4))(1); // 9
```

C'est une approche de la programmation fonctionnelle nommée **currying**.\
Alors c'est très peu lisible ici mais on pourrait améliorer le tout en séparant chaque fonction anonyme dans des variables.

Et... j'ai deux, trois choses à ajouter.\
Dans un langage fonctionnel, vous ne pourriez pas utiliser de boucles, et vous seriez obligé de faire de la récursivité. Dans mes exemples, j'ai pris les valeurs, les ai manipulés et renvoyés. Et c'est tout, parce que dans un langage fonctionnel, au sein d'une fonction, il n'y a pas de place pour les effets secondaires comme afficher des choses, gérer des cas d'erreur, aller lire des valeurs qui proviennent d'ailleurs.

Pour répondre à ces besoins, il faut introduire les Monads.\
Ce que je n'ai pas du tout l'intention de faire parce qu'on parlait de PHP au départ et que ça pas beaucoup de sens ici, sauf si vous voulez faire du C pour améliorer PHP lui-même.

C'est ça de la programmation fonctionnelle.

En conclusion.

Si j'écris du PHP dans un long fichier de script, sans classes, sans objets, je fais de la programmation procédurale, et ce même en considérant dans le terme procédure la notion de fonction au sens d'une procédure retournant une valeur.

Merci de m'avoir lu :)
