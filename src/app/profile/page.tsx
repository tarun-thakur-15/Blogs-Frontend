"use client";

import { useEffect, useState } from "react";
import "../styles/page.css";
import "../styles/comments.css";
import CompanyHeader from "../Components/ComapnyHeaderForProfilePage";
import { Divider } from "antd";
import { getProfileDetails } from "../services/api";
import ClientTabsWrapper from "../Components/ClientTabsWrapper";
import { useRouter } from "next/navigation";
import ProfilePageSkeleton from "../Components/ProfilePageSkeleton";
import { useAuthStore } from "../stores/authStore";

export default function CompanyPage() {
  const { user, isLoggedIn, isHydrated } = useAuthStore();
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Wait until /me has resolved before making any decisions
    if (!isHydrated) return;

    // ✅ Redirect if not logged in
    if (!isLoggedIn) {
      router.push("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        // ✅ Use username from authStore, not js-cookie
        const data = await getProfileDetails(user!.username);
        setProfileData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isHydrated, isLoggedIn]); // ✅ re-runs when hydration/auth state changes

  // ✅ Show skeleton while waiting for /me or profile fetch
  if (!isHydrated || loading) {
    return <ProfilePageSkeleton />;
  }

  return (
    <main className="main profile">
      <div className="container">
        <div className="w-full">
          <CompanyHeader
            username={profileData.username}
            fullName={profileData.fullName}
            profileImage={profileData.profileImage}
            followersCount={profileData.followersCount}
            followingCount={profileData.followingCount}
            totalBlogs={profileData.totalBlogs}
            usernameFromCookies={user!.username} // ✅ from authStore
          />

          <div className="company-tabs">
            <ClientTabsWrapper
              accessToken="" // ✅ don't pass token — httpOnly, sent automatically via credentials:"include"
              profileData={profileData}
              username={user!.username} // ✅ from authStore
            />
          </div>
        </div>
      </div>

      <Divider />
    </main>
  );
}