import { Request, Response, NextFunction} from 'express'; 
import jwt from 'jsonwebtoken';

//Criando a interface para tipar o que retorna do data o nosso TokenPayLoad
interface TokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export default function authMiddleware(req: Request, res: Response, next:NextFunction) {
  const { authorization } = req.headers;

  if(!authorization) {
    return res.sendStatus(401);
  }

  const token = authorization.replace('Bearer', '').trim();

  try {
    const data = jwt.verify(token, 'secret');
    
    // Devemos desestruturar o data que retorna do token da requisicao para pegarmos apenas o id do usuario e deixar salvo
    const { id } = data as TokenPayload;
    
    // Agora devemos salvar a informacao do tokenPayload dentro da request do express
    req.userId = id;

    // Para prosseguir com os middlewarese chegar na rota
    return next();
  } catch {
    return res.sendStatus(401);
  }
}