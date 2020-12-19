const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Image extends Model {
    static init(sequelize) {
        return super.init(
            {
                url: {
                    type: DataTypes.TEXT,
                    allowNull: false
                },
                x: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                y: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                width: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                height: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                expiry_date: {
                    type: DataTypes.DATE,
                    allowNull: false,
                }
            },
            {
                modelName: "Image",
                tableName: "images",
                paranoid: true,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
                sequelize
            }
        );
    }
    static associate(db) {
        db.Image.belongsTo(db.User);
        db.Image.belongsTo(db.Board);
        db.Image.hasMany(db.Comment);
    }
}
