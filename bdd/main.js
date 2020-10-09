const express = require('express');
const app = express();
const PORT=8002;
const mysql=require("mysql");
const connexion= mysql.createPool({
    connectionLimit : 10,
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'nodedb',
    dateStrings: 'date'
  });

//données globales
let titre="Gestion d'un annuaire en base de données";

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//Affiche l'annuaire
app.get('/lister', function(req, res) {
    let sql='SELECT * from user';
    connexion.query(sql, function(error, results) {
        res.render(__dirname + "/server/user.ejs",{data : results, titre : titre})
    });
});

//supprime un élément du tableau annuaire
app.get('/supprimer/:index', (req, res) => {    
    let sql='delete from user where use_id=?';
    connexion.query(sql,[req.params.index], (error, results) => res.redirect("/lister"));       
});

//supprime un élément du tableau annuaire
app.get('/editer/:index', (req, res) => {    
    let sql="select * from user where use_id=?"
    connexion.query(sql,[req.params.index], function(error, results) {
        console.log(results);
        res.render(__dirname + "/server/user_edit.ejs",{data : results, titre : titre})
    });       
});

app.post('/ajouter', function(req, res) {    
    let sql="INSERT INTO user (use_id, use_nom, use_birth) VALUES (NULL,?,?)";
    connexion.query(sql, [req.body.nom,req.body.birth],(error, results) => res.redirect("/lister"));
});

//toute autre requete que les routes précédente est une page introuvable
app.use(function(req, res, next){
    res.setHeader('Content-Type', 'text/plain');
    res.status(404).send('Page introuvable !');
});

app.listen(PORT);