// Importer le module express
const express = require('express');
// Importer le module mongoose
const mongoose = require('mongoose');

// ================================================
// Connexion à la base de données
// ================================================
// Quand je suis connecté à la bdd (evenementiel)
mongoose.connection.once('open', () => {
    console.log("Connexion à la base de données effectué");
});

// Quand la bdd aura des erreurs
mongoose.connection.on('error', () => {
    console.log("Erreur dans la BDD");
});

// Se connecter sur mongodb (async)
// Ca prend x temps à s'executer
mongoose.connect("mongodb://127.0.0.1:27017/db_article");

// ================================================
// Instancier un serveur et autoriser envokie json
// ================================================
// Instancier le server grace à express
const Article = mongoose.model('Article', { title: String, content: String, author: String }, 'articles');

const app = express();

// AUTORISER LE BACK A RECEVOIR DES DONNEES DANS LE BODY
app.use(express.json());

// ================================================
// Les routes (url/point d'entrée)
// ================================================
app.get('/articles', async (request, response) => {
    const articles = await Article.find();
    if (articles.length == 0){
        return response.json({ code : "701" });
    }
    return response.json(articles);
});
app.get('/article/:id', async (request, response) => {
    const idParam = request.params.id;
    const foundArticle = await Article.findOne({'_id' : idParam});
    code = "1"
    if (!foundArticle){
        code = "200"
        return response.json({ code : "702" });
    }
    return response.json(foundArticle); 
});

app.post('/save-article', async (request, response) => {
        const article_json = request.body;
        console.log(article_json)
        const newArticle = new Article(article_json);
        await newArticle.save();
        code = "1"
        if (!newArticle) {
            code = "200"
            return res.status(404).json({ error: "pas de nouvelle donnée" });
        }
        return response.json(newArticle);
});


app.delete('/article/:id', async (req, res) => {
    const articleId = req.params.id;
    // Supprimer l'article dans la base de données
    code = "1"
    if (!deletedArticle) {
        code = "200"
        return res.status(404).json({ error: "Article non trouvé" });
    }
    const deletedArticle = await Article.findByIdAndDelete(articleId);
    return res.status(200).json({code: "200"});
});



// ================================================
// Lancer le serveur
// ================================================
app.listen(3000, () => {
    console.log("Le serveur a démarré");
});