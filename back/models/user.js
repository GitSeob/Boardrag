const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class User extends Model {
    static init(sequelize) {
        return super.init(
            {
                username: {
                    type: DataTypes.STRING(30),
                    allowNull: false,
                    unique: true,
                },
                profile_img: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                request_url: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                is_admin: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                }
            },
            {
                modelName: "User",
                tableName: "users",
                paranoid: true,
                charset: "utf8",
                collate: "utf8_general_ci", // 한글 저장
                sequelize,
            }
        );
    }
    static associate(db) {
        db.User.hasMany(db.Text);
        db.User.hasMany(db.Component);
        // db.User.hasMany(db.Draw);
        db.User.hasMany(db.Comment);
    }
}
