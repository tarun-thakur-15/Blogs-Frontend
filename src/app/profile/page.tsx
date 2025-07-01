export const dynamic = "force-dynamic";

import "../styles/page.css";
import "../styles/comments.css";
import CompanyHeader from "../Components/ComapnyHeaderForProfilePage";
import { Divider } from "antd";
import { getProfileDetails } from "../services/api";
import { cookies } from "next/headers";
import ClientTabsWrapper from "../Components/ClientTabsWrapper";

export default async function CompanyPage() {
  const backendBaseURL = "https://blogs-backend-ftie.onrender.com/";
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const usernameFromCookies = cookieStore.get("username")?.value!;
  
  const profileData = await getProfileDetails(usernameFromCookies, accessToken);
  console.log("getProfileDetails response:- ", profileData);

  return (
    <main className="main profile">
      <div className="container">
        <div>
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
