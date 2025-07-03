import axios from "axios";
import Cookies from "js-cookie";
import { SignUpSchema, Login, VerifyOtp, changePassword, ResendOtp, ReactionPayload, CreateBlog, PostCommentInterface, EditAboutSchema, DraftPayload,
  DraftResponse } from "./schema";

const url = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";
const accessToken = Cookies.get("accessToken");
import { redirect } from 'next/navigation'; 
export const signUpUser = async (userData: SignUpSchema) => {
    try {
        const response = await axios.post(`${url}/signup`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.msg || 'Failed to register';
            throw new Error(errorMessage);
        }
        throw error;
    }
};

export const verifyUser = async (userData: VerifyOtp) => {
    try {
        const response = await axios.post(`${url}/verifyOtp`, userData,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }

        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.msg || 'Failed to register';
            throw new Error(errorMessage);
        }
        throw error;
    }
};


export const loginUser = async (userData: Login) => {
    try {
        const response = await axios.post(`${url}/login`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.msg || 'Failed to register';
            throw new Error(errorMessage);
        }
        // console.error(error);
        throw error;
    }
}

export const ForgotPasswordUser = async (userData: changePassword) => {
    try {
        const response = await axios.post(`${url}/changePassword`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.detail || error.response?.data?.error || 'User did not signup with email';
            throw new Error(errorMessage);
        }
        throw error;
    }
}

export const resedOtp = async (userData: ResendOtp) => {
    try {
        const response = await axios.post(`${url}/resendOtp`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.msg || 'Failed to register';
            throw new Error(errorMessage);
        }
        throw error;
    }
};

export const getAllBlogs = async (offset = 0, limit = 10, token?: string) => {
    // Use token passed in (for SSR) or get it client-side
    const accessToken = token || Cookies.get("accessToken");
    
    try {
      const response = await axios.get(`${url}/getAllBlogs?offset=${offset}&limit=${limit}`, {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.detail || "Failed to fetch blogs";
        throw new Error(errorMessage);
      }
      throw error;
    }
  };

  

  export const getPerticularBlog = async (slug: string ,token?: string) => {
    // Use token passed in (for SSR) or get it client-side
    const accessToken = token || Cookies.get("accessToken");
    
    try {
      const response = await axios.get(`${url}/getPerticularBlog/${slug}`, {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });
      return response.data;
    } catch (error) {
      redirect('/something-went-wrong');
    }
  };

  export const getProfileDetails = async (username: string ,token?: string) => {
    // Use token passed in (for SSR) or get it client-side
    const accessToken = token || Cookies.get("accessToken");
    
    try {
      const response = await axios.get(`${url}/getProfileDetails/${username}`, {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });
      return response.data;
    } catch (error) {
     redirect('/something-went-wrong');
    }
  };
  
  export const getHighlightedBlogs = async (offset: number, limit: number, username: string, token?: string) => {
    const accessToken = token || Cookies.get("accessToken");
    try {
      const response = await axios.get(`${url}/getHighlightedBlogs/${username}?offset=${offset}&limit=${limit}`, {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });
     
      return response.data;
    } catch (error) {
      redirect('/something-went-wrong');
    }
  };

  export const toggleHighlight = async (slug: string, token?: string) => {
    const accessToken = token || Cookies.get("accessToken");
    try {
      // PATCH request with no request body; the API toggles the status based on current state
      const response = await axios.patch(`${url}/toggleHighlight/${slug}`, {}, {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });
      return response.data;
    } catch (error) {
     redirect('/something-went-wrong');
    }
  };

  export const reactToBlog = async (slug: string, payload: ReactionPayload, token: string) => {
    const accessToken = token || Cookies.get("accessToken");
    try {
      const response = await axios.patch(`${url}/reactToBlog/${slug}`, payload, {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });
      return response.data;
    } catch (error) {
     redirect('/something-went-wrong');
    }
  };

  export const getFollowersList = async (
    username: string,
    offset: number,
    limit: number,
    token?: string
  ) => {
    const accessToken = token || Cookies.get("accessToken");
    try {
      const response = await axios.get(
        `${url}/getFollowersList/${username}?offset=${offset}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        }
      );
      return response.data; // assuming response.data.followers is an array of follower objects
    } catch (error) {
      redirect('/something-went-wrong');
    }
  };

  export const getFollowingList = async (
    username: string,
    offset: number,
    limit: number,
    token?: string
  ) => {
    const accessToken = token || Cookies.get("accessToken");
    try {
      const response = await axios.get(
        `${url}/getFollowingList/${username}?offset=${offset}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        }
      );
      return response.data; // assuming response.data.followers is an array of follower objects
    } catch (error) {
      redirect('/something-went-wrong');
    }
  };

  export const toggleFavourite = async (slug: string, token?: string) => {
    const accessToken = token || Cookies.get("accessToken");
    try {
      const response = await axios.patch(`${url}/favouriteBlog/${slug}`, null, {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });
      return response.data;
    } catch (error) {
      redirect('/something-went-wrong');
    }
  };

  export const toggleFollow = async (username: string, token?: string) => {
    const accessToken = token || Cookies.get("accessToken");
    try {
      const response = await axios.patch(
        `${url}/followUnfollow/${username}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        }
      );
      return response.data; // Handle response properly
    } catch (error) {
      redirect('/something-went-wrong');
    }
  };
  
  export const getUserBlogs = async (
    offset: number,
    limit: number,
    username: string,
    token?: string,
  ) => {
    const accessToken = token || Cookies.get("accessToken");
    try {
      const response = await axios.get(
        `${url}/getUserBlogs/${username}?offset=${offset}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        }
      );
    
      return response.data; // expected to return an object like { blogs: [...] }
    } catch (error) {
      redirect('/something-went-wrong');
    }
  };

  export const getUserTopics = async (
    username: string,
  ) => {
    try {
      const response = await axios.get(
        `${url}/getTopicNames/${username}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data; // expected to return an object like { blogs: [...] }
    } catch (error) {
      redirect('/something-went-wrong');
    }
  };

  export const getBlogsByTopic = async (
    username: string,
    topic: string,
    offset: number,
    limit: number,
    token?: string
  ) => {
    const accessToken = token || Cookies.get("accessToken");
    try {
      const response = await axios.get(
        `${url}/getBlogsByTopic/${username}/${topic}?offset=${offset}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        }
      );
  
      return response.data; // Expected to return an object like { blogs: [...] }
    } catch (error) {
      redirect('/something-went-wrong');
    }
  };

  export const createBlog = async (blogData: CreateBlog, token?: string) => {
    const accessToken = token || Cookies.get("accessToken");
    try {
      const response = await axios.post(`${url}/createBlog`, blogData, {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });
    
      return response.data;
    } catch (error) {
      redirect('/something-went-wrong');
    }
  };

export const searchBlogsAndUsers = async (
  query: string,
  offset: number = 0,
  limit: number = 10
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

  export const postComment = async (commentData: PostCommentInterface, token?: string) => {
    const accessToken = token || Cookies.get("accessToken");
    try {
      const response = await axios.post(`${url}/postComment`, commentData, {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });
      return response.data;
    } catch (error) {
      redirect('/something-went-wrong');
    }
  };

  export const getComments = async (
    slug: string,
    offset: number = 0,
    limit: number = 10,
    token?: string
  ) => {
    const accessToken = token || Cookies.get("accessToken");
    try {
      const response = await axios.get(
        `${url}/getComments/${slug}?offset=${offset}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        }
      );
      return response.data; // expected to return { comments, totalComments }
    } catch (error) {
      redirect('/something-went-wrong');
    }
  };

  export const deleteComment = async (commentId: string, token?: string) => {
    const accessToken = token || Cookies.get("accessToken");
    try {
      const response = await axios.delete(`${url}/deleteComment/${commentId}`, {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      });
      return response.data;
    } catch (error) {
      redirect('/something-went-wrong');
    }
  };

  // Search Followers API
  export const searchFollowers = async (
    username: string,
    query: string,
    token?: string
  ) => {
    const accessToken = token || Cookies.get("accessToken");
    try {
      const response = await axios.get(
        `${url}/searchFollowers/${username}?q=${encodeURIComponent(query)}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
        }
      );
      return response.data; // Expected to return { followers: [...] }
    } catch (error) {
      redirect('/something-went-wrong');
    }
  };

// Search Following API
export const searchFollowing = async (
  username: string,
  query: string,
  token?: string
) => {
  const accessToken = token || Cookies.get("accessToken");
  try {
    const response = await axios.get(
      `${url}/searchFollowing/${username}?q=${encodeURIComponent(query)}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      }
    );
    return response.data; // Expected to return { following: [...] }
  } catch (error) {
    redirect('/something-went-wrong');
  }
};

export const getNotifications = async (token?: string, offset: number = 0, limit: number = 10) => {
  const accessToken = token || Cookies.get("accessToken");
  try {
    const response = await axios.get(`${url}/notifications?offset=${offset}&limit=${limit}`, {
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });

    return response.data; // { notifications: [...] }
  } catch (error) {
    redirect('/something-went-wrong');
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const accessToken = Cookies.get("accessToken");

    const response = await axios.post(
      `${url}/notifications/mark-all-read`, // ✅ Correct API endpoint
      {}, // ✅ No request body required
      {
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        },
      }
    );

    return response.data;
  } catch (error) {
    redirect('/something-went-wrong');
  }
};

export const editABout = async ( userData: EditAboutSchema, token: string) => {
  const accessToken = token || Cookies.get("accessToken");
  try {
    // PATCH request with no request body; the API toggles the status based on current state
    const response = await axios.patch(`${url}/changeAbout`, userData, {
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
    return response.data;
  } catch (error) {
    redirect('/something-went-wrong');
  }
};

export const getAllArchivedBlogs = async (offset = 0, limit = 10, token?: string) => {
  // Use token passed in (for SSR) or get it client-side
  const accessToken = token || Cookies.get("accessToken");
  
  try {

    const response = await axios.get(`${url}/getArchivedBlogs?offset=${offset}&limit=${limit}`, {
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
    return response.data;
  } catch (error) {
    redirect('/something-went-wrong');
  }
};

export const getArchivedBlog = async (slug: string ,token?: string) => {
  // Use token passed in (for SSR) or get it client-side
  const accessToken = token || Cookies.get("accessToken");
  
  try {
    const response = await axios.get(`${url}/getDetailedArchivedBlog/${slug}`, {
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
    return response.data;
  } catch (error) {
    redirect('/something-went-wrong');
  }
};

export const deleteBlog = async (slug: string, token?: string) => {
  const accessToken = token || Cookies.get("accessToken");
  try {
    const response = await axios.delete(`${url}/deleteBlog/${slug}`, {
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
    return response.data;
  } catch (error) {
    redirect('/something-went-wrong');
  }
};

export const toggleArchieve = async (slug: string, token?: string) => {
  const accessToken = token || Cookies.get("accessToken");
  try {
    // PATCH request with no request body; the API toggles the status based on current state
    const response = await axios.patch(`${url}/archiveBlog/${slug}`, {}, {
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
    return response.data;
  } catch (error) {
    redirect('/something-went-wrong');
  }
};

export const getLikedBlogs = async (offset = 0, limit = 10, token?: string) => {
  // Use token passed in (for SSR) or get it client-side
  const accessToken = token || Cookies.get("accessToken");
  
  try {
    const response = await axios.get(`${url}/getLikedBlogs?offset=${offset}&limit=${limit}`, {
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
   
    return response.data;
  } catch (error) {
    redirect('/something-went-wrong');
  }
};

export const getDislikedBlogs = async (offset = 0, limit = 10, token?: string) => {
  // Use token passed in (for SSR) or get it client-side
  const accessToken = token || Cookies.get("accessToken");
  
  try {
    const response = await axios.get(`${url}/getDislikedBlogs?offset=${offset}&limit=${limit}`, {
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
  
    return response.data;
  } catch (error) {
    redirect('/something-went-wrong');
  }
};

export const getConfusingBlogs = async (offset = 0, limit = 10, token?: string ) => {
  // Use token passed in (for SSR) or get it client-side
  const accessToken = token || Cookies.get("accessToken");
  
  try {
    const response = await axios.get(`${url}/getConfusingBlogs?offset=${offset}&limit=${limit}`, {
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
  
    return response.data;
  } catch (error) {
    redirect('/something-went-wrong');
  }
};

export const getAmazingBlogs = async (offset = 0, limit = 10, token?: string) => {
  // Use token passed in (for SSR) or get it client-side
  const accessToken = token || Cookies.get("accessToken");
  
  try {
    const response = await axios.get(`${url}/getAmazingBlogs?offset=${offset}&limit=${limit}`, {
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
  
    return response.data;
  } catch (error) {
    redirect('/something-went-wrong');
  }
};

export const getCommentedBlogs = async (offset = 0, limit = 10,username: string, token?: string) => {
  // Use token passed in (for SSR) or get it client-side
  const accessToken = token || Cookies.get("accessToken");
  
  try {
    const response = await axios.get(`${url}/getCommentedBlogs/${username}?offset=${offset}&limit=${limit}`, {
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
  
    return response.data;
  } catch (error) {
    redirect('/something-went-wrong');
  }
};

export const changeProfilePicture = async (file: File, token?: string) => {
  const accessToken = token || Cookies.get("accessToken");
  const formData = new FormData();
  formData.append("profileImage", file);

  try {
    const response = await axios.patch(`${url}/changeProfilePicture`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    });
    return response.data;
  } catch (error) {
    redirect('/something-went-wrong');
  }
};
export const saveDraft = async (payload: DraftPayload) => {
  try {
    const response = await axios.post<DraftResponse>(
      `${url}/saveDraft`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (err: any) {
    redirect('/something-went-wrong');
  }
};

/**
 * Fetch the current user's draft
 */
export const getDraft = async () => {
  try {
    const response = await axios.get<DraftResponse>(`${url}/getDraft`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (err: any) {
    redirect('/something-went-wrong');
  }
};