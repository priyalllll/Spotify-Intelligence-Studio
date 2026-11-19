"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSpotifyAccessToken = void 0;
const getSpotifyAccessToken = (req) => {
    const authHeader = req.headers.authorization;
    const queryToken = req.query.access_token;
    let tokenFromHeader = null;
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
        tokenFromHeader = authHeader.substring(7).trim();
    }
    else if (authHeader) {
        tokenFromHeader = authHeader.trim();
    }
    let tokenFromQuery = null;
    if (typeof queryToken === 'string' && queryToken.trim() !== '') {
        tokenFromQuery = queryToken.trim();
    }
    // Priority 1: Authorization Header. Priority 2: Query param
    const finalToken = tokenFromHeader || tokenFromQuery;
    console.log(`[AuthHelper] Ingress Token Audit:`);
    console.log(`  - Header Present: ${Boolean(authHeader)} (Extracted: ${tokenFromHeader ? tokenFromHeader.substring(0, 10) + '...' : 'none'})`);
    console.log(`  - Query Present: ${Boolean(queryToken)} (Extracted: ${tokenFromQuery ? tokenFromQuery.substring(0, 10) + '...' : 'none'})`);
    console.log(`  - Final Token Used: ${finalToken ? finalToken.substring(0, 10) + '...' : 'NONE'}`);
    return finalToken;
};
exports.getSpotifyAccessToken = getSpotifyAccessToken;
