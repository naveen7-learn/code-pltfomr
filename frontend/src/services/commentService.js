import api from "./api";

export const fetchComments = async (projectId, pullRequestId) =>
  (await api.get(`/projects/${projectId}/pull-requests/${pullRequestId}/comments`)).data.comments;

export const createComment = async (projectId, pullRequestId, payload) =>
  (await api.post(`/projects/${projectId}/pull-requests/${pullRequestId}/comments`, payload)).data.comment;

export const toggleCommentResolved = async (projectId, pullRequestId, commentId) =>
  (await api.patch(`/projects/${projectId}/pull-requests/${pullRequestId}/comments/${commentId}/resolved`)).data.comment;

export const toggleCommentReaction = async (projectId, pullRequestId, commentId, emoji) =>
  (await api.patch(`/projects/${projectId}/pull-requests/${pullRequestId}/comments/${commentId}/reactions`, { emoji })).data.comment;
