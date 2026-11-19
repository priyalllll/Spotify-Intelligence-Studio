"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiController = exports.ApiController = void 0;
const spotifyService_1 = require("../services/spotifyService");
const authHelper_1 = require("../utils/authHelper");
class ApiController {
    constructor() {
        this.getProfile = async (req, res) => {
            const token = (0, authHelper_1.getSpotifyAccessToken)(req);
            if (!token) {
                res.status(401).json({ error: 'Missing access token', details: 'Provide token via Authorization Bearer header or access_token query param' });
                return;
            }
            try {
                const data = await spotifyService_1.spotifyService.getUserProfile(token);
                res.json(data);
            }
            catch (err) {
                console.error('Error in /api/profile:', err.message);
                res.status(401).json({ error: 'Failed to fetch profile', details: err?.message || 'Unauthorized / Invalid Token' });
            }
        };
        this.getTopArtists = async (req, res) => {
            const token = (0, authHelper_1.getSpotifyAccessToken)(req);
            if (!token) {
                res.status(401).json({ error: 'Missing access token', details: 'Provide token via Authorization Bearer header or access_token query param' });
                return;
            }
            try {
                const data = await spotifyService_1.spotifyService.getTopArtists(token);
                res.json(data);
            }
            catch (err) {
                console.error('Error in /api/top-artists:', err.message);
                res.status(401).json({ error: 'Failed to fetch top artists', details: err?.message || 'Unauthorized / Invalid Token' });
            }
        };
        this.getTopTracks = async (req, res) => {
            const token = (0, authHelper_1.getSpotifyAccessToken)(req);
            if (!token) {
                res.status(401).json({ error: 'Missing access token', details: 'Provide token via Authorization Bearer header or access_token query param' });
                return;
            }
            try {
                const data = await spotifyService_1.spotifyService.getTopTracks(token);
                res.json(data);
            }
            catch (err) {
                console.error('Error in /api/top-tracks:', err.message);
                res.status(401).json({ error: 'Failed to fetch top tracks', details: err?.message || 'Unauthorized / Invalid Token' });
            }
        };
        this.getPlaylists = async (req, res) => {
            const token = (0, authHelper_1.getSpotifyAccessToken)(req);
            if (!token) {
                res.status(401).json({ error: 'Missing access token', details: 'Provide token via Authorization Bearer header or access_token query param' });
                return;
            }
            try {
                const data = await spotifyService_1.spotifyService.getUserPlaylists(token);
                res.json(data);
            }
            catch (err) {
                console.error('Error in /api/playlists:', err.message);
                res.status(401).json({ error: 'Failed to fetch playlists', details: err?.message || 'Unauthorized / Invalid Token' });
            }
        };
        this.getRecentlyPlayed = async (req, res) => {
            const token = (0, authHelper_1.getSpotifyAccessToken)(req);
            if (!token) {
                res.status(401).json({ error: 'Missing access token', details: 'Provide token via Authorization Bearer header or access_token query param' });
                return;
            }
            try {
                const data = await spotifyService_1.spotifyService.getRecentlyPlayed(token);
                res.json(data);
            }
            catch (err) {
                console.error('Error in /api/recently-played:', err.message);
                res.status(401).json({ error: 'Failed to fetch recently played', details: err?.message || 'Unauthorized / Invalid Token' });
            }
        };
        this.getFollowing = async (req, res) => {
            const token = (0, authHelper_1.getSpotifyAccessToken)(req);
            if (!token) {
                res.status(401).json({ error: 'Missing access token', details: 'Provide token via Authorization Bearer header or access_token query param' });
                return;
            }
            try {
                const data = await spotifyService_1.spotifyService.getFollowedArtists(token);
                res.json(data);
            }
            catch (err) {
                console.error('Error in /api/following:', err.message);
                res.status(401).json({ error: 'Failed to fetch following', details: err?.message || 'Unauthorized / Invalid Token' });
            }
        };
    }
}
exports.ApiController = ApiController;
exports.apiController = new ApiController();
