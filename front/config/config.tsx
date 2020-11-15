const isProduct = process.env.NODE_ENV === 'production';

export const FT_UID = isProduct ? process.env.PRODUCT_UID : process.env.DEV_UID ;
export const FT_SECRET = !isProduct ? process.env.DEV_CLIENT_SECRET : process.env.PRODUCT_CLIENT_SECRET;

export const FRONT_URL = !isProduct ? process.env.DEV_URL : process.env.PRODUCT_URL;
export const AUTH = '/auth';
export const FTAPI_URL = 'https://api.intra.42.fr';
export const OAUTH = `${FTAPI_URL}/oauth`;

export const getOauthTokenUrl = (code: string): string =>
    `${OAUTH}/token?code=${code}&grant_type=authorization_code&client_id=${FT_UID}&client_secret=${FT_SECRET}&redirect_uri=${FRONT_URL}${AUTH}`;
