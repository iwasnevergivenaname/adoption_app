'use strict';
const bcrypt = require('bcrypt');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.user.hasMany(models.pet);
      models.user.hasMany(models.resource);
    }
  };
  user.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 99],
          msg: 'name must be 1 to 99 characters'
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      validates: {
        len: {
          args: [3 - 30],
          msg: 'username must be between 3 and 30 characters'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'invalid email'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 99],
          msg: 'password must be between 8 and 99 characters'
        }
      }
    },
    bio: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'user',
  });
  // hash the password
  user.addHook('beforeCreate', function (pendingUser) {
    let hash = bcrypt.hashSync(pendingUser.password, 12);
    pendingUser.password = hash;
  });

  user.prototype.validPassword = function (passwordTyped) {
    let correctPassword = bcrypt.compareSync(passwordTyped, this.password);
    // return true if it's the right password
    return correctPassword;
  };

  // remove password before it's serialized
  user.prototype.toJSON = function () {
    let userData = this.get();
    delete userData.password;
    return userData;
  };
  return user;
};