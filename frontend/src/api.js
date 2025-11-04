import axios from "axios";

export const API = axios.create({ baseURL: "http://localhost:4000/api" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  register: (data) => API.post("/auth/register", data),
  login: (data) => API.post("/auth/login", data),
  seed: () => API.post("/auth/seed"),
};

// Document endpoints
export const documentAPI = {
  issue: (formData) => API.post("/documents/issue", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  verify: (formData) => API.post("/documents/verify", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
  getById: (docId) => API.get(`/documents/${docId}`),
  // Note: These endpoints may need to be added to backend
  getMyDocuments: (role, email, userId) => {
    if (role === "issuer") {
      return API.get(`/documents/issued?issuerId=${userId}`);
    } else if (role === "user") {
      return API.get(`/documents/received?email=${email}`);
    }
    return Promise.resolve({ data: [] });
  },
  getIssuerStats: (issuerId) => API.get(`/documents/stats/issuer?issuerId=${issuerId}`),
  downloadPDF: (docId) => {
    const baseUrl = API.defaults.baseURL.replace("/api", "");
    window.open(`${baseUrl}/api/pdf/${docId}`, "_blank");
  },
};