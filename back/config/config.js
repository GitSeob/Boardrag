require('dotenv').config();

module.exports = {
	"development": {
		"uri": "http://localhost:3095",
		"username": process.env.DB_USER,
		"password": process.env.DB_PASSWORD,
		"database": process.env.DEV_DB_NAME,
		"dialect": "mysql",
		"api_client_id": process.env.DEV_UID,
		"api_client_secret": process.env.DEV_CLIENT_SECRET,
		"api_oauth_url": "https://api.intra.42.fr/oauth/token",
		"api_url": "https://api.intra.42.fr/v2/",
		"api_redirect_uri": process.env.DEV_URL,
		"google_cid": process.env.DEV_GOOGLE_CID,
		"google_secret": process.env.DEV_GOOGLE_SECRET,
	},
	"test": {
		"username": process.env.DB_USER,
		"password": process.env.DB_PASSWORD,
		"database": process.env.DB_NAME,
		"dialect": "mysql",
		"api_client_id": process.env.DEV_UID,
		"api_client_secret": process.env.DEV_CLIENT_SECRET,
		"api_oauth_url": "https://api.intra.42.fr/oauth/token",
		"api_url": "https://api.intra.42.fr/v2/",
		"api_redirect_uri": process.env.DEV_URL,
	},
	"production": {
		"uri": "https://42board.com",
		"username": process.env.DB_USER,
		"password": process.env.DB_PASSWORD,
		"database": process.env.DB_NAME,
		"dialect": "mysql",
		"api_client_id": process.env.PRODUCT_UID,
		"api_client_secret": process.env.PRODUCT_CLIENT_SECRET,
		"api_oauth_url": "https://api.intra.42.fr/oauth/token",
		"api_url": "https://api.intra.42.fr/v2/",
		"api_redirect_uri": process.env.PRODUCT_URL,
		"google_cid": process.env.PRODUCT_GOOGLE_CID,
		"google_secret": process.env.PRODUCT_GOOGLE_SECRET,
	}
}
