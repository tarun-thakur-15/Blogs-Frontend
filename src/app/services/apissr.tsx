import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// const url = "http://localhost:8000/api";
// const url = "https://blogs-backend-ftie.onrender.com/api";
const url = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/backend";

export const getPerticularBlog = async (slug: string) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const response = await fetch(`${url}/getPerticularBlog/${slug}`, {
      headers: {
        Cookie: accessToken ? `accessToken=${accessToken}` : "",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch blog");
    }

    return response.json();
  } catch (error) {
    redirect("/something-went-wrong");
  }
};

export const getProfileDetails = async (username: string) => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const response = await fetch(`${url}/getProfileDetails/${username}`, {
      headers: {
        Cookie: accessToken ? `accessToken=${accessToken}` : "",
      },
      cache: "no-store",
    });

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
