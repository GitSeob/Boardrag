const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class BoardMember extends Model {
    static init(sequelize) {
        return super.init(
        {
            // id가 기본적으로 들어있다.\
            username: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            loggedInAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            avail_blocks: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 30,
            }
        },
        {
            modelName: "BoardMember",
            tableName: "boardMembers",
            charset: "utf8",
            collate: "utf8_general_ci", // 한글 저장
            sequelize,
        }
        );
    }
    static associate(db) {}
};
