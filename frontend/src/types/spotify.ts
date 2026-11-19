export interface SpotifyImage {
  url: string;
  height?: number | null;
  width?: number | null;
}

export interface SpotifyFollowers {
  href?: string | null;
  total: number;
}

export interface SpotifyExternalUrls {
  spotify?: string;
  [key: string]: string | undefined;
}

export interface SpotifyUserProfile {
  id: string;
  display_name: string | null;
  email?: string;
  country?: string;
  product?: string;
  followers?: SpotifyFollowers;
  images?: SpotifyImage[];
  external_urls?: SpotifyExternalUrls;
  uri?: string;
  type?: string;
  href?: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  followers: SpotifyFollowers;
  images: SpotifyImage[];
  external_urls: SpotifyExternalUrls;
  uri?: string;
  type?: string;
  href?: string;
}

export interface SpotifyTopArtistsResponse {
  items: SpotifyArtist[];
  total: number;
  limit: number;
  offset: number;
  href?: string;
  next?: string | null;
  previous?: string | null;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  external_urls: SpotifyExternalUrls;
  album_type?: string;
  release_date?: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms: number;
  explicit: boolean;
  popularity: number;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  external_urls: SpotifyExternalUrls;
  preview_url?: string | null;
  uri?: string;
  type?: string;
  href?: string;
}

export interface SpotifyTopTracksResponse {
  items: SpotifyTrack[];
  total: number;
  limit: number;
  offset: number;
  href?: string;
  next?: string | null;
  previous?: string | null;
}

export interface SpotifyPlaylistOwner {
  id: string;
  display_name?: string | null;
  external_urls?: SpotifyExternalUrls;
}

export interface SpotifyPlaylistTracksInfo {
  href?: string;
  total: number;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description?: string | null;
  public: boolean;
  collaborative: boolean;
  owner: SpotifyPlaylistOwner;
  tracks: SpotifyPlaylistTracksInfo;
  images: SpotifyImage[];
  external_urls: SpotifyExternalUrls;
  uri?: string;
  type?: string;
  snapshot_id?: string;
}

export interface SpotifyPlaylistsResponse {
  items: SpotifyPlaylist[];
  total: number;
  limit: number;
  offset: number;
  href?: string;
  next?: string | null;
  previous?: string | null;
}

export interface SpotifyAudioFeatures {
  id: string;
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  duration_ms: number;
  time_signature: number;
  uri?: string;
  track_href?: string;
  analysis_url?: string;
}

export interface SpotifyAudioAnalysisResponse {
  tracks: SpotifyTrack[];
  audio_features: SpotifyAudioFeatures[];
}
