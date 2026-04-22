import api from "./api";

export const fetchPullRequests = async (projectId) =>
  (await api.get(`/projects/${projectId}/pull-requests`)).data.pullRequests;

export const fetchPullRequest = async (projectId, pullRequestId) =>
  (await api.get(`/projects/${projectId}/pull-requests/${pullRequestId}`)).data;

export const createPullRequest = async (projectId, payload) =>
  (await api.post(`/projects/${projectId}/pull-requests`, payload)).data.pullRequest;

export const updatePullRequestStatus = async (projectId, pullRequestId, status) =>
  (await api.patch(`/projects/${projectId}/pull-requests/${pullRequestId}/status`, { status })).data.pullRequest;

export const submitReview = async (projectId, pullRequestId, payload) =>
  (await api.post(`/projects/${projectId}/pull-requests/${pullRequestId}/reviews`, payload)).data.review;
