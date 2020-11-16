const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Component extends Model {
    static init(sequelize) {
        return super.init(
            {
                x_pos: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                y_pos: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                head: {
                    type: DataTypes.STRING(30),
                    allowNull: false,
                },
                paragraph: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                background_img: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                expiry_date: {
                    type: DataTypes.DATE,
                    allowNull: false,
                }
            },
            {
                modelName: "Component",
                tableName: "components",
                paranoid: true,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
                sequelize
            }
        );
    }
    static associate(db) {
        db.Component.belongsTo(db.User);
    }
}
