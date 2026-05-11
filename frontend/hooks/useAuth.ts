"use client";
import { apiClient } from "@/api/apiClient";
import { useSocketStore } from "@/store/useSocketStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export const useAuth = (skipQuery = false) => {
  const { connectSocket, disconnectSocket } = useSocketStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data,isLoading } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      return await apiClient.get("/auth/check-auth");
    },
      enabled: !skipQuery,
  });


useEffect(() => {
    const userId = data?.user?._id; 
    
    if (userId) {
      connectSocket(userId);
    } else if (!isLoading) { 
  
      disconnectSocket();
    }
  }, [data?.user?._id, isLoading])
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post("/auth/logout", {});
      
    },

    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
      router.push("/login");
      disconnectSocket();
      toast.success("Logged out successfully");
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (userData: {
      fullName: string;
      email: string;
      password: string;
    }) => {
      const res = await apiClient.post("/auth/signUp", {
        email: userData.email,
        name: userData.fullName,
        password: userData.password,
      });
      return res;
    },

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
     

      toast.success("Signup successful");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const signinMutation = useMutation({
    mutationFn: async (userData: { email: string; password: string }) => {
      const res = await apiClient.post("/auth/signIn", {
        email: userData.email,
        password: userData.password,
      });
      return res;
    },
    onSuccess: (res) => {
      console.log("Login successful:", res.data);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      router.push("/");
      toast.success("Login successful");
    
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await apiClient.put("/auth/update-profile", formData);
      return res;
    },
    onSuccess: (data: any) => {
queryClient.setQueryData(["currentUser"], {
  user: data?.user,
});
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      router.refresh();
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    data,
    isLoggedIn: !!data?.user,
    logout: logoutMutation.mutate,
    signup: signupMutation.mutate,
    signin: signinMutation.mutate,
    updateProfile: updateProfileMutation,
  };
};
