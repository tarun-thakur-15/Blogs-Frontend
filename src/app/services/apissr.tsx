import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// const url = "http://localhost:8000/api";
const url = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

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

export async function getBlogForSEO(slug: string) {
  try {
    const res = await fetch(
      `${url}/getPerticularBlog/${slug}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    console.error("SEO fetch error:", error);
    return null;
  }
}
