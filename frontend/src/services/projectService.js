import api from "./api";

export const fetchProjects = async () => (await api.get("/projects")).data.projects;
export const fetchProject = async (projectId) => (await api.get(`/projects/${projectId}`)).data.project;
export const createProject = async (payload) => (await api.post("/projects", payload)).data.project;
export const saveProjectFile = async (projectId, payload) =>
  (await api.post(`/projects/${projectId}/files`, payload)).data.files;
export const uploadProjectFile = async (projectId, formData) =>
  (await api.post(`/projects/${projectId}/upload`, formData, { headers: { "Content-Type": "multipart/form-data" } })).data.files;
