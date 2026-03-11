import api from "./axios";

export const getSkills = () => api.get("/api/skills");

export const addOfferedSkill = (data) => api.post("/api/skills/offered", data);
export const addWantedSkill = (data) => api.post("/api/skills/wanted", data);

export const getOfferedSkills = () => {
  return api.get("/api/skills/offered");
};
export const getWantedSkills = () => {
  return api.get("/api/skills/wanted");
};
