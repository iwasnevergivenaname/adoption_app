'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.pet.belongsTo(models.user);    }
  };
  pet.init({
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    gender: DataTypes.STRING,
    age: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'pet',
  });
  return pet;
};