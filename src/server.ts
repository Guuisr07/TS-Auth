//Importando o express para a configuracao padrao do server
import express from 'express';

//Criando nosso app com o express
const app = express();

//Criando uma rota simples para mostrar uma mensagem e saber que esta funcionando e rodando na porta 3333
app.get('/', (request, response) => {
  return response.json({ message: 'Hello World' })
}); 

//Setando o app na porta 3333 = http://localhost:3333
app.listen(3000);





