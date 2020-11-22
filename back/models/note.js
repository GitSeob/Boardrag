const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Note extends Model {
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
                modelName: "Note",
                tableName: "notes",
                paranoid: true,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
                sequelize
            }
        );
    }
    static associate(db) {
        db.Note.belongsTo(db.User);
        db.Note.belongsTo(db.Board);
        db.Note.hasMany(db.Comment);
    }
}
