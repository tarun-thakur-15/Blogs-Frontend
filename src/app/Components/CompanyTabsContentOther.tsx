"use client";
import React, { useState, forwardRef, useEffect } from "react";
import { Flex, Skeleton, Spin } from "antd";
import FaqsForUserPage from "../Components/FaqsForUserPage";
import DynamicTopicBlogs from "./DynamicTopicBlogs";
import AllBlogsUserPage from "./AllBlogsUserPage";
import Cookies from "js-cookie";
import {
  getBlogsByTopic,
  getHighlightedBlogs,
  getUserBlogs,
} from "../services/api";

// CSS
import "../styles/tabs.css";
import DetailedBlogHeaderSkeleton from "./DetailedBlogHeaderSkeleton";
import BlogSkeleton from "./BlogSkeleton";
// IMAGES
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

interface CompanyTabsContentOtherProps {
  about?: string;
  type?: string;
  username: string;
  topic?: string;
}
export default function CompanyTabsContentOther({
  about,
  type,
  username,
  topic,
}: CompanyTabsContentOtherProps) {
  // Local state for blogs fetched by topic (when type === "Topic")
  const [topicBlogs, setTopicBlogs] = useState<BlogPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const token = Cookies.get("accessToken");

  // When the tab type is "Topic" and a topic is provided, fetch blogs for that topic
  useEffect(() => {
    if (type === "Topic" && topic) {
      setLoading(true);
      getBlogsByTopic(username, topic, 0, 10, token)
        .then((data) => {
          setTopicBlogs(data.blogs || []);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching blogs by topic:", error);
          setLoading(false);
        });
    }
  }, [type, topic, username]);
  // -------------------sattes and useeffect hor highlighted blogs-------------------
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
  }, [type, username]);

  // -------------------states and useEffect hor All blogs of perticular user-------------------
  const [allBlogs, setAllBlogs] = useState<BlogPreview[]>([]);
  const [allBlogsLoading, setAllBlogsLoading] = useState(false);

  // Fetch All blogs when type is "AllBlogs"
  useEffect(() => {
    if (type === "All Blogs") {
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
  }, [type, username]);


  return (
    <div className="company-tabs--content">
      <Flex vertical gap={type !== "About" ? 20 : 12}>
        <Flex justify="space-between" align="center">
          <Flex gap={6} align="center">
            <h4 className="mb-0">{type === "Topic" ? topic : type}</h4>
          </Flex>
        </Flex>

        {type === "About" ? (
          <Flex className="company-tabs--list" vertical gap={20}>
            <p>{about}</p>
          </Flex>
        ) : null}
        {type === "Highlights" ? (
          <Flex className="company-tabs--list" vertical gap={20}>
            {highlightedBlogsLoading ? (
              <BlogSkeleton/>
            ) : (
              <FaqsForUserPage
                initialBlogs={highlightedBlogs || []}
                username={username}
              />
            )}
          </Flex>
        ) : null}

        {type === "All Blogs" ? (
          <Flex className="company-tabs--list" vertical gap={20}>
            {allBlogsLoading ? (
              <BlogSkeleton/>
            ) : (
              <AllBlogsUserPage
                initialBlogs={allBlogs || []}
                username={username}
              />
            )}
          </Flex>
        ) : null}
       
        {type === "Topic" ? (
          <Flex className="company-tabs--list" vertical gap={20}>
            {loading ? (
             <BlogSkeleton/>
            ) : (
              <DynamicTopicBlogs
                initialBlogs={topicBlogs || []}
                username={username}
                topic={topic}
              />
            )}
          </Flex>
        ) : null}
      </Flex>
    </div>
  );
}
