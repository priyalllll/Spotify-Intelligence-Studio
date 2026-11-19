"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.AuthController = void 0;
const spotifyService_1 = require("../services/spotifyService");
const authHelper_1 = require("../utils/authHelper");
const spotify_1 = require("../config/spotify");
class AuthController {
    constructor() {
        this.login = (req, res) => {
            const authUrl = spotifyService_1.spotifyService.getAuthorizationUrl();
            if (req.query.redirect === 'true' || req.headers.accept?.includes('text/html')) {
                res.redirect(authUrl);
            }
            else {
                res.json({ authUrl });
            }
        };
        this.callback = async (req, res) => {
            const code = req.query.code;
            const error = req.query.error;
            const frontendBase = req.headers.referer
                ? new URL(req.headers.referer).origin
                : spotify_1.FRONTEND_URL;
            if (error) {
                console.error('Spotify OAuth error in callback:', error);
                res.redirect(`${frontendBase}/login?error=${encodeURIComponent(error)}`);
                return;
            }
            if (!code) {
                res.status(400).json({ error: 'Authorization code is missing from callback query' });
                return;
            }
            try {
                const tokenData = await spotifyService_1.spotifyService.handleCallback(code);
                const redirectUrl = `${frontendBase}/dashboard?access_token=${tokenData.accessToken}&refresh_token=${tokenData.refreshToken}&expires_in=${tokenData.expiresIn}`;
                console.log(`[OAuth Callback] Redirecting user to ${redirectUrl}`);
                res.redirect(redirectUrl);
            }
            catch (err) {
                console.error('Error handling Spotify OAuth callback:', err);
                res.status(500).json({
                    error: 'Failed to complete OAuth authentication',
                    details: err?.body?.error_description || err?.message || 'Callback failed',
                });
            }
        };
        this.refresh = async (req, res) => {
            const refreshToken = (req.body?.refreshToken || req.query?.refreshToken);
            if (!refreshToken) {
                res.status(400).json({ error: 'Refresh token is required' });
                return;
            }
            try {
                const tokenData = await spotifyService_1.spotifyService.refreshAccessToken(refreshToken);
                res.json(tokenData);
            }
            catch (err) {
                console.error('Error refreshing Spotify access token:', err);
                res.status(500).json({
                    error: 'Failed to refresh access token',
                    details: err?.body?.error_description || err?.message || 'Token refresh failed',
                });
            }
        };
        this.getMe = async (req, res) => {
            const accessToken = (0, authHelper_1.getSpotifyAccessToken)(req);
            if (!accessToken) {
                res.status(401).json({ error: 'Access token is required in Authorization header or query parameter' });
                return;
            }
            try {
                const profile = await spotifyService_1.spotifyService.getUserProfile(accessToken);
                res.json(profile);
            }
            catch (err) {
                console.error('Error fetching Spotify user profile:', err);
                res.status(401).json({
                    error: 'Failed to fetch user profile',
                    details: err?.body?.error_description || err?.message || 'Fetch profile failed',
                });
            }
        };
        this.getTopArtists = async (req, res) => {
            const accessToken = (0, authHelper_1.getSpotifyAccessToken)(req);
            if (!accessToken) {
                res.status(401).json({ error: 'Access token is required in Authorization header or query parameter' });
                return;
            }
            try {
                const topArtists = await spotifyService_1.spotifyService.getTopArtists(accessToken);
                res.json(topArtists);
            }
            catch (err) {
                console.error('Error fetching Spotify top artists:', err);
                res.status(401).json({
                    error: 'Failed to fetch top artists',
                    details: err?.body?.error_description || err?.message || 'Fetch top artists failed',
                });
            }
        };
        this.getTopTracks = async (req, res) => {
            const accessToken = (0, authHelper_1.getSpotifyAccessToken)(req);
            if (!accessToken) {
                res.status(401).json({ error: 'Access token is required in Authorization header or query parameter' });
                return;
            }
            try {
                const topTracks = await spotifyService_1.spotifyService.getTopTracks(accessToken);
                res.json(topTracks);
            }
            catch (err) {
                console.error('Error fetching Spotify top tracks:', err);
                res.status(401).json({
                    error: 'Failed to fetch top tracks',
                    details: err?.body?.error_description || err?.message || 'Fetch top tracks failed',
                });
            }
        };
        this.getPlaylists = async (req, res) => {
            const accessToken = (0, authHelper_1.getSpotifyAccessToken)(req);
            if (!accessToken) {
                res.status(401).json({ error: 'Access token is required in Authorization header or query parameter' });
                return;
            }
            try {
                const playlists = await spotifyService_1.spotifyService.getUserPlaylists(accessToken);
                res.json(playlists);
            }
            catch (err) {
                console.error('Error fetching Spotify playlists:', err);
                res.status(401).json({
                    error: 'Failed to fetch playlists',
                    details: err?.body?.error_description || err?.message || 'Fetch playlists failed',
                });
            }
        };
        this.getAudioAnalysis = async (req, res) => {
            const accessToken = (0, authHelper_1.getSpotifyAccessToken)(req);
            if (!accessToken) {
                res.status(401).json({ error: 'Access token is required in Authorization header or query parameter' });
                return;
            }
            try {
                const audioAnalysis = await spotifyService_1.spotifyService.getAudioAnalysis(accessToken);
                res.json(audioAnalysis);
            }
            catch (err) {
                console.error('Error fetching Spotify audio analysis:', err);
                res.status(401).json({
                    error: 'Failed to fetch audio analysis',
                    details: err?.body?.error_description || err?.message || 'Fetch audio analysis failed',
                });
            }
        };
    }
}
exports.AuthController = AuthController;
exports.authController = new AuthController();
