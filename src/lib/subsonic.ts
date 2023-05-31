/* Subsonic library written by Yourfriend. 2023 */

import localforage from 'localforage';
import md5 from './md5';

import { trace, info, error, attachConsole } from "tauri-plugin-log-api";

interface Authenication {
  username?: string;
  password?: string;
}

export default class Subsonic {
  authenication: Authenication = {};

  server: string;

  client: string;

  constructor(server: string, username: string, password: string) {
    this.server = server||"";
    
    if (!this.server.endsWith('/')) this.server += '/';

    this.authenication.username = username;
    this.authenication.password = password;

    this.client = 'subsonic-ts';

    this.test();
  }

  private buildURL(endpoint: string, options: Record<string, any> = {}) {
    const salt = crypto.randomUUID();
    const token = md5(this.authenication.password + salt);

    return `${this.server}rest/${endpoint}.view?u=${
      this.authenication.username
    }&t=${token}&s=${salt}&v=1.15.0&c=${this.client}&f=json${Object.entries(
      options
    )
      .map((z) => `&${z[0]}=${z[1]}`)
      .join('')}`;
  }

  private async createRequest(
    endpoint: string,
    options: Record<string, any> = {},
    type: 'json' | 'blob' = 'json'
  ) {
    let req;
    try {
      req = await fetch(this.buildURL(endpoint, options));
    } catch(e) {
      error("Failed connecting to " + this.server + " endpoint "+ endpoint + "! --> " + e)
      return;
    }
    
    if (type === 'json') {
      return (await req.json())['subsonic-response'];
    }
    return req.blob();
  }

  async getAlbum(id: string) {
    const response = await this.createRequest('getAlbum', { id });
    return response.album;
  }

  async getArtist(id: string) {
    const response = await this.createRequest('getArtist', {
      id,
    });
    return response.artist;
  }

  async getCoverArt(id: string, size = 300) {
    const response = await this.createRequest(
      'getCoverArt',
      {
        id,
        size,
      },
      'blob'
    );
    return response;
  }

  async scrobble(id: string) {
    const response = await this.createRequest('scrobble', {
      id,
    });
    return response;
  }

  getStreamUrl(id: string) {
    return this.buildURL('stream', { id });
  }

  static async refreshSongs() {
    await localforage.removeItem('songs');
  }

  async getAllSongs() {
    const artists = await this.getArtists();
    let songs = (await localforage.getItem('songs') as object[]) || [];
    if (songs.length === 0) {
      await Promise.all(
        artists.map(async (partArtist: {id: string}) => {
          const fullArtist = await this.getArtist(partArtist.id);
          await Promise.all(
            fullArtist.album.map(async (partAlbum: {id: string}) => {
              const fullAlbum = await this.getAlbum(partAlbum.id);
              songs = [...(fullAlbum.song || []), ...songs];
            })
          );
        })
      );
      localforage.setItem('songs', songs);
    }
    return songs;
  }

  async getArtists() {
    const response = await this.createRequest('getArtists');

    return response.artists.index.map((z: {artist: string}) => z.artist).flat();
  }

  async test() {
    const response = await this.createRequest('ping');
    if (response.status === 'ok') return true;
    return false;
  }
}
