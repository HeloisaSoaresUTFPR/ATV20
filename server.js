//Refatore sua resposta server.js da Atividade 17 e para fazer
//toda a persistência de dados usando a biblioteca node-persist 
//(os livros books e o log não pode mais permanecer em memória).
//- Utilize async-await
//- Crie um projeto (npm init) e adicione as dependências necessárias.


const express = require('express');
const bodyParser = require('body-parser')
const storage = require('node-persist');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let contget = 0
let contPost = 0

async function main() {
    await storage.init();
    await storage.setItem('books', [{ ID: 1, name: 'Codigo da Vinci', author: 'Dan Brown' }])
    console.log('Dados salvo com sucesso! ! !');
    await storage.setItem('log', {contget: 0, contpost: 0 });

    //const book = await storage.getItem('books')

    //console.log(book);
}


/*const books = [
    {
        ID: 1,
        name: 'Codigo Da Vinci',
        author: 'Dan Brown'
    },
    {
        ID: 2,
        name: 'Os Lusiadas',
        author: 'Luis de Camoes'
    }
];*/

app.get('/books', (req, res) => {
    (async () => {
        await storage.init();
        const books = await storage.getItem('books');
        let log = await storage.getItem('log');
        log.contget++
        await storage.setItem('log', log)
        res.send(books);
    })

});

app.get('/log', (req, res) => {
    (async () => {
        await storage.init();
        const log = await storage.getItem('log');
        res.send(log);
    })
});

app.post('/books', (req, res) => {
    (async () => {
        await storage.init();
        let log = await storage.getItem('log');
        log.contpost++
        await storage.setItem('log', log)
        
        const newBook = req.body;
        let books = await storage.getItem('books');

        if (books.findIndex(b => b.ID === newBook.ID) !== -1) {
            res.status(500).send('Existing book ID');
            return;
        }

        books.push(newBook);
        storage.setItem('books', books);
        res.send('Book salvo com sucesso...');

    })

});

app.get('/books/:bookId', (req, res) => {
    (async () => {
        
        await storage.init();
        let log = await storage.getItem('log');
        log.contget++
        await storage.setItem('log', log)

        const books = await storage.getItem('books');
        console.log(books);

        const bookId = parseInt(req.params.bookId);
        if (isNaN(bookId)) {
            res.status(500).send('Non integer');
            return;
        }

        const book = books.find(b => b.ID === bookId);
        if (!book) {
            res.status(500).send('Invalid book ID');
            return;
        }

        res.send(book);

    })();

});

app.listen(3000, () => {
    main();
    console.log(`Example app listening at http://localhost:3000`);
})

