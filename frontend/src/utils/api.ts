import axios from "axios";

const API = axios.create({
  // baseURL: "http://localhost:4000/api", 
  baseURL:"https://adhaar-ocr-system-43gh.onrender.com"
});

export const parseAadhaar = async (front: File, back: File) => {
  const formData = new FormData();
  formData.append("front", front);
  formData.append("back", back);
  return await API.post("/parse", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
