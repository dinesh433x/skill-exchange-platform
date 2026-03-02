import api from "./axios";

export const getSkills = () => api.get("/api/skills");

export const addOfferedSkill = (data) => api.post("/api/skills/offered", data);

export const addWantedSkill = (data) => api.post("/api/skills/wanted", data);
