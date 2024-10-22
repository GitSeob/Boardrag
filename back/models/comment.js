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
		db.Comment.belongsTo(db.BoardMember, {onDelete: 'CASCADE'});
		db.Comment.belongsTo(db.Board, {onDelete: 'CASCADE'});
		db.Comment.belongsTo(db.Note, {onDelete: 'CASCADE'});
		db.Comment.belongsTo(db.TextContent, {onDelete: 'CASCADE'});
		db.Comment.belongsTo(db.Image, {onDelete: 'CASCADE'});
	}
}
