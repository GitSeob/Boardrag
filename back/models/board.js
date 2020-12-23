const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Board extends Model {
    static init(sequelize) {
        return super.init(
            {
                name: {
                    type: DataTypes.STRING(50),
                    allowNull: false,
                    unique: true,
                },
                is_lock: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                },
                password: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                default_blocks: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 30,
                },
                expiry_times: {
                    type: DataTypes.INTEGER,
                    allowNull: true,
                },
                tags: {
                    type: DataTypes.TEXT,
                },
                recent_time: {
                    type: DataTypes.DATE,
                    defaultValue: DataTypes.NOW,
                },
                background: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                }
            },
            {
                modelName: "Board",
                tableName: "boards",
                paranoid: true,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
                sequelize
            }
        );
    }
    static associate(db) {
        db.Board.belongsTo(db.User, { as: "Admin", foreignKey: "AdminId" });
        db.Board.belongsToMany(db.User, {
            through: db.BoardMember,
            as: "Members",
        });
        db.Board.hasMany(db.BoardMember, {
            as: "Member",
            foreignKey: "BoardId"
        });
        db.Board.hasMany(db.TextContent);
        db.Board.hasMany(db.Image);
        db.Board.hasMany(db.Note);
        db.Board.hasMany(db.Comment);
    }
}
