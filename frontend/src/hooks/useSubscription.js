import { useQuery } from "@tanstack/react-query";
import { API } from "@/app/CustomAxios";

const fetchSubscription = async () => {
  const response = await API.get("/subscription");
  return response.data;
};

export const useSubscription = () => {
  return useQuery({
    queryKey: ["subscription"],
    queryFn: fetchSubscription,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};
