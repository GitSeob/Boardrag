const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Comment extends Model {
    static init(sequelize) {
        return super.init(
            {
                content_category: {
                    type: DataTypes.NUMBER,
                    allowNull: false,
                },
                content_id: {
                    type: DataTypes.NUMBER,
                    allowNull: false,
                },
                content: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
            },
            {
                modelName: "Comment",
                tableName: "comments",
                paranoid: true,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
                sequelize
            }
        );
    }
    static associate(db) {
        db.Comment.belongsTo(db.User);
    }
}
