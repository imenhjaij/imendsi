const express = require("express");
const app = express();
const port = 3000;
const path = require('path');
const exphbs = require ('express-handlebars')
app.engine('hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', 'hbs');
var mysql      = require('mysql');
app.set('views', __dirname + '/views');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'imen'
});

connection.connect((err) =>  {
  if (err) throw err;
  console.log('connecté à MySQL!');
});

// Récupérer et trier les actualités par date depuis la base de données
app.get('/', (req, res) => {
  connection.query('SELECT * FROM actualites', (err, results) => {
    if (err) {
      console.error('Error retrieving news:', err);
      return res.status(500).send('Server error');
    }
    
    res.render('home', { actualites: results });
  });
});


app.get("/add", (req, res) => {
  res.render('add');
  res.sendFile(path.join(__dirname, "views/add.html"));
});

app.get("/addnews", function(req, res) {
    var untitre = req.query.letitre;
    var unedesc = req.query.ladescription;
    var sql = "insert into actualites(titre, description) values(?, ?)"
    
    connection.query(sql, [untitre, unedesc], function(error, results, fields) {
        res.send(results)
    })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
