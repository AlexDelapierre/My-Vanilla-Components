# Les Attributs Data-*

## Introduction

Les attributs `data-*` (appelés attributs de données personnalisés) sont un moyen standard en HTML5 de stocker des informations supplémentaires directement dans vos balises, sans utiliser de propriétés non standards ou détourner des attributs existants comme `class` ou `id`.

### Exemple

Dans votre exemple précis :

```html
<form id="informations" data-fv-err-clazz="invalid-feedback" ...>
```

Le navigateur ignore totalement ces attributs pour le rendu visuel, mais ils sont accessibles via JavaScript pour configurer des scripts (ici, probablement une bibliothèque de validation de formulaire comme "FormValidation").

## Structure et Syntaxe

- Ils doivent impérativement commencer par le préfixe `data-`.
- Ils ne doivent contenir que des minuscules (le JavaScript transformera les tirets en camelCase).
- La valeur peut être n'importe quelle chaîne de caractères (JSON, ID, configuration, texte).

## Comment les récupérer en JavaScript ?

Le DOM propose une propriété dédiée appelée `dataset`. C'est ici que la magie opère : les tirets sont supprimés et remplacés par une majuscule.

### Exemple d'accès via dataset

```javascript
const form = document.getElementById('informations');

// Accès via dataset
console.log(form.dataset.fvErrClazz);    // Affiche: "invalid-feedback"
console.log(form.dataset.fvControlValid); // Affiche: "is-valid"

// On peut aussi les modifier
form.dataset.fvErrClazz = "new-error-class";
```

## Pourquoi les utiliser ?

- **Séparation des préoccupations :** Vous stockez la configuration dans le HTML et la logique dans le JS.
- **Communication :** C'est le pont idéal pour passer des données provenant d'un serveur (via PHP, Python, etc.) vers vos scripts front-end.
- **Stylisation CSS :** Vous pouvez cibler des éléments en fonction de leurs attributs data.

### Exemple de stylisation CSS

```css
form[data-fv-control-invalid="is-invalid"] {
  border: 1px solid red;
}
```

## En résumé

Dans votre code, ces attributs servent de paramètres de configuration pour un script de validation. Le script va lire `data-fv-err-clazz` pour savoir quelle classe CSS il doit ajouter à un champ lorsqu'il y a une erreur, ce qui rend votre code JS générique et réutilisable.

--------------------------------------------------------------------------------------------------------------------

## Exemple Pratique (1) : Validation de formulaire avec attributs data

Voici un exemple simple : nous allons créer un script qui lit les attributs `data-fv-control-valid` et `data-fv-control-invalid` de votre formulaire pour styliser un champ de saisie selon que l'utilisateur a rempli le champ ou non.

### Le Code (HTML + JS)

```html
<form id="informations" 
      data-fv-control-valid="is-valid" 
      data-fv-control-invalid="is-invalid">
    
    <label for="username">Nom d'utilisateur :</label>
    <input type="text" id="username" placeholder="Tapez quelque chose...">
    <button type="button" id="btn-check">Valider</button>
</form>

<script>
    const form = document.getElementById('informations');
    const input = document.getElementById('username');
    const btn = document.getElementById('btn-check');

    btn.addEventListener('click', () => {
        // 1. On récupère les noms de classes stockés dans les "data attributes"
        const classSuccess = form.dataset.fvControlValid;   // "is-valid"
        const classError = form.dataset.fvControlInvalid; // "is-invalid"

        // 2. Logique de validation simple
        if (input.value.trim() !== "") {
            input.className = classSuccess; // On applique "is-valid"
            console.log("Succès : classe appliquée depuis le dataset.");
        } else {
            input.className = classError;   // On applique "is-invalid"
            console.log("Erreur : classe appliquée depuis le dataset.");
        }
    });
</script>
```

### Pourquoi cette approche est-elle puissante ?

- **Zéro "Hardcoding" :** Si demain vous changez de framework CSS (par exemple, de Bootstrap à Tailwind), vous n'avez pas besoin de fouiller dans votre fichier `.js` pour changer les noms des classes. Vous modifiez simplement les attributs `data-*` dans votre fichier HTML.

- **Personnalisation par élément :** Vous pourriez avoir deux formulaires différents sur la même page avec des classes de validation différentes, tout en utilisant le même script JavaScript.

- **Lisibilité :** En un coup d'œil sur le HTML, un développeur comprend comment le script va se comporter.

### Un petit plus pour le CSS

Pour que l'exemple soit visuel, ces classes ressembleraient à ceci dans votre feuille de style :

```css
.is-valid { 
  border: 2px solid green; 
  background-color: #eaffea; 
}

.is-invalid { 
  border: 2px solid red; 
  background-color: #ffeaea; 
}
```

---

## Usages avancés des attributs data

Les attributs `data-*` sont des réservoirs de données génériques. Ils servent à stocker n'importe quelle information dont votre application a besoin, sans que cela ait forcément un lien avec l'apparence.

Voici les usages les plus fréquents au-delà des classes CSS :

### 1. Stocker des IDs ou des clés de base de données

C'est l'usage n°1. Quand vous affichez une liste de produits ou d'utilisateurs, vous stockez l'ID technique pour savoir sur quoi l'utilisateur clique.

```html
<ul>
  <li data-user-id="452" data-role="admin">Jean Dupont</li>
  <li data-user-id="789" data-role="editor">Marie Curie</li>
</ul>
```

En JS, quand on clique sur "Jean", on récupère `452` pour envoyer une requête API spécifique à cet utilisateur.

### 2. Passer des configurations à des scripts (Widgets)

Beaucoup de bibliothèques (Google Maps, lecteurs vidéo, compte à rebours) utilisent les attributs data pour se paramétrer sans que vous ayez à écrire de JavaScript complexe.

```html
<div class="countdown" data-end-date="2026-12-31" data-format="days-hours"></div>
```

### 3. Internationalisation (Traduction)

On peut s'en servir pour stocker des textes dans différentes langues afin de basculer l'affichage instantanément.

```html
<button data-lang-en="Submit" data-lang-fr="Envoyer">Envoyer</button>
```

### 4. Tracking et Analytics

Les outils comme Google Tag Manager utilisent souvent des attributs data pour identifier quel bouton a été cliqué et à quelle campagne marketing il appartient.

```html
<a href="/promo" data-analytics-category="Summer_Sale" data-analytics-label="Banner_Home">
  Voir la promo
</a>
```

### Le cas particulier du CSS : L'attribut content

Il existe une astuce géniale en CSS : vous pouvez afficher le contenu d'un attribut data directement dans la page via les pseudo-éléments `::before` ou `::after`.

```css
/* Affiche une info-bulle basée sur l'attribut data-tooltip */
.help-icon::after {
  content: attr(data-tooltip);
  display: none;
  background: black;
  color: white;
}

.help-icon:hover::after {
  display: block;
}
```

### En résumé

Considérez les attributs data comme des post-it collés sur vos éléments HTML. Le navigateur ne les lit pas, mais vos scripts (JS) et vos styles (CSS) peuvent s'en servir pour prendre des décisions intelligentes.

-------------------------------------------------------------------------------------------------------------------

## Communication : Le pont entre le serveur et le client

C'est sans doute l'usage le plus puissant des attributs data. Imaginez que votre site est divisé en deux mondes qui ne parlent pas la même langue :

- **Le Monde du Serveur** (Backend - PHP, Python, Node, etc.) : Il a accès à la base de données (vos utilisateurs, vos stocks, les prix).
- **Le Monde du Navigateur** (Frontend - JavaScript) : Il s'occupe de l'interactivité (clics, animations, calculs en direct), mais il ne connaît pas votre base de données.

Le "pont", c'est le moment où le serveur écrit une information dans le HTML pour que le JavaScript puisse la lire plus tard.

### Un exemple concret : Le panier d'achat

Imaginons que vous affichez un produit avec du PHP. Le serveur sait que ce produit a l'ID 42 et coûte 19.99€. Le JavaScript, lui, ne le sait pas encore.

#### 1. Le Serveur (PHP) écrit le pont :

```php
<?php 
  $id_produit = 42; 
  $prix = 19.99;
?>

<button id="add-to-cart" 
        data-product-id="<?php echo $id_produit; ?>" 
        data-price="<?php echo $prix; ?>">
    Ajouter au panier
</button>
```

#### 2. Le Navigateur (JavaScript) traverse le pont :

Quand l'utilisateur clique, le JavaScript n'a pas besoin de demander au serveur "C'est quoi l'ID de ce bouton ?". Il le lit directement sur l'élément :

```javascript
const btn = document.getElementById('add-to-cart');

btn.addEventListener('click', () => {
    const id = btn.dataset.productId; // "42"
    const price = btn.dataset.price;   // "19.99"
    
    alert(`Produit ${id} ajouté pour ${price}€ !`);
});
```

### Pourquoi c'est "idéal" ?

- **Pas de requêtes inutiles :** Vous n'avez pas besoin de faire un appel API (AJAX) juste pour savoir quel est l'ID d'un bouton sur lequel on vient de cliquer. L'info est déjà là, "collée" sur le bouton.

- **Propreté :** Avant, les développeurs utilisaient des variables globales `var produitId = 42;` au milieu du HTML, ce qui rendait le code très sale et dur à maintenir. Avec les attributs data, l'information est rangée là où elle est pertinente (sur l'objet concerné).

- **Sécurité et contexte :** Le serveur décide exactement quelles données il "expose" au JavaScript.

### En résumé

C'est un transfert de relais : le Serveur prépare le terrain en déposant des indices dans le HTML, et le JavaScript les ramasse au moment où il en a besoin pour agir.

----------------------------------------------------------------------------------------------------------------------

## Exemple Pratique (2) : Système de filtrage dynamique

Voici comment créer un système de filtrage dynamique sans avoir à recharger la page, simplement en utilisant les attributs data.

Imaginons une liste de projets ou de produits. Chaque élément possède un attribut `data-category`.

### 1. Le HTML : On "étiquette" nos éléments

Chaque carte a son étiquette de catégorie, et nos boutons de filtre ont aussi un attribut `data-filter` pour dire au JavaScript quoi chercher.

```html
<div class="filters">
  <button data-filter="all">Tous</button>
  <button data-filter="dev">Développement</button>
  <button data-filter="design">Design</button>
</div>

<div class="project-list">
  <div class="project-item" data-category="dev">Site E-commerce</div>
  <div class="project-item" data-category="design">Logo Marque X</div>
  <div class="project-item" data-category="dev">Application Mobile</div>
  <div class="project-item" data-category="design">Charte Graphique</div>
</div>
```

### 2. Le JavaScript : On compare les étiquettes

Le script va lire l'attribut du bouton cliqué et le comparer à l'attribut de chaque projet.

```javascript
const buttons = document.querySelectorAll('.filters button');
const projects = document.querySelectorAll('.project-item');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const filterValue = button.dataset.filter; // On récupère "dev", "design" ou "all"

    projects.forEach(project => {
      const projectCategory = project.dataset.category;

      if (filterValue === "all" || filterValue === projectCategory) {
        project.style.display = "block";  // On montre
      } else {
        project.style.display = "none";   // On cache
      }
    });
  });
});
```

### Pourquoi c'est brillant ?

- **Évolutivité :** Si vous ajoutez une catégorie "Marketing" demain, vous avez juste à ajouter `data-category="marketing"` dans votre HTML (via votre serveur PHP/Python). Le code JavaScript, lui, ne change pas d'une ligne.

- **Performance :** Tout se passe instantanément dans le navigateur de l'utilisateur.

- **Multi-critères :** Vous pourriez même cumuler les attributs ! Par exemple :
  ```html
  data-category="dev" data-priority="high" data-status="poursuite"
  ```
  Le JavaScript pourrait alors filtrer de manière très précise.

### Un petit conseil de "pro"

En entreprise, on utilise souvent cette technique pour le "Lazy Loading" (chargement différé des images). On met l'URL de l'image dans un `data-src` au lieu de `src`. L'image ne charge pas au début, et dès que l'utilisateur scrolle, le JS copie le `data-src` vers le `src` pour afficher l'image. Cela rend le site beaucoup plus rapide !

----------------------------------------------------------------------------------------------------------------------

## Lazy Loading : Chargement différé des images

Le Lazy Loading (chargement différé) est une technique essentielle pour la performance. L'idée est simple : on ne charge l'image que lorsqu'elle devient visible à l'écran.

Pour cela, on utilise un attribut `data-src` pour "cacher" l'URL réelle de l'image au navigateur lors du chargement initial de la page.

### 1. Le HTML : L'image "en attente"

Au lieu de mettre l'URL dans `src`, on la met dans `data-src`. Le `src` pointe vers une image minuscule et très légère (un carré gris ou un logo flou).

```html
<img class="lazy-image" 
     src="placeholder.jpg" 
     data-src="photo-haute-resolution-lourde.jpg" 
     alt="Une superbe photo">
```

### 2. Le JavaScript : L'échange au bon moment

On utilise une technologie appelée IntersectionObserver qui détecte quand l'image entre dans le champ de vision de l'utilisateur.

```javascript
const images = document.querySelectorAll('.lazy-image');

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            
            // On prend l'URL stockée dans le "data-src" 
            // et on la met dans le vrai "src"
            img.src = img.dataset.src;
            
            // Une fois chargée, on peut ajouter une petite animation
            img.onload = () => img.classList.add('loaded');
            
            // On arrête d'observer cette image (le travail est fait)
            observer.unobserve(img);
        }
    });
});

images.forEach(img => observer.observe(img));
```

### 3. Le petit plus en CSS

Pour que l'apparition soit élégante, on joue sur l'opacité :

```css
.lazy-image {
    opacity: 0;
    transition: opacity 0.5s;
}

.lazy-image.loaded {
    opacity: 1;
}
```

### Pourquoi est-ce une révolution pour votre site ?

- **Économie de données :** Si l'utilisateur ne scrolle jamais jusqu'en bas, il n'aura jamais téléchargé les images lourdes du bas de page.

- **Vitesse :** Votre page s'affiche presque instantanément car le navigateur n'a pas 50 images à télécharger d'un coup.

- **SEO :** Google adore les pages rapides et favorise les sites qui utilisent le lazy loading.