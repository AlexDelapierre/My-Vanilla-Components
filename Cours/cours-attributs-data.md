Les attributs data-* (appelés attributs de données personnalisés) sont un moyen standard en HTML5 de stocker des informations supplémentaires directement dans vos balises, sans utiliser de propriétés non standards ou détourner des attributs existants comme class ou id.

Dans votre exemple précis :
<form id="informations" data-fv-err-clazz="invalid-feedback" ...>

Le navigateur ignore totalement ces attributs pour le rendu visuel, mais ils sont accessibles via JavaScript pour configurer des scripts (ici, probablement une bibliothèque de validation de formulaire comme "FormValidation").

1. Structure et Syntaxe
Ils doivent impérativement commencer par le préfixe data-.

Ils ne doivent contenir que des minuscules (le JavaScript transformera les tirets en camelCase).

La valeur peut être n'importe quelle chaîne de caractères (JSON, ID, configuration, texte).

2. Comment les récupérer en JavaScript ?
Le DOM propose une propriété dédiée appelée dataset. C'est ici que la magie opère : les tirets sont supprimés et remplacés par une majuscule.

JavaScript :
const form = document.getElementById('informations');

// Accès via dataset
console.log(form.dataset.fvErrClazz);    // Affiche: "invalid-feedback"
console.log(form.dataset.fvControlValid); // Affiche: "is-valid"

// On peut aussi les modifier
form.dataset.fvErrClazz = "new-error-class";
3. Pourquoi les utiliser ?
Séparation des préoccupations : Vous stockez la configuration dans le HTML et la logique dans le JS.

Communication : C'est le pont idéal pour passer des données provenant d'un serveur (via PHP, Python, etc.) vers vos scripts front-end.

Stylisation CSS : Vous pouvez cibler des éléments en fonction de leurs attributs data.

CSS
form[data-fv-control-invalid="is-invalid"] {
  border: 1px solid red;
}
En résumé
Dans votre code, ces attributs servent de paramètres de configuration pour un script de validation. Le script va lire data-fv-err-clazz pour savoir quelle classe CSS il doit ajouter à un champ lorsqu'il y a une erreur, ce qui rend votre code JS générique et réutilisable.

Souhaitez-vous que je vous montre comment créer un petit script qui utilise ces attributs pour manipuler votre formulaire en temps réel ?

C'est une excellente idée pour bien visualiser comment le HTML "communique" avec le JavaScript.

Voici un exemple simple : nous allons créer un script qui lit les attributs data-fv-control-valid et data-fv-control-invalid de votre formulaire pour styliser un champ de saisie selon que l'utilisateur a rempli le champ ou non.

Le Code (HTML + JS)
HTML
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

Pourquoi cette approche est-elle puissante ?
Zéro "Hardcoding" : Si demain vous changez de framework CSS (par exemple, de Bootstrap à Tailwind), vous n'avez pas besoin de fouiller dans votre fichier .js pour changer les noms des classes. Vous modifiez simplement les attributs data-* dans votre fichier HTML.

Personnalisation par élément : Vous pourriez avoir deux formulaires différents sur la même page avec des classes de validation différentes, tout en utilisant le même script JavaScript.

Lisibilité : En un coup d'œil sur le HTML, un développeur comprend comment le script va se comporter.

Un petit plus pour le CSS
Pour que l'exemple soit visuel, ces classes ressembleraient à ceci dans votre feuille de style :

CSS
.is-valid { border: 2px solid green; background-color: #eaffea; }
.is-invalid { border: 2px solid red; background-color: #ffeaea; }
Souhaitez-vous que je vous explique comment manipuler ces attributs directement en CSS sans même utiliser de JavaScript ?