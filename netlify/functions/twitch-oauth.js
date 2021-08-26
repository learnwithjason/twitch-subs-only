import fetch from 'node-fetch';
import cookie from 'cookie';

export async function handler(event) {
  const { code } = event.queryStringParameters;

  const url = `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=http://localhost:8888/.netlify/functions/twitch-oauth`;

  const res = await fetch(url, {
    method: 'POST',
  });

  if (!res.ok) {
    console.log(res);
    return {
      statusCode: 500,
      body: JSON.stringify(res),
    };
  }

  const response = await res.json();

  const token = response.access_token;
  const validatedResponse = await fetch(
    'https://id.twitch.tv/oauth2/validate',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  ).then((res) => res.json());

  const cookieBody = {
    ...response,
    user_id: validatedResponse.user_id,
    login: validatedResponse.login,
  };

  const tokenCookie = cookie.serialize(
    'lwj_twitch',
    JSON.stringify(cookieBody),
    {
      secure: true,
      httpOnly: true,
      path: '/',
      maxAge: response.expires_in,
    },
  );

  // check subscription status
  const subResponse = await fetch(
    `https://api.twitch.tv/helix/subscriptions/user?broadcaster_id=256094361&user_id=${validatedResponse.user_id}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Client-ID': process.env.TWITCH_CLIENT_ID,
      },
    },
  ).then((res) => res.json());

  const [subData] = subResponse.data;

  if (!subData.tier) {
    return {
      statusCode: 401,
      body: 'Unauthorized',
    };
  }

  console.log(JSON.stringify(subResponse.data, null, 2));

  return {
    statusCode: 301,
    headers: {
      'Set-Cookie': tokenCookie,
      Location: '/subscribers/',
    },
    body: 'OK',
  };
}
