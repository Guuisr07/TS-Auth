import express from 'express';

const app = express();

app.get('/', (request, response) => response.json({ message: 'Hello World' }));

// Setando o app na porta 3333 = http://localhost:3333
app.listen(3000);
