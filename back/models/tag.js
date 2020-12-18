const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Tag extends Model {
    static init(sequelize) {
        return super.init(
            {
                content: {
                    type: DataTypes.STRING(40),
                    allowNull: false,
                    unique: true,
                },
            },
            {
                modelName: "Tag",
                tableName: "tags",
                paranoid: true,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
                sequelize
            }
        );
    }
}
