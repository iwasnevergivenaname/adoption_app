'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.profile.belongsTo(models.user)
    }
  };
  profile.init({
    likes: DataTypes.STRING,
    dislikes: DataTypes.STRING,
    bio: DataTypes.TEXT,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'profile',
  });
  return profile;
};