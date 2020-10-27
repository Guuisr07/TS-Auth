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
