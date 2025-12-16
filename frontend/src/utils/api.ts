import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:4001/api", 
  // baseURL:"https://adhaar-ocr-system-43gh.onrender.com/api"
   baseURL: import.meta.env.VITE_API_BASE_URL,
});

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error.response) {
      alert("Network Error — Backend unreachable");
      return Promise.reject(error);
    }

    const message =
      error.response.data?.message ||
      "Unexpected server error. Please try again.";

    alert(message);

    return Promise.reject(error);
  }
);
export const parseAadhaar = async (front: File, back: File) => {
  const formData = new FormData();
  formData.append("front", front);
  formData.append("back", back);
  return await API.post("/parse", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
