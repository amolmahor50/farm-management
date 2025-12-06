import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API } from "@/app/CustomAxios";

const fetchForumPosts = async (params = {}) => {
  const response = await API.get("/forum", { params });
  return response.data;
};

const getForumPostById = async (id) => {
  const response = await API.get(`/forum/${id}`);
  return response.data;
};

const createForumPost = async (data) => {
  const response = await API.post("/forum", data);
  return response.data;
};

const updateForumPost = async ({ id, ...data }) => {
  const response = await API.put(`/forum/${id}`, data);
  return response.data;
};

const deleteForumPost = async (id) => {
  const response = await API.delete(`/forum/${id}`);
  return response.data;
};

const replyToPost = async ({ id, ...data }) => {
  const response = await API.post(`/forum/${id}/reply`, data);
  return response.data;
};

export const useForumPosts = (params = {}) => {
  return useQuery({
    queryKey: ["forum-posts", params],
    queryFn: () => fetchForumPosts(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useForumPost = (id) => {
  return useQuery({
    queryKey: ["forum-post", id],
    queryFn: () => getForumPostById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateForumPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createForumPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
    },
  });
};

export const useUpdateForumPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateForumPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
    },
  });
};

export const useDeleteForumPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteForumPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
    },
  });
};

export const useReplyToPost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: replyToPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
    },
  });
};
