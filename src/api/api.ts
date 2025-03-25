import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/";

// SignUp API
export const signUp = async (userData: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  dob: string;
  gender: string;
  address: string;
  role_type: string;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}users/signup/`, userData);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// Login API
export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}users/login/`, credentials);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// Fetch All Artists
export const fetchArtists = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}artist/`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// Fetch Single Artist by ID
export const fetchArtistById = async (artistId: number) => {
  try {
    const response = await axios.get(`${API_BASE_URL}artist/${artistId}/`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// Create a New Artist
export const createArtist = async (artistData: {
  name: string;
  dob: string;
  gender: string;
  address: string;
  first_release_year: number;
  no_of_albums_released: number;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}artist/`, artistData);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// Update an Artist by ID
export const updateArtist = async (
  artistId: number,
  artistData: {
    name?: string;
    dob?: string;
    gender?: string;
    address?: string;
    first_release_year?: number;
    no_of_albums_released?: number;
  }
) => {
  try {
    const response = await axios.put(`${API_BASE_URL}artist/${artistId}/`, artistData);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};

// Delete an Artist by ID
export const deleteArtist = async (artistId: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}artist/${artistId}/`);
    return response.data;
  } catch (error: any) {
    throw error.response ? error.response.data : error.message;
  }
};



// Fetch All Music
export const fetchMusic = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}music/`)
    return response.data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message
  }
}

// Add Song
export const addSong = async (songData: {
  artist_id: number
  title: string
  album_name: string
  genre: "rnb" | "country" | "classic" | "rock" | "jazz"
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}music/`, songData)
    return response.data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message
  }
}

// Update a song
export const updateSong = async (
  songId: number,
  songData: {
    artist_id?: number
    title?: string
    album_name?: string
    genre?: "rnb" | "country" | "classic" | "rock" | "jazz"
  },
) => {
  try {
    const response = await axios.put(`${API_BASE_URL}music/${songId}/`, songData)
    return response.data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message
  }
}

// Delete a song
export const deleteSong = async (songId: number) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}music/${songId}/`)
    return response.data
  } catch (error: any) {
    throw error.response ? error.response.data : error.message
  }
}

