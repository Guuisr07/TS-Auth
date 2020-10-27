import express from 'express';
import 'reflect-metadata';

import routes from './routes';
import './database/connect';

const app = express();

app.use(express.json());
app.use(routes);

app.get('/', (request, response) => response.json({ message: 'Hello World' }));

// Setando o app na porta 3000 = http://localhost:3000
app.listen(3000, () => console.log('🔥 Server rodando na porta 3000'));
