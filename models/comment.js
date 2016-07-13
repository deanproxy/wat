'use strict';
module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define('Comment', {
    text: DataTypes.STRING,
  }, {
    classMethods: {
      associate: function(models) {
          Comment.belongsTo(models.Injury, {
            onDelete: "CASCADE",
            foreignKey: {
              allowNull: false
            }
          });
      }
    }
  });
  return Comment;
};

