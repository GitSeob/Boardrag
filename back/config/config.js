require('dotenv').config();

module.exports = {
    "development": {
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
        "username": process.env.DB_USER,
        "password": process.env.DB_PASSWORD,
        "database": process.env.DB_NAME,
        "dialect": "mysql",
        "api_client_id": process.env.PRODUCT_UID,
        "api_client_secret": process.env.PRODUCT_CLIENT_SECRET,
        "api_oauth_url": "https://api.intra.42.fr/oauth/token",
        "api_url": "https://api.intra.42.fr/v2/",
        "api_redirect_uri": process.env.PRODUCT_URL,
    }
}
