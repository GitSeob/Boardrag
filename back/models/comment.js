// module.exports = (sequelize, DataTypes) => {
//     const Comment = sequelize.define('Comment', {
//         content_category: {
//             type: DataTypes.NUMBER,
//             allowNull: false,
//         },
//         content_id: {
//             type: DataTypes.NUMBER,
//             allowNull: false,
//         },
//         content: {
//             type: DataTypes.TEXT,
//             allowNull: false,
//         },
//     }, {
//         charset: "utf8mb4",
//         collate: "utf8mb4_general_ci",
//     });

//     Comment.associate = (db) => {
//         db.Comment.belongsTo(db.User);
//     }

//     return Comment;
// }
const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Comment extends Model {
    static init(sequelize) {
        return super.init(
            {
                content_category: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                },
                content_id: {
                    type: DataTypes.INTEGER,
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
