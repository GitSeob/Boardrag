const fs = require('fs');
const env = process.env.NODE_ENV || "development";
const db = require("./models");
const delURL = env === 'development' ? "http://localhost:3095/" : "https://api.42board.com/";
const schedule = require('node-schedule');

const modules = {};

modules.deleteFile = async (filename) => {
	const log_time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
	const file = `./uploads/${filename.replace(delURL, "")}`;
	fs.unlink(`./${file}`, (err) => {
		if (err) console.error(err);
	});
	fs.appendFile('./logs/delete_files.txt', `[${log_time}]${file}\n`, err => {
		if (err) console.error(err);
	});
};

modules.allDeleteFile = async (fileList) => {
	if (!Array.isArray(fileList))
		throw new Error('fileList is not Array type');
	try{
		await fileList.forEach(file => {
			if (file.match(/\.(jpg|gif|tif|bmp|png)$/i))
			{
				try {
					modules.deleteFile(file);
				} catch (e) {
					console.error(e);
				}
			}
		});
	} catch (e) {
		console.error(e);
		throw e;
	}
}

modules.renameFileForSave = async (filename) => {
	if (!filename)
		return "";
	const retName = filename.replace("uploads/", "").replace(":::not_save:::", "");
	const newFileName = filename.replace(":::not_save:::", "").replace(delURL, "./uploads/");
	await fs.rename(filename.replace(delURL, "./uploads/"), newFileName, err => {
		if (err) throw err;
	});
	return retName;
}

modules.runSchduler = () => {
	console.log("\n\nSETTING FILE REMOVE SCHEDULER\nIt runs every hour on the hour.\n\n");
	schedule.scheduleJob('0 0 * * * *', async () => {
		const t = await db.sequelize.transaction();
		try {
			console.log("RUN SCHEDULER ... ");
			const deleteFiles = []; // 삭제할 파일을 저장할 배열

			await db.TextContent.findAll({
				where: {
					expiry_date: {
						[db.Sequelize.Op.lte]: db.Sequelize.fn('NOW'),
						[db.Sequelize.Op.ne]: null
					}
				},
				attributes: ["id"],
			}, {
				transaction: t
			}).then(res => {
				res.forEach(row => {
					row.destroy({ transaction: t});
				});
			});

			await db.Image.findAll({
				where: {
					expiry_date: {
						[db.Sequelize.Op.lte]: db.Sequelize.fn('NOW'),
						[db.Sequelize.Op.ne]: null
					}
				},
				attributes: ["id", "url"],
			}, {
				transaction: t
			}).then(res => {
				res.forEach(row => {
					deleteFiles.push(row.url);
					row.destroy({ transaction: t});
				});
			});

			await db.Note.findAll({
				where: {
					expiry_date: {
						[db.Sequelize.Op.lte]: db.Sequelize.fn('NOW'),
						[db.Sequelize.Op.ne]: null
					}
				},
				attributes: ["id", "background_img"],
			}, {
				transaction: t
			}).then(res => {
				res.forEach(row => {
					deleteFiles.push(row.background_img);
					row.destroy({ transaction: t });
				});
			});

			await modules.allDeleteFile(deleteFiles); // 배열에 저장되어 있는 이름의 파일들을 제거한다.

			const availFiles = []; // 현재 유효한 컨텐츠에 포함되어있는 파일을 저장할 배열

			await db.Image.findAll({
				attributes: ["url"],
			}).then(res => {
				res.forEach(row => {
					availFiles.push(row.url);
				});
			})
			await db.Note.findAll({
				attributes: ["background_img"],
			}).then(res => {
				res.forEach(row => {
					if (row.background_img)
						availFiles.push(row.background_img);
				});
			});

			await fs.readdir("./uploads", (error, filelist) => {
				if (error)
					throw error;
				modules.allDeleteFile(
					filelist
					.filter(elem => !(availFiles.find(file => file.replace(`${delURL}`, "") === elem)))
				); // 유효파일배열에 저장되어 있지 않으면 삭제한다.
			});
			await fs.readdir("./uploads/profile", (error, filelist) => {
				if (error)
					throw error;
				filelist.forEach(file => {
					if (file.indexOf(":::not_save:::"))
						modules.deleteFile(file);
				}); // 임시로 저장되어있는 파일이 남아있으면 삭제한다.
			});
			await fs.readdir("./uploads/background", (error, filelist) => {
				if (error)
					throw error;
				filelist.forEach(file => {
					if (file.indexOf(":::not_save:::"))
						modules.deleteFile(file);
				}); // 임시로 저장되어있는 파일이 남아있으면 삭제한다.
			});
			await t.commit();
			console.log("END SCHEDULER'S JOB ... ");
		} catch(e) {
			console.error(e);
			await t.rollback();
		}
	})
};

module.exports = modules;
