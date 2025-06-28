"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Flex, Button, Skeleton } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Comment from "../../../public/images/comment.svg";
import BoxIconPng from "../../assets/images/box.png";
import notLoggedInIcon from "../../assets/images/not-logged-in-user.png";
import moment from "moment";
import { getAllBlogs, reactToBlog } from "../services/api";
import { ReactionPayload } from "../services/schema"; // ensure correct path
import "../styles/awnserbox.css";
import Cookies from "js-cookie";
interface Fly {
  id: number;
  startX: number;
  startY: number;
  emoji: string;
}

export default function BlogForProfilePage () {
   // Use a mapping of blogId to an array of fly objects
  const [flyMap, setFlyMap] = useState<Record<string, Fly[]>>({});
  const router = useRouter();
  // We'll use a ref to keep the offset stable between renders.
  const [loadingMore, setLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const AccessToken = Cookies.get("accessToken")!;

  return (
    <>

            <div className="awnser-box">
              <Link href={`/`}>
                <div className="awnser-box-header">
                  <p className="awnser-box--question">title</p>
                </div>
                <div className="awnser-box-body">
                  <p className="awnser-box--awnser">preview content</p>
                </div>
                <div className="awnser-box-footer">
                  <Flex justify="space-between" align="center">
                    <Flex gap={2} align="center">
                      <div className="awnser-box--company">
                        <Image
                          src={notLoggedInIcon}
                          alt="Placeholder avatar"
                          width={40}
                          height={40}
                        />
                      </div>
                      <span className="usernameBlogsHome">
                        &nbsp; username &nbsp;
                      </span>
                      <Flex gap={4} align="center">
                        <p className="date">
                          15th May, 2003
                        </p>
                      </Flex>
                    </Flex>
                    <Flex gap={12} align="center">
                    <div className="crown-button-container" style={{ display: "flex", gap: "12px" }}>
                        <Button type="text">
                          <p className="reactionCountOnHome">👍 10</p>
                        </Button>
                        <Button type="text" >
                          <p className="reactionCountOnHome">🔥 10</p>
                        </Button>
                        <Button type="text" >
                          <p className="reactionCountOnHome">😵‍💫 10</p>
                        </Button>
                        <Button type="text" >
                          <p className="reactionCountOnHome">👎 10</p>
                        </Button>
                      </div>

                      <Button className="add-like" type="text">
                        <Comment width={15} height={15} />
                        <p className="reactionCountOnHome">
                          10
                        </p>
                      </Button>
                    </Flex>
                  </Flex>
                </div>
              </Link>
            </div>

    </>
  );
};
