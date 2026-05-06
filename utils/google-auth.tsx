import { google } from "googleapis";

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

// Validasi awal jika ada env yang kurang
if (!clientId || !clientSecret || !refreshToken) {
  console.error("❌ Kredensial Google OAuth tidak lengkap di file .env!");
  console.error({
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    hasRefreshToken: !!refreshToken,
  });
}

export const auth = new google.auth.OAuth2(
  clientId,
  clientSecret,
  "https://developers.google.com/oauthplayground",
);

if (refreshToken) {
  auth.setCredentials({
    refresh_token: refreshToken,
  });
}
