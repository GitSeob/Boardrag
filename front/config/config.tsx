const isProduct = process.env.NODE_ENV === 'production';

export const FT_UID = isProduct ? process.env.PRODUCT_UID : process.env.DEV_UID;
export const FT_SECRET = !isProduct ? process.env.DEV_CLIENT_SECRET : process.env.PRODUCT_CLIENT_SECRET;
export const GOOGLE_CID = process.env.DEV_GOOGLE_CID;
export const FRONT_URL = !isProduct ? process.env.DEV_URL : process.env.PRODUCT_URL;
export const AUTH = '/auth';
export const FTAPI_URL = 'https://api.intra.42.fr';
export const OAUTH = `${FTAPI_URL}/oauth`;

export const REDIR_URI = !isProduct ? 'http://localhost:3090/auth' : 'https://42board.com/auth';

export const getOauthTokenUrl = (code: string): string =>
	`${OAUTH}/token?code=${code}&grant_type=authorization_code&client_id=${FT_UID}&client_secret=${FT_SECRET}&redirect_uri=${FRONT_URL}${AUTH}`;

export const googleOauth = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CID}&redirect_uri=${REDIR_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email&approval_prompt=force&access_type=offline`;
