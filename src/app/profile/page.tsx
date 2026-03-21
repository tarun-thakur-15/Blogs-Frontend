"use client";

import { useEffect, useState } from "react";
import "../styles/page.css";
import "../styles/comments.css";
import CompanyHeader from "../Components/ComapnyHeaderForProfilePage";
import { Divider } from "antd";
import { getProfileDetails } from "../services/api";
import Cookies from "js-cookie";
import ClientTabsWrapper from "../Components/ClientTabsWrapper";
import { useRouter } from "next/navigation";
import ProfilePageSkeleton from "../Components/ProfilePageSkeleton";

export default function CompanyPage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const accessToken = Cookies.get("accessToken") || "";
  const usernameFromCookies = Cookies.get("username") || "";

  useEffect(() => {
    if (!accessToken) {
      router.push("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        const data = await getProfileDetails(usernameFromCookies, accessToken);
        setProfileData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
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
            usernameFromCookies={usernameFromCookies}
          />

          <div className="company-tabs">
            <ClientTabsWrapper
              accessToken={accessToken}
              profileData={profileData}
              username={usernameFromCookies}
            />
          </div>
        </div>
      </div>

      <Divider />
    </main>
  );
}
