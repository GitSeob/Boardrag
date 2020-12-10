const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class DM extends Model {
    static init(sequelize) {
        return super.init(
            {
                userId: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                username: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                content: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
            },
            {
                modelName: "Chat",
                tableName: "chats",
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
                sequelize,
            }
        );
    }

    static associate(db) {
        db.Chat.belongsTo(db.Board);
    }
};
