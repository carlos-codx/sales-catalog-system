'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    try {

      await queryInterface.bulkInsert('Units', [
        {
          name: 'Unidad',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Litro',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Kilogramo',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Caja',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Paquete',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Gramo',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], {});

      console.log('Data inserted into Units table successfully.');

    } catch (error) {
      console.error('Error inserting data into Units table:', error);
      throw error;
    }

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Units', null, {});
  }
};
