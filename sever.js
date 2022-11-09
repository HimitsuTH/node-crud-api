let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}));

// homepage route
app.get('/', (req, res) => {
    return res.send({
        error: false,
        message: 'Welcome to RESTFUL API WITH nodeJS, Express,MYSQL',
        written_by: 'Chinnawich',
        published_on: 'https://shin.dev'
    })
})



let dbCon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "nodejs_api",
});
dbCon.connect();

//retrieve all books
app.get('/books', (req, res) => {
    dbCon.query("SELECT * FROM books", (error, result, fileds) => {
        if(error) throw error;

        let message = ""
        if(result === undefined || result.length == 0) {
            message = "Books table is empty";
        } else {
            message = "Successfully"
        }

        return res.send({ error: false, data: result, message: message });
    })
})

// add a new book
app.post('/book', (req, res) => {
    let name = req.body.name;
    let author = req.body.author;

    //validation
    if(!name || !author) {
        return res
          .status(400)
          .send({
            error: true,
            message: "Please provide book name and author",
          });
    } else {
        dbCon.query('INSERT INTO books (name,author) VALUES(?, ?)',[name, author],(error, result, fileds)=> {
            if(error) throw error;
            return res.send({
              error: false,
              data: result,
              message: "Book successfully added",
            });
        })
    }
})

// retrieve book by id 
app.get('/book/:id', (req,res) => {
    let id = req.params.id;
    if(!id) {
        return res.status(400).send({error: true, message: "Please provide book id"})
    } else {
        dbCon.query("SELECT * FROM books WHERE id = ?",id, (error, result, fileds) => {
            if(error) throw error;
            let message = "";
            if(result === undefined || result.length == 0) {
                message = "Book not found"
            } else {
                message = "Successfully retrieved book data";
            }

            return res.send({error: false, data: result[0], message: message});
        })
    }
})

// update book with id

app.put('/book', (req, res)=> {
    let id = req.body.id;
    let name = req.body.name;
    let author = req.body.author;

    if(!id || !name || !author){
        return res.status(400).send({error: true, message: "Please proviede book id, name  and author"})
    } else {
        dbCon.query("UPDATE books SET name = ?, author = ? WHERE id =?",
        [name, author, id], (error, result, fileds)=> {
            if(error) throw error;

            let message = "";
            if(result.changedRows === 0) {
                message = "Book not found or data are same";
            } else {
                message = "Book successfully updated";
            }

            return res.send({error: false, data: result, message: message});
        })
    }
})

//delete book by id
app.delete('/book', (req, res)=> {
    let id = req.body.id;

    if(!id) {
        return res.status(400).send({error: true, message: "Please provide book id"})
    } else {
        dbCon.query("DELETE FROM books WHERE id = ?", [id], (error,result, fileds)=> {
            if(error) throw error;

            let message = "";
            if(result.affectedRows === 0) {
                message = "Book not found"
            } else {
                message = "Book successfully deleted";
            }

            return res.send({error: false, data: result, message: message});
        })
    }
})


app.listen(3000, () => {
    console.log('Node App is running on port 3000');
})


module.exports = app;