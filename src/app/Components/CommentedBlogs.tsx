import { Button, Flex, Skeleton } from "antd";
import moment from "moment";
import Image from "next/image";
import notLoggedInIcon from "../../assets/images/not-logged-in-user.png";
import { getCommentedBlogs } from "../services/api";
import { useCallback, useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import BoxIconPng from "../../assets/images/box.png";
import BlogSkeleton from "./BlogSkeleton";

// Define an interface for an individual comment
export interface CommentData {
  _id: string;
  content: string;
  createdAt: string;
  commentAuthorUsername: string;
}

// Define an interface for a blog with comments
export interface CommentedBlog {
  comments: CommentData[];
  blogId: string;
  title: string;
  previewContent: string;
  slug: string;
  createdAt: string;
  blogAuthorUsername: string;
}

// Define props for the component
interface CommentedBlogsProps {
  initialBlogs: CommentedBlog[];
}

interface CommentedBlogsProps {
  initialBlogs: CommentedBlog[];
}

export default function CommentedBlogs({ initialBlogs }: CommentedBlogsProps) {
    const AccessToken = Cookies.get("accessToken")!;
    const username = Cookies.get("username")!;
      const offsetRef = useRef<number>(initialBlogs.length);
      const [loadingMore, setLoadingMore] = useState(false);
      const loadMoreRef = useRef<HTMLDivElement | null>(null);
      const [hasMore, setHasMore] = useState(true);
        const [blogs, setBlogs] = useState<CommentedBlog[]>(initialBlogs);
  const loadMoreBlogs = useCallback(async () => {
    setLoadingMore(true);
    try {
      const data = await getCommentedBlogs(offsetRef.current, 10, username, AccessToken);
      if (data.blogs && data.blogs.length > 0) {
        setBlogs((prev) => {
          const newBlogs = [...prev, ...data.blogs];
          // Update the offsetRef to the new total count.
          offsetRef.current = newBlogs.length;
          return newBlogs;
        });
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more blogs:", error);
    }
    setLoadingMore(false);
  }, [username]);
  useEffect(() => {
    if (!hasMore) return; // If no more blogs, do nothing
    const observer = new IntersectionObserver(
      (entries) => {
        // If the loadMoreRef container is visible and not currently loading, trigger loadMoreBlogs
        if (entries[0].isIntersecting && !loadingMore) {
          loadMoreBlogs();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreBlogs, loadingMore, hasMore]);
  return (
    <>
    
    <div>
      {initialBlogs.map((blog, index) => (
        <div
          key={`${blog.blogId}-${index}`}
          className="awnser-box"
          style={{ marginBottom: "20px" }}
        >
          <div className="awnser-box-header">
            <p className="awnser-box--question">{blog.title}</p>
          </div>
          <div className="awnser-box-body">
            <p
              className="awnser-box--awnser forImageInsideContent"
              dangerouslySetInnerHTML={{ __html: blog.previewContent }}
            />
          </div>
          <div className="awnser-box-footer">
            <Flex justify="space-between" align="center">
              <Flex gap={2} align="center">
                <div className="awnser-box--company">
                  <Image
                    src={notLoggedInIcon}
                    alt={blog.blogAuthorUsername}
                    width={40}
                    height={40}
                  />
                </div>
                <Flex gap={4} align="center">
                  <p>By {blog.blogAuthorUsername}</p>
                  <p className="date">
                    {moment(blog.createdAt).format("Do MMM, YYYY")}
                  </p>
                </Flex>
              </Flex>
            </Flex>
            {/* Render comments for the blog */}
            <Flex vertical className="comments-list">
              <div className="comments-list-inner">
                {blog.comments?.map((comment) => (
                  <div key={comment._id} className="comments-list--item">
                    <div className="comments-list--item--img">
                      <Image
                        src={notLoggedInIcon}
                        alt="User profile"
                        width={40}
                        height={40}
                      />
                    </div>
                    <div className="comments-list--item--details">
                      <Flex align="center" gap={8} justify="space-between">
                        <Flex align="center" gap={8}>
                          <p className="comments-list--name">
                            {comment.commentAuthorUsername}
                          </p>
                          <p>•</p>
                          <p className="comments-list--date">
                            {moment(comment.createdAt).format("Do MMM, YYYY")}
                          </p>
                        </Flex>
                      </Flex>
                      <div className="awnser-box--awnser">
                        <p className="awnser-box--awnser">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                )) || null}
              </div>
            </Flex>
          </div>
        </div>
      ))}
    </div>      {/* No more blogs message */}
      {!hasMore && blogs.length > 0 && (
        <div className="no-data-profile">
          <Image src={BoxIconPng} alt="No blogs" />
          <div>
            <h2>
              Looks like you've reached the end! <br /> No more blogs. 😊
            </h2>
          </div>
        </div>
      )}

      {/* Loading Skeleton for Infinite Scroll */}
      <div ref={loadMoreRef}>
        {loadingMore && (
          <BlogSkeleton/>
        )}
      </div>
      </>
  );
}
