import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';
import path from 'path';

export const runMigrationsAndSeeders = async (sequelize: Sequelize) => {

  const migrator = new Umzug({
    migrations: {
      glob: path.join(__dirname, '../../migrations/*.js'),
      resolve: ({ name, path, context }) => {
        const migration = require(path as string);
        return {
          name,
          up: () => migration.up(context.queryInterface, context.Sequelize),
          down: () => migration.down(context.queryInterface),
        };
      },
    },
    context: { queryInterface: sequelize.getQueryInterface(), Sequelize },
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  await migrator.up();

  const seeder = new Umzug({
    migrations: {
      glob: path.join(__dirname, '../../seeders/*.js'),
      resolve: ({ name, path, context }) => {
        const seeder = require(path as string);
        return {
          name,
          up: () => seeder.up(context.queryInterface, context.Sequelize),
          down: () => seeder.down(context.queryInterface),
        };
      },
    },
    context: { queryInterface: sequelize.getQueryInterface(), Sequelize },
    storage: new SequelizeStorage({ sequelize }),
    logger: console,
  });

  await seeder.up();

};