const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create out User model
class User extends Model {}

// define table columns and configuration
User.init(
  {
    // TABLE FIELDS' DEFINITIONS GO HERE
    // define an id field
    id: {
      // use the special Sequelize DataTypes object to provide what type of data it is
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    // define a username field
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // define an email field
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      // allowNull must be false to run data through validators before creating table data
      validate: {
        isEmail: true
      }
    },
    // define a password field
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // password min length
        len: [4]
      }
    }
  },
  {
    hooks: {
      // set up beforeCreate lifecycle "hook" functionality Async
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      // set up beforeUpdate lifecycle "hook" functionality Async
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        return updatedUserData;
      }
    },
    // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration)

    // pass in our imported sequelize connection (the direct connection to out database)
    sequelize,
    // don't automatically create createAt/updatedAt timestamp field
    timestamps: false,
    // use underscores instead of camel-casing
    underscored: true,
    // make it so our model name stays lowercase in the database
    modelName: 'user'
  }
);

module.exports = User