"use client";
import FaqDrawer from "./FaqDrawer";
import DraftDrawer from "./DraftDrawer";
import React, { useRef, useState, useEffect } from "react";
import { Flex, Button } from "antd";
import moment from "moment";
import Options from "../../../public/images/options.svg";
import { Toaster } from "sonner";
import Image from "next/image";
import BoxIconPng from "../../assets/images/box.png";
import "../styles/awnserbox.css";

interface DraftBlogProps {
  draftBlogs: {
    _id: string;
    title: string;
    topic: string;
    content: string;
    createdAt: string;
  }[];
}

export default function DraftBlog({ draftBlogs = [] }: DraftBlogProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const toggleDropdown = (blogId: any) => {
    // Toggle the dropdown for the specific blog
    setIsDropdownOpen((prev) => (prev === blogId ? null : blogId));
  };
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const toggleBottomDrawer = () => {
    setDrawerVisible((prevVisible) => !prevVisible);
  };
  // this is for closing dropdown when clicked anywhere outside it 👇
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        // Close the dropdown
        toggleDropdown(null); // Pass null or undefined to close
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
const isDraftsEmpty =
  !draftBlogs ||
  draftBlogs.length === 0 ||
  (draftBlogs.length === 1 &&
    !draftBlogs[0].title &&
    !draftBlogs[0].topic &&
    !draftBlogs[0].content);
  return (
    <>
      <Toaster position="top-right" />
      {isDraftsEmpty ? (
        <div className="no-data-profile">
          <Image src={BoxIconPng} alt="No blogs" />
          <div>
            <h2>No Draft Available 😊</h2>
          </div>
        </div>
      ) : (
        draftBlogs.map((blog) => (
          <div className="awnser-box" key={blog._id}>
            <div className="awnser-box-header">
              <p className="awnser-box--question">{blog.title}</p>
            </div>
            <div className="awnser-box-body">
              <div className="awnser-box--awnser">
                <p
                  className="awnser-box--awnser"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />
              </div>
            </div>
            <div className="awnser-box-footer">
              <Flex justify="space-between" align="center">
                <Flex gap={4} align="center">
                  <p className="date">
                    {moment(blog.createdAt).format("MMMM D, YYYY")}
                  </p>
                </Flex>
                <Flex gap={12} align="center" style={{ position: "relative" }}>
                  <div
                    ref={dropdownRef}
                    style={{ position: "relative", display: "inline-block" }}
                  >
                    <Button
                      className="optionsBtn"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleDropdown(blog._id);
                      }}
                    >
                      <Options height={18} width={18} />
                    </Button>
                    {isDropdownOpen === blog._id && (
                      <div
                        className="dropdown"
                        style={{
                          position: "absolute",
                          top: "100%",
                          right: 0,
                          backgroundColor: "#fff",
                          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
                          zIndex: 10,
                        }}
                      >
                        <button
                          className="dropdownBtn"
                          onClick={toggleBottomDrawer}
                        >
                          <span className="dropdownText whitespace-nowrap">
                            Continue Writing ✍️
                          </span>
                        </button>
                        <DraftDrawer
                          visible={isDrawerVisible}
                          onClose={toggleBottomDrawer}
                          title={blog.title}
                          topic={blog.topic}
                          content={blog.content}
                        />
                      </div>
                    )}
                  </div>
                </Flex>
              </Flex>
            </div>
          </div>
        ))
      )}
    </>
  );
}
