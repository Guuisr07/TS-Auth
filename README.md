## Api de autenticacao com Typescript 

 - Configurar o express com a configuracao padrao. (Configuracao padrao ja existente no repositorio Node-setup do git 🚀)

- Criar o arquivo de rotas dentro da pasta src, ficando assim: routes.ts
  - O arquivo de rotas serve para armezenarmos as rotas que vamos criar para que sejam acessadas pelo cliente.
  - Dentro do arquivo de rotas devemos importar o Router do express, ficando assim o codido ate entao da pasta routes.ts: 
    ```
      import { Router } from 'express';
      const router = Router();
      export default router;
    ```
  - Vamos importar o routes no arquivo server.ts e usar depois do app.use(express.json), pois o express roda os midlewares na ordem que sao deifnidos. 

**Configuracao do TypeORM**

  Vamos usar o typeorm nesse projeto pois ele funciona muito bem com typescript, pode extrair o maximo da linguagem(superset).

  - Comecar instalando o typeorm e o reflect-metadata, ficando assim o codigo:
    ```sh
    ❯ yarn add typeorm reflect-metadata
    ```
    - Depois de instalar as duas bibliotecas deve importar em algum arquivo global o reflect-metadata, ficando assim no arquivo server.ts no caso dessa minha aplicacao:
      ```
        import 'reflect-metadata'
      ```

  - Instalar a versao do banco de dados que vai usar no typeorm, no caso desse projeto irei utilizar o banco postgres, rodando:
    ```sh
    ❯  yarn add pg
    ```

  - Deve habilitar a parte dos decorators no tsconfig.json que sao os:
    ```
      "experimentalDecorators": true,        
      "emitDecoratorMetadata": true,
    ```
  
  - Criar o arquivo na raiz do projeto ormconfig.json para ser feita a configuracao do orm:
    - Dentro do arquivo tem que ter uma configuracao para conexao com o banco no meu caso as configuracoes com o meu banco ficou assim:
      ```
      {
        "type": "postgres",
        "host": "localhost",
        "port": 5432,
        "username": "postgres",
        "password": "1234",
        "database": "postgres",
        "entities": [
          "src/app/models/*.ts"
        ],
        "migrations": [
          "src/database/migrations/*.ts"
        ],
        "cli": {
          "migrationsDir": "src/database/migrations"
        } 
      }
      ```
  
   - Depois de colocar as configuracoes e preciso criar as pastas e os arquivo que foram colocados na configuracao, vamos comecar com a pasta app, que dentro dela vai o nosso models, para que sejam armezenados la as entidades do banco.

   - Para armazenar as migrations vamos criar uma pasta com o nome de database e dentro dela a pasta migrations para armazenar as migrations.

   - Vamos precisar usar a cli (Linha de comando) do typeorm para isso precisamos alterar o script e adicionar um novo script, para executar o typescript quando estivermos usando, ficando assim:
      
    "typeorm": "npx ts-node-dev ./node_modules/typeorm/cli.js"


   - Precisamos dizer para cli em qual arquivo vamos criar as migrations, o codigo fica assim:
    ```
      "cli": {
      "migrationsDir": "src/database/migrations"
      }
    ```

**Configurando a conexao com o banco de dados**
  - Criar um arquivo na pasta database com o nome connect.ts
  - A configuracao dentro do arquivo deve ficar assim:
    ```
      import { createConnection } from 'typeorm';
      createConnection().then(() => console.log('Successfully connected with database'));
    ```

  - Depois da configuracao devemos importar no arquivo raiz que e o server.ts o arquivo de conexao, ficando assim:
    ```
      import './database/connect';
    ```

**Criando a migration de usuario**
  - Para criar uma migration precisamos rodar o seguinte comando:
    ``` sh
    ❯  yarn typeorm migration:create -n <Nome da tabela>
    ```

  - Dentro da migration criada deve existir as configuracoes para criacao de uma tabela e suas colunas no meu caso para esse projeto ficaram assim:
  ```
    import { MigrationInterface, QueryRunner, Table } from 'typeorm';

    export class CreateUsersTable1603416800249 implements MigrationInterface {
      public async up(queryRunner: QueryRunner): Promise<void> {
          // E necessario essa configuracao para que o auto-increment funcione na coluna id da tabela users.
          await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

          await queryRunner.createTable(new Table({
            name: 'users', // Nome da Tabela
            columns: [  // Para criar as colunas do banco
                {
                    name: 'id',     //Nome da coluna
                    type: 'uuid',   //Tipo da coluna
                    isPrimary: true,    // Declarando que e uma chave primaria
                    generationStrategy: 'uuid', // Criando um auto increment
                    default: 'uuid_generate_v4()',
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isUnique: true,
                },
                {
                    name: 'password',
                    type: 'varchar',
                },
            ]
        }));
      }

      public async down(queryRunner: QueryRunner): Promise<void> {
          await queryRunner.dropTable('users');
          await queryRunner.query('DROP EXTENSION "uuid-ossp"')
      }
    }
  ```

  - Para rodar a migration com o comando para criar no banco a tabela, devemos rodar o:
  ```sh
  ❯  yarn typeorm migration:run
  ```

  - Assim que criamos nossa tabela precisamos criar o model dela para conseguir trabalhar com os dados e as configuracoes de cada tabela no banco.

**Criando models**
  - Devemos criar o arquivo com o nome da tabela, no meu caso so a de users.
  - Precisamos trocar o arquivo para inicializacao com construtor no tsconfig.json ficando assim:
    ```
      "strictPropertyInitialization": false,
    ```
  
  - Devemos importar o Entity do typeorm que e um decorator, uma funcao que executa outra funcao dentro do codigo.
  - Para indicar qual que e a chave primaria da tabela precisamos importar a PrimaryGeneratedColumn.
  - O model de usuarios ficara assim por enquanto:
    - Usando o entity como decorator.
    - PrimaryGeneratedColumn para mostrar qual que e a chave primaria da tabela.
    - E o Column para definir o resto das colunas da tabela.
    O codigo fica assim:
    ```
      import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

      @Entity('users')
      class User {
        @PrimaryGeneratedColumn('uuid')
        id: string;

        @Column()
        email: string;

        @Column()
        password: string;
      }

      export default User;
    ```

**Criando a rota de cadastro dos usuarios**
  - Devemos criar a pasta controllers dentro da pasta app, que vao conter a logica de todas as rotas da tabela usuarios.

  - Criar o arquivo UserController.ts
    Dentro do arquivo so vai conter o metodo store, para poder armazenar os dados que o cliente vai mandar para o servidor, que depois sera armazenado para o banco de dados.

    O codigo dentro do controller deve ficar assim por enquanto usando o metodo store:
    ```
      import { Request, Response } from 'express';

      class UserController {
        store(req: Request, res: Response) {
          return res.send('ok');
        }

      }

      export default new UserController();
    ```
  
  - Devemos importar o controller no arquivo de rotas, a importacao dentro do arquivo de rotas nesse casso deve ficar assim:
  ```
    import UserController from './app/controllers/UserController';
  ```

  - Apos a importacao do controller devemos criar a rota de cadastro que vai receber o metodo post, a criacao da rota ficara assim usando o controller que foi importado:
  ```
    router.post('/users', UserController.store);
  ```

  - Assim que for criada a rota devemos testar para ver se o funcionamento esta correto, usando o insomnia para as requisicoes req e rest da rota.

  - Se a resposta do Insomnia for Ok devemos seguir para criacao de fato de um usuario na rota de cadastro e criar a logica do codigo para a criacao do usuario:

  - Precisamos cryptografar a senha que o usuario digita na aplicacao, para isso vamos usar o bcryptjs, o codigo de instalacao fica assim:
  ```
    yarn add bcryptjs
    yarn add @types/bcryptjs -D 
  ```

  - Assim que tiver instalado o bcryptjs devemos criar um metodo dentro do model de usuarios ficando assim o codigo:

  ```
    @BeforeInsert()
    @BeforeUpdate()
    hashPassword() {
      this.password = bcrypt.hashSync(this.password, 8);
    }
  ```

  - Importamos o BeforeInsert e o BeforeUpdate, para que seja criptografado antes de inserir no banco e antes de atualizar no banco.

  - Agora devemos apagar o dado que esta no banco e criar um novo para poder usar os mesmos dados e testar se a criptografia esta funcionando.

  - O codigo do controller para criacao de um usuario deve ficar assim por enquanto:
  ```
    import { Request, Response } from 'express';
    // Usando o getRepository para conseguir usar o model de usuario aqui no controller
    import { getRepository } from 'typeorm'; 

    import User from '../models/Users';

    class UserController {
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
  ```

**Criando a rota de autenticacao**

  - Devemos criar o controller para a rota de autenticacao, podemos nesse caso apenas duplicar a rota de criacao e alterar as funcoes e os nomes de UserController para AuthController, pois as importacoes sao praticamente as mesmas.

  - Para verificarmos se a senha que o usuario digitou e a mesma que esta no cadastro dele no banco, devemos comecar importando o bcryptjs.

  - Criar a validacao do password digitado pelo usuario com o que esta na base de dados, se for validado e for igual os passwords devemos retornar um tokken jwt para o usuario, senao retorna um erro 401. Para retornar o tokken devemos instalar a seguinte biblioteca:
    ```sh 
    ❯  yarn add jsonwebtoken
    ❯ yarn add @types/jsonwebtoken -D
    ```

  - Assim que terminar a instalacao do jsonwebtoken devemos importar o jwt no controller de autenticacao, ficando assim o codigo de importacao:
    ```
      import jwt from 'jsonwebtoken';
    ```

  - Depois devemos criar a variavel  para iniciar o jwt e gerar o tokken que vai manter o usuario conectado na aplicacao.

  - O codigo de autenticacao deve ficar assim, no caso desse projeto. Como e um projeto teste para fins educativos o tratamento do token foi bem basico, mas para gerar um token em um projeto real, este token deve estar em um arquivo .env:
    ```
      const token = jwt.sign({ id: user.id }, 'secret' , { expiresIn: '1d' });

      return res.json({
        user,
        token,
      });
    ```

  - Apos a cricao do token e a logica, devemos criar a rota de autenticacao de fato no arquivo routes.ts, a rota ficara assim:
    ```
      router.post('/auth', AuthController.authenticate);
    ```

  - Rodamos no insomnia para ver se esta retornando o tokken o os dados da rota auth, nao e legal mostrarmos a password do usuario na requisicao do front.Para isso vamos usar a seguinte linha de codigo para que nao seja enviada a senha na rota de autenticacao:
    ```
      delete user.password;
    ```
  
**Criando o midleware de atutenticacao**
  - Os middlewares servem para aplicarmos a regra de autenticacao da aplicacao e como o usuario vai ficar com o token enquanto navega na aplicacao.
  - Para comecar devemos criar uma pasta dentro do app, com o nome de middlewares: 

  - Dentro da pasta de middlewares devemos criar o arquivo para autenticacao: 

  - O codigo para o middleware de autenticacao deve ficar assim nesse caso:
    ```
      import { Request, Response, NextFunction} from 'express'; 
      import jwt from 'jsonwebtoken';

      export default function authMiddleware(req: Request, res: Response, next:NextFunction) {
        const { authorization } = req.headers;

        if(!authorization) {
          return res.sendStatus(401);
        }

        const token = authorization.replace('Bearer', '').trim();

        try {
          const data = jwt.verify(token, 'secret');
        } catch {
          return res.sendStatus(401);
        }
      }
    ```
  
  - Devemos criar no arquivo de rotas uma rota para listagem usando o middleware de autenticacao para ver se a regra esta funcionando e o codigo esta certo, assim testando que o usuario com o token autenticado apenas, podera ver a lista de usuarios. Para que seja criada a rota de listagem com o token precisamos criar como vai funcionar a rota nos controllers de usuarios. O codigo para criacao da rota no arquivo routes.ts ficara assim:
    ```
      import authMiddleware from './app/middlewares/authMiddleware';

      router.get('/users', authMiddleware, UserController.index);
    ```
  
  - A criacao do rota e bem simples e devera ficar assim por enquanto apenas para testar se a autenticacao esta funcionando:
    ```
      index(req: Request, res: Response) {
      return res.send('ok')
    }
    ```

  - Nesse caso precismos criar um tipo personalizado do express para poder salvar a id do usuario dentro da requisicao, para isso vamos criar uma pasta @types, e dentro dela o arquivo express.d.ts para criar esse tipo. Para a criacao do userId dentro do Request nos vamos pegar o que ja tem no request e apenas adicionar o userId do tipo string, o codigo deve ficar assim:
    ```
      declare namespace Express {
        export interface Request {
          userId: string;
        }
      }
    ```
  
### Finalizada a criacao da API de Autenticacao
  - Finalizando a API, e agora devemos continuar com  a criacao do front-end para essa api e testar as rotas de autenticacao com o front end, e depois fazer o deploy da aplicacao.

  Devemos ler, revisar e estudar muito em cima desse codigo para que isso fique com o foco total na cabeca, foi incrivel esse aprendizado junto ao video do Mateus Silva: https://www.youtube.com/watch?v=TjAXBLszCb0&t=2018s.

  Valeu 🖖🏼 🤙🏻 !

  


  




