import axios from "axios";
import {
  SignUpSchema,
  Login,
  VerifyOtp,
  changePassword,
  ResendOtp,
  ReactionPayload,
  CreateBlog,
  PostCommentInterface,
  EditAboutSchema,
  DraftPayload,
  EditFullNameSchema,
  EditUsernameSchema,
  ForgotPasswordSendOtpSchema,
  ForgotPasswordVerifyOtpSchema,
  ForgotPasswordResetSchema,
  DraftResponse,
  UnreadNotificationCountResponse,
  UploadBlogImageResponse,
  MeResponse,
} from "./schema";

// const url = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
// const url = "https://blogs-backend-ftie.onrender.com/api";
// const url = "http://localhost:8000/api";
// const url = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/backend";
const url = typeof window === "undefined"
  ? "https://blogs-backend-ftie.onrender.com/api"  // server-side
  : (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api"); // client-side

import { redirect } from "next/navigation";
export const signUpUser = async (userData: SignUpSchema) => {
  try {
    const response = await axios.post(`${url}/signup`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.msg || "Failed to register";
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export const verifyUser = async (userData: VerifyOtp) => {
  try {
    const response = await axios.post(`${url}/verifyOtp`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.msg || "Failed to register";
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export const loginUser = async (userData: Login) => {
  try {
    const response = await axios.post(`${url}/login`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // 🔥 MUST (this sends/receives cookies)
    });
    console.log("Login api response: ",response);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.msg || "Failed to login";
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export const ForgotPasswordUser = async (userData: changePassword) => {
  try {
    const response = await axios.post(`${url}/changePassword`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        "User did not signup with email";
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export const resedOtp = async (userData: ResendOtp) => {
  try {
    const response = await axios.post(`${url}/resendOtp`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.msg || "Failed to register";
      throw new Error(errorMessage);
    }
    throw error;
  }
};

//this bottom api is following ISR (Incremental Site Rendering) that's we why we using fetch and not axios.
export const getAllBlogs = async (offset = 0, limit = 10) => {
  try {
    const response = await fetch(
      `${url}/getAllBlogs?offset=${offset}&limit=${limit}`,
      {
        credentials: "include",
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch blogs");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//this getProfimeDetails is being used in profile page because profile page is client side rendered.. same api function you will get in apissr.tsx for /user/[username] page coz its server side renedered. 
export const getProfileDetails = async (username: string) => {
  try {
    const response = await fetch(`${url}/getProfileDetails/${username}`, {
      credentials: "include",
    });
    console.log("api response is: ", response);

    if (!response.ok) {
      throw new Error("Failed to fetch profile details");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    redirect("/something-went-wrong");
  }
};

export const getHighlightedBlogs = async (
  offset: number,
  limit: number,
  username: string,
) => {
  try {
    const response = await axios.get(
      `${url}/getHighlightedBlogs/${username}?offset=${offset}&limit=${limit}`,
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const toggleHighlight = async (slug: string) => {
  try {
    // PATCH request with no request body; the API toggles the status based on current state
    const response = await axios.patch(
      `${url}/toggleHighlight/${slug}`,
      {},
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const reactToBlog = async (
  slug: string,
  payload: ReactionPayload,
) => {
  try {
    const response = await axios.patch(`${url}/reactToBlog/${slug}`, payload, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const getFollowersList = async (
  username: string,
  offset: number,
  limit: number,
) => {
  try {
    const response = await axios.get(
      `${url}/getFollowersList/${username}?offset=${offset}&limit=${limit}`,
      {
        withCredentials: true,
      },
    );
    return response.data; // assuming response.data.followers is an array of follower objects
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const getFollowingList = async (
  username: string,
  offset: number,
  limit: number,
) => {
  try {
    const response = await axios.get(
      `${url}/getFollowingList/${username}?offset=${offset}&limit=${limit}`,
      {
        withCredentials: true,
      },
    );
    return response.data; // assuming response.data.followers is an array of follower objects
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const toggleFavourite = async (slug: string) => {
  try {
    const response = await axios.patch(`${url}/favouriteBlog/${slug}`, null, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const toggleFollow = async (username: string) => {
  const response = await axios.patch(
    `${url}/followUnfollow/${username}`,
    {},
    { withCredentials: true }
  );
  return response.data;
};

export const getUserBlogs = async (
  offset: number,
  limit: number,
  username: string,
) => {
  try {
    const response = await axios.get(
      `${url}/getUserBlogs/${username}?offset=${offset}&limit=${limit}`,
      {
        withCredentials: true,
      },
    );

    return response.data; // expected to return an object like { blogs: [...] }
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const getUserTopics = async (username: string) => {
  try {
    const response = await axios.get(`${url}/getTopicNames/${username}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // expected to return an object like { blogs: [...] }
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const getBlogsByTopic = async (
  username: string,
  topic: string,
  offset: number,
  limit: number,
) => {
  try {
    const response = await axios.get(
      `${url}/getBlogsByTopic/${username}/${topic}?offset=${offset}&limit=${limit}`,
      {
        withCredentials: true,
      },
    );

    return response.data; // Expected to return an object like { blogs: [...] }
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const createBlog = async (blogData: CreateBlog) => {
  const response = await axios.post(`${url}/createBlog`, blogData, {
    withCredentials: true,
  });

  return response.data;
};

export const searchBlogsAndUsers = async (
  query: string,
  offset: number = 0,
  limit: number = 10,
) => {
  try {
    const response = await axios.get(`${url}/searchBlogsAndUsers`, {
      params: {
        query,
        offset,
        limit,
      },
    });

    return response.data; // ✅ Return both blogs + users
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const postComment = async (commentData: PostCommentInterface) => {
  try {
    const response = await axios.post(`${url}/postComment`, commentData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const getComments = async (
  slug: string,
  offset: number = 0,
  limit: number = 10,
) => {
  try {
    const response = await axios.get(
      `${url}/getComments/${slug}?offset=${offset}&limit=${limit}`,
      {
        withCredentials: true,
      },
    );
    return response.data; // expected to return { comments, totalComments }
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const deleteComment = async (commentId: string) => {
  try {
    const response = await axios.delete(`${url}/deleteComment/${commentId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

// Search Followers API
export const searchFollowers = async (username: string, query: string) => {
  try {
    const response = await axios.get(
      `${url}/searchFollowers/${username}?q=${encodeURIComponent(query)}`,
      {
        withCredentials: true,
      },
    );
    return response.data; // Expected to return { followers: [...] }
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

// Search Following API
export const searchFollowing = async (username: string, query: string) => {
  try {
    const response = await axios.get(
      `${url}/searchFollowing/${username}?q=${encodeURIComponent(query)}`,
      {
        withCredentials: true,
      },
    );
    return response.data; // Expected to return { following: [...] }
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const getNotifications = async (
  offset: number = 0,
  limit: number = 10,
) => {
  try {
    const response = await axios.get(
      `${url}/notifications?offset=${offset}&limit=${limit}`,
      {
        withCredentials: true,
      },
    );

    return response.data; // { notifications: [...] }
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await axios.post(
      `${url}/notifications/mark-all-read`, // ✅ Correct API endpoint
      {}, // ✅ No request body required
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const editABout = async (userData: EditAboutSchema) => {
  try {
    // PATCH request with no request body; the API toggles the status based on current state
    const response = await axios.patch(`${url}/changeAbout`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const getAllArchivedBlogs = async (offset = 0, limit = 10) => {
  try {
    const response = await axios.get(
      `${url}/getArchivedBlogs?offset=${offset}&limit=${limit}`,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const getArchivedBlog = async (slug: string) => {
  try {
    const response = await axios.get(`${url}/getDetailedArchivedBlog/${slug}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const deleteBlog = async (slug: string) => {
  try {
    const response = await axios.delete(`${url}/deleteBlog/${slug}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const toggleArchieve = async (slug: string) => {
  try {
    // PATCH request with no request body; the API toggles the status based on current state
    const response = await axios.patch(
      `${url}/archiveBlog/${slug}`,
      {},
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const getLikedBlogs = async (offset = 0, limit = 10) => {
  try {
    const response = await axios.get(
      `${url}/getLikedBlogs?offset=${offset}&limit=${limit}`,
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const getDislikedBlogs = async (offset = 0, limit = 10) => {
  try {
    const response = await axios.get(
      `${url}/getDislikedBlogs?offset=${offset}&limit=${limit}`,
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const getConfusingBlogs = async (offset = 0, limit = 10) => {
  try {
    const response = await axios.get(
      `${url}/getConfusingBlogs?offset=${offset}&limit=${limit}`,
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const getAmazingBlogs = async (offset = 0, limit = 10) => {
  try {
    const response = await axios.get(
      `${url}/getAmazingBlogs?offset=${offset}&limit=${limit}`,
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const getCommentedBlogs = async (
  offset = 0,
  limit = 10,
  username: string,
) => {
  try {
    const response = await axios.get(
      `${url}/getCommentedBlogs/${username}?offset=${offset}&limit=${limit}`,
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const changeProfilePicture = async (file: File) => {
  const formData = new FormData();
  formData.append("profileImage", file);

  try {
    const response = await axios.patch(
      `${url}/changeProfilePicture`,
      formData,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error) {
    redirect("/something-went-wrong");
  }
};
export const saveDraft = async (payload: DraftPayload) => {
  try {
    const response = await axios.post<DraftResponse>(
      `${url}/saveDraft`,
      payload,
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (err: any) {
    redirect("/something-went-wrong");
  }
};

/**
 * Fetch the current user's draft
 */
export const getDraft = async () => {
  try {
    const response = await axios.get<DraftResponse>(`${url}/getDraft`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err: any) {
    redirect("/something-went-wrong");
  }
};

export const updateFullName = async (userData: EditFullNameSchema) => {
  try {
    const response = await axios.patch(`${url}/changeFullName`, userData, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating full name:", error);
    redirect("/something-went-wrong");
  }
};
export const updateUsername = async (userData: EditUsernameSchema) => {
  try {
    const response = await axios.patch(`${url}/changeUsername`, userData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    // Handle 403 specifically for restriction message
    if (error.response?.status === 403) {
      throw new Error(error.response.data.msg);
    }
    console.error("Error updating username:", error);
    redirect("/something-went-wrong");
  }
};

// 1. Send OTP
export const sendForgotPasswordOtp = async (
  data: ForgotPasswordSendOtpSchema,
) => {
  try {
    const response = await axios.post(`${url}/forgot-password/send-otp`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 2. Verify OTP
export const verifyForgotPasswordOtp = async (
  data: ForgotPasswordVerifyOtpSchema,
) => {
  try {
    const response = await axios.post(
      `${url}/forgot-password/verify-otp`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 3. Reset Password
export const resetForgottenPassword = async (
  data: ForgotPasswordResetSchema,
) => {
  try {
    const response = await axios.post(
      `${url}/forgot-password/reset-password`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUnreadNotificationCount = async (): Promise<
  UnreadNotificationCountResponse | undefined
> => {
  try {
    const response = await axios.get(`${url}/notifications/unread-count`, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const uploadBlogImage = async (
  file: File,
): Promise<UploadBlogImageResponse> => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await axios.post(`${url}/upload-image`, formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMe = async (): Promise<MeResponse> => {
  try {
    const response = await fetch(`${url}/me`, {
      method: "GET",
      credentials: "include", // 🔥 THIS IS THE KEY
    });

    if (!response.ok) {
      throw new Error("Not authenticated");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    const response = await fetch(`${url}/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to logout");
    }
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
};
