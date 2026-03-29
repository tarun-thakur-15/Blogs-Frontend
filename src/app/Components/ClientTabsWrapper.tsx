//this wrapper is created so that we can call the api on every click on tab
"use client";
import React, { useState } from "react";
import { Tabs } from "antd";
import AboutTab from "./AboutTab";
import MyProfileTabs from "./MyProfileTabs";

export default function ClientTabsWrapper({
  profileData,
  username,
}: any) {
  const [tabKey, setTabKey] = useState(0);

  const handleTabClick = () => {
    setTabKey((prev) => prev + 1); // force re-render of the child
  };

  const tabItems = [
    {
      key: "about",
      label: "About",
      children: (
        <AboutTab about={profileData.about} />
      ),
    },
    {
      key: "highlights",
      label: "Highlights",
      children: (
        <MyProfileTabs
          key={`highlights-${tabKey}`} // force remount
          type="Highlights"
          username={username}
        />
      ),
    },
    {
      key: "allblogs",
      label: "All Blogs",
      children: (
        <MyProfileTabs
          key={`allblogs-${tabKey}`}
          type="All Blogs"
          username={username}
        />
      ),
    },
    {
      key: "archived",
      label: "Archived Blogs",
      children: (
        <MyProfileTabs
          key={`archived-${tabKey}`}
          type="Archived Blogs"
          username={username}
        />
      ),
    },
    {
      key: "activity",
      label: "Activity",
      children: (
        <MyProfileTabs
          key={`activity-${tabKey}`}
          type="Activity"
          username={username}
        />
      ),
    },
    {
      key: "draft",
      label: "draft",
      children: (
        <MyProfileTabs
          key={`draft-${tabKey}`}
          type="Draft"
          username={username}
        />
      ),
    },
  ];

  return <Tabs items={tabItems} onTabClick={handleTabClick} />;
}
