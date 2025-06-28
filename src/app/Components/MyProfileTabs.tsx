"use client";
import React, { useState, forwardRef, useEffect } from "react";
import { Flex, Select, Skeleton, Spin } from "antd";
import Cookies from "js-cookie";
import MyProfileHighlightedBlogs from "./MyProfileHighlightedBlogs";
import MyProfileAllBlogs from "./MyProfileAllBlogs";
import ArchivedTabs from "./ArchivedTabs";
import LikedBlogsTab from "./LikedBlogsTab";
import DislikedBlogsTab from "./DislikedBlogsTab";
import ConfusingBlogsTab from "./ConfusingBlogsTab";
import AmazingBlogsTab from "./AmazingBlogsTab";
import CommentedBlogs from "./CommentedBlogs";
import DraftBlog from "./DraftBlog";
import {
  getHighlightedBlogs,
  getUserBlogs,
  getAllArchivedBlogs,
  getAmazingBlogs,
  getLikedBlogs,
  getDislikedBlogs,
  getConfusingBlogs,
  getCommentedBlogs,
  getDraft
} from "../services/api";

// CSS
import "../styles/tabs.css";
// IMAGES
import SelectDrop from "../../../public/images/select-drop.svg";
interface BlogPreview {
  _id: string;
  title: string;
  previewContent: string;
  slug: string;
  createdAt: string;
  author: { username: string };
  isFavourite: boolean;
  commentCount: number;
  reactions: {
    like: number;
    amazing: number;
    dislike: number;
    confusing: number;
  };
}
interface draftBlogPreview {
  _id: string;
  title: string;
  topic: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  slug: string;
  previewContent: string;
}

interface MyProfileTabsProps {
  about?: string;
  type?: string;
  highlightedBlogsData?: BlogPreview[];
  username: string;
  topic?: string;
  clickCount?: number;
}
export default function MyProfileTabs({
  about,
  type,
  username,
  topic,
  clickCount,
}: MyProfileTabsProps) {
  const token = Cookies.get("accessToken");

  // -------------------states and useEffect hor highlighted blogs-------------------
  const [highlightedBlogs, setHighlightedBlogs] = useState<BlogPreview[]>([]);
  const [highlightedBlogsLoading, setHighlightedBlogsLoading] = useState(false);

  // For Highlights tab: fetch highlighted blogs if type is "Highlights"
  useEffect(() => {
    if (type === "Highlights") {
      setHighlightedBlogsLoading(true);
      getHighlightedBlogs(0, 10, username, token)
        .then((data) => {
          setHighlightedBlogs(data.blogs || []);
          setHighlightedBlogsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching highlighted blogs:", error);
          setHighlightedBlogsLoading(false);
        });
    }
  }, [clickCount, type, username]);

  // -------------------states and useEffect hor All blogs of perticular user-------------------
  const [allBlogs, setAllBlogs] = useState<BlogPreview[]>([]);
  const [allBlogsLoading, setAllBlogsLoading] = useState(false);

  // Fetch All blogs when type is "AllBlogs"
  useEffect(() => {
    if (type === "AllBlogs") {
      setAllBlogsLoading(true);
      getUserBlogs(0, 10, username, token)
        .then((data) => {
          setAllBlogs(data.blogs || []);
          setAllBlogsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching highlighted blogs:", error);
          setAllBlogsLoading(false);
        });
    }
  }, [clickCount, type, username]);

  // -------------------states and useEffect hor Archived blogs of perticular user-------------------
  const [archivedBlogs, setArchivedBlogs] = useState<BlogPreview[]>([]);
  const [archivedBlogsLoading, setArchivedBlogsLoading] = useState(false);

  // Fetch All blogs when type is "AllBlogs"
  useEffect(() => {
    if (type === "Archived Blogs") {
      setArchivedBlogsLoading(true);
      getAllArchivedBlogs(0, 10, token)
        .then((data) => {
          setArchivedBlogs(data.blogs || []);
          setArchivedBlogsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching highlighted blogs:", error);
          setArchivedBlogsLoading(false);
        });
    }
  }, [clickCount, type, username]);

  // -------------------states and useEffect hor Liked blogs of perticular user in Activity Tab-------------------
  // For Activity tab (dynamic based on reaction selection)
  const [activityBlogs, setActivityBlogs] = useState<BlogPreview[]>([]);
  const [activityLoading, setActivityLoading] = useState(false);
  const [activityType, setActivityType] = useState<string>("Likes");

    // -------------------states and useEffect for draft-------------------
  // For Activity tab (dynamic based on reaction selection)
  const [draft, setDraft] = useState<draftBlogPreview[]>([]);
  const [draftLoading, setDraftLoading] = useState(false);

    
useEffect(() => {
  if (type === "Draft") {
    setDraftLoading(true);
    getDraft()
      .then((data) => {
        setDraft([data.draft]); // ✅ use the data received from API
        setDraftLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching draft blogs:", error);
        setDraftLoading(false);
      });
  }
}, [clickCount, type, username]);

  // Fetch blogs for Activity tab based on selected reaction type
  const fetchActivityBlogs = async (reaction: string) => {
    setActivityLoading(true);
    try {
      let data;
      switch (reaction) {
        case "Likes":
          data = await getLikedBlogs(0, 10, token);
          break;
        case "Dislikes":
          data = await getDislikedBlogs(0, 10, token);
          break;
        case "Amazing":
          data = await getAmazingBlogs(0, 10, token);
          break;
        case "Confusing":
          data = await getConfusingBlogs(0, 10, token);
          break;
        case "Comments":
          data = await getCommentedBlogs(0, 10, username, token);
          break;
        default:
          data = { blogs: [] };
      }
      setActivityBlogs(data.blogs || []);
    } catch (error) {
      console.error("Error fetching activity blogs:", error);
    }
    setActivityLoading(false);
  };

  // When the component mounts or when activityType changes, fetch the corresponding blogs
  useEffect(() => {
    if (type === "Activity") {
      fetchActivityBlogs(activityType);
    }
  }, [type, activityType, token]);

  return (
    <div className="company-tabs--content">
      <Flex vertical gap={type !== "about" ? 20 : 12}>
        <Flex justify="space-between" align="center">
          <Flex gap={6} align="center">
            <h4 className="mb-0">
              {type === "Topic"
                ? topic
                : type === "Activity"
                ? "Activity"
                : type}
            </h4>
          </Flex>
          {type === "Activity" && (
            <Select
              style={{ marginTop: "-15px" }}
              defaultValue="likes"
              onChange={(value) => setActivityType(value)}
              suffixIcon={<SelectDrop />}
              options={[
                { value: "Likes", label: "Likes" },
                { value: "Dislikes", label: "Dislikes" },
                { value: "Amazing", label: "Amazing" },
                { value: "Confusing", label: "Confusing" },
                { value: "Comments", label: "Comments" },
              ]}
            />
          )}
        </Flex>

        {type === "About" ? (
          <Flex className="company-tabs--list" vertical gap={20}>
            <p>{about}</p>
          </Flex>
        ) : null}
        {type === "Highlights" ? (
          <Flex className="company-tabs--list" vertical gap={20}>
            {highlightedBlogsLoading ? (
              <div style={{ padding: "20px 0" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "30px",
                  }}
                >
                  {/* skeleton for header */}
                  <div
                    className="skeletonHeaderProfile"
                    style={{ marginBottom: "30px" }}
                  >
                    <div>
                      <Skeleton.Avatar size={70} shape="circle" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Skeleton active paragraph={{ rows: 1, width: "100%" }} />
                    </div>
                  </div>
                  {/* skeleton for body */}
                </div>
              </div>
            ) : (
              <MyProfileHighlightedBlogs
                initialBlogs={highlightedBlogs || []}
                username={username}
              />
            )}
          </Flex>
        ) : null}

        {type === "All Blogs" ? (
          <Flex className="company-tabs--list" vertical gap={20}>
            {allBlogsLoading ? (
              <Spin tip="Loading All blogs..." />
            ) : (
              <MyProfileAllBlogs
                initialBlogs={allBlogs || []}
                username={username}
              />
            )}
          </Flex>
        ) : null}

        {type === "Archived Blogs" ? (
          <Flex className="company-tabs--list" vertical gap={20}>
            {archivedBlogsLoading ? (
              <div style={{ padding: "20px 0" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "30px",
                  }}
                >
                  {/* skeleton for header */}
                  <div
                    className="skeletonHeaderProfile"
                    style={{ marginBottom: "30px" }}
                  >
                    <div>
                      <Skeleton.Avatar size={70} shape="circle" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Skeleton active paragraph={{ rows: 1, width: "100%" }} />
                    </div>
                  </div>
                  {/* skeleton for body */}
                </div>
              </div>
            ) : (
              <ArchivedTabs
                initialBlogs={archivedBlogs || []}
                username={username}
              />
            )}
          </Flex>
        ) : null}

        {type === "Activity" && (
          <Flex className="company-tabs--list" vertical gap={20}>
            {activityLoading ? (
              <div style={{ padding: "20px 0" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "30px",
                  }}
                >
                  {/* skeleton for header */}
                  <div
                    className="skeletonHeaderProfile"
                    style={{ marginBottom: "30px" }}
                  >
                    <div>
                      <Skeleton.Avatar size={70} shape="circle" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Skeleton active paragraph={{ rows: 1, width: "100%" }} />
                    </div>
                  </div>
                  {/* skeleton for body */}
                </div>
              </div>
            ) : (
              <>
                {activityType === "Likes" && (
                  <LikedBlogsTab
                    initialBlogs={activityBlogs}
                    username={username}
                  />
                )}
                {activityType === "Dislikes" && (
                  <DislikedBlogsTab
                    initialBlogs={activityBlogs}
                    username={username}
                  />
                )}
                {activityType === "Amazing" && (
                  <AmazingBlogsTab
                    initialBlogs={activityBlogs}
                    username={username}
                  />
                )}
                {activityType === "Confusing" && (
                  <ConfusingBlogsTab
                    initialBlogs={activityBlogs}
                    username={username}
                  />
                )}
                {activityType === "Comments" && (
                  <CommentedBlogs
                    initialBlogs={activityBlogs}
                    username={username}
                  />
                )}
              </>
            )}
          </Flex>
        )}

        {type === "Draft" && (
          <Flex className="company-tabs--list" vertical gap={20}>
            {draftLoading ? (
              <div style={{ padding: "20px 0" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "30px",
                  }}
                >
                  {/* skeleton for header */}
                  <div
                    className="skeletonHeaderProfile"
                    style={{ marginBottom: "30px" }}
                  >
                    <div>
                      <Skeleton.Avatar size={70} shape="circle" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Skeleton active paragraph={{ rows: 1, width: "100%" }} />
                    </div>
                  </div>
                  {/* skeleton for body */}
                </div>
              </div>
            ) : <DraftBlog draftBlogs={draft}/>}
          </Flex>
        )}
      </Flex>
    </div>
  );
}
