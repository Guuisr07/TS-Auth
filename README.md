## Node setup

Projeto para mostrar o setup passo a passo de uma inicializacao de um projeto com node-js

- Passo 1: Criamos a pasta com o nome do projeto.

- Passo 2: Assim que criarmos rodamos um git init, para poder inicializar um repositorio local que depois sera colocado no github.
```sh
~ ❯ git init
```


- Passo 3: Rodar o yarn init -y ou o npm init -y, para criar o nosso package.json, que serve para mostrar a versao dos pacotes que estamos utilizando, rodar a nossa aplicacao e alguma configuracaos que vao aparecer no decorrer do desenvolvimento da aplicacao.
```sh
~ ❯ yarn init -y
```

- Passo 4: Instalar o typescript como dependencia de desenvolvimento, usar o typescript para projetos com node, devemos rodar yarn add typescript -D.
```sh
~ ❯ yarn add typescript -D
```

- Passo 5: Rodar o yarn tsc --init para criar o arquivo tsconfig.json, que serve para armazenar todas as configuracoes do typescript.
```sh
~ ❯ yarn tsc --init
```

- Passo 6: Criar a pasta src  para armezenar os codigos da aplicacao a ser criada. 

- Passo 7: Criar o arquivo server.ts que vai ser o servidor com o typescript.

- Passo 8: Adicionar o express para trabalharmos com rotas na aplicacao se estivermos construindo uma api, rodando o yarn add express, depois que instalar o express ele vai mostrar um erro aonde devemos adicionar as tipagens do express para typescript, rodando assim o yarn add @types/express -D (Como dependencia de desenvolvimento).
```sh
~ ❯ yarn add express @types/express -D
```

- Passo 9: Devemos inciar a configuracao padrao do server.ts: 
```
  import express from 'express';

  const app = express();

  app.get('/', (request, response) => {
    return response.json({ message: 'Hello World' })
  })

  app.listen(3333);  
```

- Passo 10: Devemos instalar ts-node-dev, ele e a juncao do tsc (Que serve para transformar o codigo .ts em .js para que fique pronto para ser enviado pra producao), node (Que executa o codigo do server) e o nodemon (que fica observando o codigo para quando acontecer as alteracoes). para isso devemos rodar:
```sh
~ ❯ yarn add ts-node-dev -D
```

- Passo 11: Para utilizarmos o ts-node-dev precisamos criar um script no package.json para que ele rode o server.ts da pasta src, o codigo fica assim:
```
  "scripts": {
    "dev": "ts-node-dev --respawn --transpileOnly --ignore-watch node_modules src/server.ts"
  },
```

- Passo 12: Por opcao ja dar um commit para ter um controle do que foi feito no setup e tambem para que se torne uma boa pratica sempre dar um commit quando configuracoes forem feitas ou criacoes de alguns servicos na aplicacao. Para isso devemos criar o arquivo .gitignore e colocar node_modules para que o arquivo nao va para o github por se tratar de um arquivo muito grande. 

**Configuracoes no tsconfig.json**

- Passo 1: Para que quando jogar o codigo em producao nao va o codigo typescript e apenas o javascript precisamos configurar duas partes do nosso arquivo tsconfig.json, que sao: 
```
  "outDir": "./dist",                        
  "rootDir": "./src", 
```
Passo 2: Depois tambem colocar a pasta dist que vai ficar o nosso codigo em producao no .gitignore. 

Passo 3:Ainda no arquivo tsconfig.json vamos mudar o target do es5 para o es2017 para que o codigo em producao nao fique tao pesado com os novos recursos do es6.
```
  "target": "es2017", 
```

Passo 4: Devemos habilitar o allowJs, para que possa ser usado arquivos .js pois alguma bibliotecas nao entendem o typescript.
```
  "allowJs": true,
```

Passo 5: Incluir a lib do es6.
```
  "lib": ["es6"],
```

Passo 6: Devemos habilitar o removeComments para que ele remova os comentarios quando o codigo for para producao.
```
  "removeComments": true,
```

Passo 7: Devemos habiliatar os decorators para a utilizacao do TypeOrm ou qualquer orm que use decorators.
```
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true,
```

Passo 8: Habilitar o typeRoots para conseguirmos sobrescrever alguma tipagem de uma lib
```
  "typeRoots": [
        "./node_modules/@types",
        "./src/@types"
      ], 
```

Passo 9: Devemos adicionar: 
```
  "resolveJsonModule": true,
```

Passo 10: Tirar todos os comentarios do arquivo para que fique facil utilizar:

