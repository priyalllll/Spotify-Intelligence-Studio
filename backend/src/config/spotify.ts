import SpotifyWebApi from 'spotify-web-api-node';
import dotenv from 'dotenv';

dotenv.config();

const clientId = process.env.SPOTIFY_CLIENT_ID || '';
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';
const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:5000/auth/callback';

export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5174';

export const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'user-read-recently-played',
  'user-top-read',
  'user-library-read',
  'playlist-read-private',
  'playlist-read-collaborative'
];

export const createSpotifyApiInstance = (): SpotifyWebApi => {
  return new SpotifyWebApi({
    clientId,
    clientSecret,
    redirectUri,
  });
};

export const spotifyApi = createSpotifyApiInstance();
