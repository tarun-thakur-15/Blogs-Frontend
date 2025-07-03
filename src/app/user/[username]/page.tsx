// app/user/[username]/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import "../../styles/page.css";
import CompanyHeaderOther from "../../Components/CompanyHeaderForUserPage";
import CompanyTabsContentOther from "../../Components/CompanyTabsContentOther";
import { Tabs } from "antd";
import { cookies } from "next/headers";
import {
  getProfileDetails,
  getUserTopics,
} from "../../services/api";

interface UsernamePageProps {
  params: { username: string };
}

export default async function UsernamePage({ params }: UsernamePageProps) {
  const { username } = await params;

  // Get token from cookies on the server side
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const usernameFromCookies = cookieStore.get("username")?.value!;

  // Call the API to fetch the profile details for the given username
  const profileData = await getProfileDetails(username, accessToken);
 

  //fetch all topics of a perticular user
  const userTopicsData = await getUserTopics(username);

  // Create your static tabs as needed (for example, "Highlights")
  const staticTabs = [
    {
      key: "static-2",
      label: "About",
      children: (
        <CompanyTabsContentOther
          about={profileData.about}
          type="About"
          username={username}
        />
      ),
    },
    {
      key: "static-1",
      label: "Highlights",
      children: (
        <CompanyTabsContentOther
          type="Highlights"
          username={username}
        />
      ),
    },
    {
      key: "static-3",
      label: "All Blogs",
      children: (
        <CompanyTabsContentOther
          type="All Blogs"
          // highlightedBlogsData={userBlogsData.blogs || []}
          username={username}
        />
      ),
    },
  ];

  // Create dynamic tabs based on topic names
  // Create dynamic tabs for each topic by fetching blogs for that topic.
  const dynamicTabs = await Promise.all(
    (userTopicsData.topics || []).map(async (topic: string, index: number) => {
     
      return {
        key: `topic-${index}`,
        label: topic,
        children: (
          <CompanyTabsContentOther
            type="Topic" // explicitly set type as "Topic"
            username={username}
            topic={topic} // pass the topic so that useEffect can trigger API call
          />
        ),
      };
    })
  );

  const allTabs = [...staticTabs, ...dynamicTabs];

  return (
    <main className="main single-page">
      <div className="container">
        {/* Pass the profile data to CompanyHeaderOther */}
        <CompanyHeaderOther
          username={profileData.username}
          fullName={profileData.fullName}
          profileImage={profileData.profileImage}
          followersCount={profileData.followersCount}
          followingCount={profileData.followingCount}
          totalBlogs={profileData.totalBlogs}
          isFollowed={profileData.isFollowed}
          blogSlug={profileData.slug}
          usernameFromCookies={usernameFromCookies}
        />

        <Tabs items={allTabs} />
      </div>
    </main>
  );
}
