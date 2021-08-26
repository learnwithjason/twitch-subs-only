import fetch from 'node-fetch';
import cookie from 'cookie';

export async function handler(event) {
  const { lwj_twitch } = cookie.parse(event.headers.cookie);
  const tokenObject = JSON.parse(lwj_twitch);
  const accessToken = tokenObject.access_token;

  const response = await fetch(
    `https://api.twitch.tv/helix/users?id=${tokenObject.user_id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Client-ID': process.env.TWITCH_CLIENT_ID,
      },
    },
  ).then((res) => res.json());

  return {
    statusCode: 200,
    body: JSON.stringify(response, null, 2),
  };
}
