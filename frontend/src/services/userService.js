import api from "./api";

export const fetchGlobalPullRequests = async () => (await api.get("/user/pull-requests")).data.pullRequests;
export const fetchGlobalReviews = async () => (await api.get("/user/reviews")).data.pullRequests;
export const fetchInsights = async () => (await api.get("/user/insights")).data.insights;
