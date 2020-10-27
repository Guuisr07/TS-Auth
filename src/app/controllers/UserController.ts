import { Request, Response } from 'express';
// Usando o getRepository para cconseguir usar o model de usuario aqui no controller
import { getRepository } from 'typeorm'; 

import User from '../models/Users';

class UserController {
  // Criando a rota que apenas o usuario autenticado podera ver a lista de usuarios
  index(req: Request, res: Response) {
    // Vamos fazer um teste para ver se esta realmente armazenando na request do express
    return res.send({userId: req.userId})
  }
  
  async store(req: Request, res: Response) {
    // Criando a variavel que vai receber a funcao getRepository com o model de usuario
    const repository = getRepository(User);  
    const { email, password } = req.body;

    // Criando a verificacao para ver se o email que o cliente esta digitando ja existe no banco de dados
    const userExists = await repository.findOne({ where: {email} });

    if(userExists) {
      return  res.sendStatus(409);
    }

    // Depois que passar pela verificacao e nao tiver um email igual ao que esta no banco de dados, vamos registrar os dados no banco.
    const user = repository.create({ email, password });
    // Usando o async await para salvar os dados do usuario no banco de dados
    await repository.save(user);

    return res.json(user);
  }
}

export default new UserController();