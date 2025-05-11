// src/api/axios.ts
import axios from "axios";
import { auth } from "../firebase";

const instance = axios.create({
  baseURL: "http://localhost:3001",
  headers: { "Content-Type": "application/json" },
});

instance.interceptors.request.use(async (config) => {
  const token = await auth.currentUser?.getIdToken();
  if (token && config.headers) {
    // config.headers is an AxiosHeaders instance:
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

export default instance;
