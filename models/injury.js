'use strict';
module.exports = function(sequelize, DataTypes) {
  var Injury = sequelize.define('Injury', {
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
          Injury.hasMany(models.Comment);
      }
    }
  });
  return Injury;
};
