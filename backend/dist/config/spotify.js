"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spotifyApi = exports.createSpotifyApiInstance = exports.SPOTIFY_SCOPES = exports.FRONTEND_URL = void 0;
const spotify_web_api_node_1 = __importDefault(require("spotify-web-api-node"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const clientId = process.env.SPOTIFY_CLIENT_ID || '';
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';
const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:5000/auth/callback';
exports.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5174';
exports.SPOTIFY_SCOPES = [
    'user-read-private',
    'user-read-email',
    'user-read-recently-played',
    'user-top-read',
    'user-library-read',
    'playlist-read-private',
    'playlist-read-collaborative'
];
const createSpotifyApiInstance = () => {
    return new spotify_web_api_node_1.default({
        clientId,
        clientSecret,
        redirectUri,
    });
};
exports.createSpotifyApiInstance = createSpotifyApiInstance;
exports.spotifyApi = (0, exports.createSpotifyApiInstance)();
