const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class BoardMember extends Model {
    static init(sequelize) {
        return super.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            username: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            profile_img: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            loggedInAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            avail_blocks: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 30,
            },
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
    static associate(db) {
        db.BoardMember.belongsTo(db.Board);
        db.BoardMember.belongsTo(db.User);
        db.BoardMember.hasMany(db.TextContent);
        db.BoardMember.hasMany(db.Note);
        db.BoardMember.hasMany(db.Image);
        db.BoardMember.hasMany(db.Comment);
    }
};
