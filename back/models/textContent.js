const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class TextContent extends Model {
    static init(sequelize) {
        return super.init(
            {
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
                content: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                expiry_date: {
                    type: DataTypes.DATE,
                    allowNull: false,
                }
            },
            {
                modelName: "TextContent",
                tableName: "textContents",
                paranoid: true,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
                sequelize
            }
        );
    }
    static associate(db) {
        db.TextContent.belongsTo(db.User);
        db.TextContent.belongsTo(db.Board);
        db.TextContent.hasMany(db.Comment);
    }
}
