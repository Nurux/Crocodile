const express = require('express');
const app = express();
const mysql = require('./database/conection_db').connection;

app.use(express.static('./'));
app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', 'assets/views');

app.get('/', (req, res) => {
    res.render('inicio');
})

app.get('/inicio', (req, res) => {
    let msg = false;

    mysql.getConnection((error, cnx) => {
        if(error){  return  res.status(500).send({  error:error }) }
        cnx.query(
            'Select * from perguntas',
            (error, resultado, field) => {
                cnx.release()

                if(error){
                    return console.log(error)
                }

                res.render('index', {
                    perguntas: resultado,
                    cond: msg
                });
            }
        )
    });
})

app.get('/pergunta', (req, res) => {
    res.render('resposta')
})

app.post('/data', (req, res) => {
    mysql.getConnection((error,cnx)=>{
        if(error){  return  console.log(error) }
        cnx.query(
            'Insert into perguntas(titulo, descricao) values(?, ?)',
            [req.body.user, req.body.desc],
            
            (error, resultado, field) => {
                cnx.release()

                if(error){
                    return console.log(error)
                }

                res.redirect('/inicio');
            }
        )
    });
});

app.post('/red', (req, res) => {
    let op = req.body.option

    if(op == 1){
        res.redirect('/pergunta');
    }else {
        res.redirect('/inicio');
    }
})

app.post('/resp', (req, res) => {
    mysql.getConnection((error,cnx)=>{
        if(error){  return  console.log(error) }
        cnx.query(
            'Insert into respostas(corpo, id_pergunta) values(?, ?)',
            [req.body.resp, req.body.id],
            
            (error, resultado, field) => {
                cnx.release()

                if(error){
                    return console.log(error)
                }

                let id = req.body.id
                res.redirect(`/pergunta/${id}`)
            }
        )
    });
})


app.get('/pergunta/:id', (req, res) => {
    mysql.getConnection((error, cnx) => {
        if(error){  return  console.log(error) }
        cnx.query(
            'Select * from perguntas Where id = ?',
            [req.params.id],

            (error, resultado, field) => {

                if(error){
                    return console.log(error)
                }

                if(resultado != undefined){
                    cnx.query(
                        'Select * from respostas where id_pergunta = ?',
                        [req.params.id],

                        (errors, respostas, filed) => {
                            cnx.release()

                            if(errors){ return console.log(errors) }

                            res.render('perguntas', {
                                pergunta: resultado[0],
                                cond: true,
                                respostas: respostas
                            });
                        }
                    )
                    
                } else{
                    res.render('erro')
                }
            }
        )
    })
})

app.listen(3000, () => {
    console.log('Rodando na porta 3000');
});