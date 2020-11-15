const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Text extends Model {
    static init(sequelize) {
        return super.init(
            {
                x_pos: {
                    type: DataTypes.NUMBER,
                    allowNull: false,
                },
                y_pos: {
                    type: DataTypes.NUMBER,
                    allowNull: false,
                },
                content: {
                    type: DataTypes.TEXT(100),
                    allowNull: false,
                },
                expiry_date: {
                    type: DataTypes.DATE,
                    allowNull: false,
                }
            },
            {
                modelName: "Text",
                tableName: "texts",
                paranoid: true,
                charset: "utf8",
                collate: "utf8_general_ci",
                sequelize
            }
        );
    }
    static associate(db) {
        db.Text.belongsTo(db.User);
    }
}
