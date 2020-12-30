const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class User extends Model {
    static init(sequelize) {
        return super.init(
            {
                username: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                    unique: true,
                },
                profile_img: {
                    type: DataTypes.TEXT(),
                    allowNull: true,
                },
                is_admin: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                },
                refresh_token: {
                    type: DataTypes.TEXT(),
                    allowNull: true,
                },
                access_token: {
                    type: DataTypes.TEXT(),
                    allowNull: true,
                },
            },
            {
                modelName: "User",
                tableName: "users",
                paranoid: true,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci", // 한글 저장
                sequelize,
            }
        );
    }
    static associate(db) {
        db.User.hasMany(db.Board, { as: "Admin", foreignKey: "AdminId" });
        db.User.belongsToMany(db.Board, {
            through: db.BoardMember,
            as: "Boards",
        });
        db.User.hasMany(db.BoardMember, {
            as: "Member",
            foreignKey: "UserId"
        });
        // db.User.hasMany(db.Chat);
    }
};
