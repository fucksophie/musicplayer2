/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import md5 from './md5';
import { trace, info, error, attachConsole } from "tauri-plugin-log-api";

const apiKey = '5453fd5264c2114ff3dcd9bd66baa69e';
const sharedKey = '63ee9194df879a2848716d017e016b40';

const baseURL = "https://ws.audioscrobbler.com/2.0/";

export const lastFmApiKey = apiKey;
export const lastFmSharedKey = sharedKey;

// api dependencies
function generateSigObj(object: Record<string, string>) {
  return md5(
    Object.entries(object)
      .sort((a, b) => {
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        return 0;
      })
      .map((z) => z[0] + z[1])
      .join('') + sharedKey
  );
}

function generateSigUrl(rawurl: string) {
  const url = new URL(rawurl);
  return md5(
    [...url.searchParams.entries()]
      .sort((a, b) => {
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        return 0;
      })
      .map((z) => z[0] + z[1])
      .join('') + sharedKey
  );
}

function buildURL(method: string, options = {}, sig = true) {
  let url = `${baseURL}?method=${method}${Object.entries(
    options
  )
    .map((z) => `&${z[0]}=${z[1]}`)
    .join('')}&api_key=${apiKey}`;
  url += `${sig ? `&api_sig=${generateSigUrl(url)}` : ''}&format=json`;
  return url;
}

async function request(method: string, options = {}, post = false, sig = true): Promise<Response> {
  if (post) {
    const body: {
        api_sig?: string;
        method: string;
        api_key: string;
        format?: string;
    } = { ...options, method, api_key: apiKey };

    if (sig) body.api_sig = generateSigObj(body);

    body.format = 'json';
    let req: Response;

    try {
      req = await fetch(baseURL, {
        body: new URLSearchParams(body),
        method: 'POST',
      });
    } catch(e) {
      error("Failed to connect to Last.FM! ----> " + e)
      return new Response();
    }
    
    return new Promise((res, rej) => { res(req) });
  }
  
  let req: Response;
  try {
    req = await fetch(buildURL(method, options));
  } catch (e) {
    error("Failed to connect to Last.FM! ----> " + e)
    return new Response();
  }

  return req;
}

// method implementations
export async function generateToken() {
  const req = await request('auth.gettoken');
  return (await req.json()).token;
}

export async function getSession(token: string) {
  const req = await request('auth.getsession', { token });
  const response = await req.json();

  return {
    username: response.session.name,
    key: response.session.key,
  };
}

export async function searchTrack(track: string, artist: string) {
  const req = await request('track.search', { track, artist }, false, false);
  const response = await req.json();
  return response.results.trackmatches;
}

export async function getUserInfo(sk: string) {
  const req = await request('user.getInfo', { sk });
  const response = await req.json();
  return response;
}

export async function love(track: string, artist: string, sk: string) {
  const req = await request('track.love', { track, artist, sk }, true);
  const response = await req.json();
  return response;
}

export async function scrobble(tracksAOBJ: Record<string, string|number>[], sk: string) {
  const tracks: Record<string, string|number> = {};

  for (const i in tracksAOBJ) {
    for (const j in tracksAOBJ[i]) {
      tracks[`${j}[${i}]`] = tracksAOBJ[i][j];
    }
  }

  const req = await request('track.scrobble', { ...tracks, sk }, true);
  const response = await req.json();
  return response;
}

export async function updateNowPlaying(track: string, artist: string, album: string, duration: string, sk: string) {
  const req = await request(
    'track.updateNowPlaying',
    { track, artist, duration, album, sk },
    true
  );
  const response = await req.json();
  return response;
}
