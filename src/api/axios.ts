import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // или тот порт, где у тебя работает JSON Server
});

export default api;
