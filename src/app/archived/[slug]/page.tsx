export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;
import { format } from "date-fns";
import "../../styles/page.css";
import "../../styles/awnserbox.css";
import Link from "next/link";
import Image from "next/image";
import { Flex } from "antd";

import CompanyHeaderOther from "../../Components/CompanyHeaderOther";
import { getArchivedBlog } from "../../services/api";
// Images
import Profile from "../../../public/images/profile.svg";
import Divider from "../../../assets/images/divider.png";
import { cookies } from "next/headers";
import DefaultImage from "../../../assets/images/not-logged-in-user.png";
import BoxIconPng from "../../../assets/images/box.png";
import LoginToRead from "../../../assets/images/LoginToRead.jpeg";
import LoginToReadFullBlog from "../../Components/LoginToReadFullBlog";
import ArchivedPageActions from "@/app/Components/ArchivedPageActions";

interface PageProps {
  params: { slug: string };
}

const ArchivedDetailPage = async ({ params }: PageProps) => {
  const { slug } = await params;

  // Get token from cookies server side
  const cookieStore = await cookies();
  const usernameFromCookies = cookieStore.get("username")?.value;

  // Fetch the blog details using your API function.
  const blogData = await getArchivedBlog(slug);
  const createdAt = new Date(blogData.blog.createdAt);
  const updatedAt = new Date(blogData.blog.updatedAt);

  // Format the date as "10th March, 2025"
  const formatDate = (date: Date) => {
    const day = date.getDate();
    const suffix = ["th", "st", "nd", "rd"][
      day % 10 > 3 || [11, 12, 13].includes(day) ? 0 : day % 10
    ];
    return `${day}${suffix} ${format(date, "MMMM, yyyy")}`;
  };

  // Compare Created At and Updated At
  const isSameDate = createdAt.getTime() === updatedAt.getTime();
  return (
    <main className={"main single-page marginTop"}>
      <div className="container">
        <CompanyHeaderOther
          username={blogData.blog.author.username}
          fullName={blogData.blog.author.fullName}
          followersCount={blogData.blog.author.followersCount}
          followingCount={blogData.blog.author.followingCount}
          isFollowed={blogData.blog.author.isFollowed}
          usernameFromCookies={usernameFromCookies}
          isFavourite={blogData.blog.isFavourite}
          blogSlug={blogData.blog.slug}
        />

        <div className="bread-crumbs">
          <Link href={"/company-page"}>{blogData.blog.author.username}</Link>
          <p>/</p>
          <p>{blogData.blog.topic}</p>
        </div>

        <div className="single-answer-page">
          <Flex justify="space-between">
            <Flex vertical gap={60} className="single-answer-page-details">
              <Flex vertical gap={30}>
                <Flex vertical className="single-answer">
                  <h2>{blogData.title}</h2>
                  <p dangerouslySetInnerHTML={{ __html: blogData.blog.content }} />
                  <LoginToReadFullBlog />
                  <Flex
                    justify="space-between"
                    align="center"
                    wrap="wrap"
                    className="single-answer--details"
                  >
                    <Flex gap={6} align="center">
                      <Flex gap={6} align="center">
                        <div className="awnser-box--company">
                          <Image
                            className=""
                            src={DefaultImage}
                            alt="Tarun"
                            width={40}
                            height={40}
                          />
                        </div>
                        <Link href={`/user/${blogData.blog.author.username}`}>
                          <Flex gap={4} align="center">
                            <h5>By {blogData.blog.author.fullName}</h5>
                          </Flex>
                        </Link>
                      </Flex>
                      <div className="date-space"></div>
                      <p className="date">
                        Created At {formatDate(createdAt)} ,{" "}
                      </p>
                      {!isSameDate && (
                        <p className="date">
                          Updated At {formatDate(updatedAt)}
                        </p>
                      )}
                    </Flex>
                  </Flex>
                </Flex>
                <Image className="divider" src={Divider} alt="divider" />
              </Flex>
            </Flex>

            <ArchivedPageActions
              slug={blogData.blog.slug}
              reaction={blogData.blog.reaction}
              totalComments={blogData.blog.totalComments}
              isLiked={blogData.blog.isLiked}
              isConfusing={blogData.blog.isConfusing}
              isAmazing={blogData.blog.isAmazing}
              isDisliked={blogData.blog.isDisliked}
            />
          </Flex>
        </div>
      </div>
    </main>
  );
};

export default ArchivedDetailPage;
