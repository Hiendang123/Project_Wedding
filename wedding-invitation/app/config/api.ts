// Helper to detect browser environment
const isBrowser = typeof window !== "undefined";

// Prefer explicit env var for browser calls (must start with NEXT_PUBLIC_ to be exposed)
//  1. If NEXT_PUBLIC_API_BASE_URL is provided, we use it.
//  2. If this code is executing on the server (SSR or during build) fall back to SERVER_PORT / API_BASE_URL.
//  3. As a last resort, use the current origin when running in the browser (helps during dev if proxy/rewrite is configured).
const PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const API_PORT = process.env.SERVER_PORT || 3001;

// Decide base URL intelligently
export const API_BASE_URL = PUBLIC_BASE_URL
  ? PUBLIC_BASE_URL.replace(/\/$/, "")
  : `http://localhost:${API_PORT}/api`;

// Debug log
if (isBrowser) {
  console.log("API Configuration:", {
    PUBLIC_BASE_URL,
    API_PORT,
    API_BASE_URL,
    isBrowser,
  });
}

export const API_ENDPOINTS = {
  users: `${API_BASE_URL}/users`,
  templates: `${API_BASE_URL}/templates`,
  weddingInvitations: `${API_BASE_URL}/wedding-invitations`,
  login: `${API_BASE_URL}/auth/login`,
  logout: `${API_BASE_URL}/auth/logout`,
  register: `${API_BASE_URL}/auth/register`,
  dashboard: `${API_BASE_URL}/dashboard`,
  // Add other endpoints here as needed
} as const;
