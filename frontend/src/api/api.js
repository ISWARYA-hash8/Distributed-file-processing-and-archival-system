import axios from "axios";
import { getToken } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL; 

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Add token to request header using normalized getter
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    // determine whether this request should be silent (no global loader)
    const isSilent = Boolean(config && (config.silent || (config.headers && (config.headers['x-silent'] || config.headers['X-Silent']))));
    // emit global loading start for UI unless silent
    try {
      if (!isSilent && typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('arch-loading', { detail: true }));
    } catch (e) {}
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// emit loading stop on responses/errors
axiosInstance.interceptors.response.use(
  (response) => {
    try {
      const cfg = response?.config || {};
      const isSilent = Boolean(cfg && (cfg.silent || (cfg.headers && (cfg.headers['x-silent'] || cfg.headers['X-Silent']))));
      if (!isSilent && typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('arch-loading', { detail: false }));
    } catch (e) {}
    return response;
  },
  (error) => {
    try {
      const cfg = error?.config || {};
      const isSilent = Boolean(cfg && (cfg.silent || (cfg.headers && (cfg.headers['x-silent'] || cfg.headers['X-Silent']))));
      if (!isSilent && typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('arch-loading', { detail: false }));
    } catch (e) {}
    return Promise.reject(error);
  }
);

export default axiosInstance;
