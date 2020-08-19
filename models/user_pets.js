'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_pets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user_pets.init({
    userId: DataTypes.INTEGER,
    petId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'user_pets',
  });
  return user_pets;
};