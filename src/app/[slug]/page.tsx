export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;
import { format } from "date-fns";
import "../styles/page.css";
import "../styles/awnserbox.css";
import Link from "next/link";
import Image from "next/image";
import { Flex } from "antd";
import Comments from "../Components/CommentsUIFix";
import ProfileHeaderDetailedBlog from "../Components/ProfileHeaderDetailedBlog";
import MiddleRelatedFaqs from "../Components/MiddleRelatedFaqs";
import { getPerticularBlog, getComments } from "../services/api";
import ReadTTS from "../Components/ReadTTS";
import { cn } from "@/lib/utils";
import ShareModal from "../Components/ShareModal";
// Images
import Divider from "../../assets/images/divider.png";
import { cookies } from "next/headers";
import FaqPageActions from "../Components/FaqPageActions";
import FaqPageActionsMobile from "../Components/FaqPageActionsMobile";
import DefaultImage from "../../assets/images/not-logged-in-user.png";
import BoxIconPng from "../../assets/images/box.png";
import LoginToRead from "../../assets/images/LoginToRead.jpeg";
import LoginToReadFullBlog from "../Components/LoginToReadFullBlog";
import Listen from "./../../../public/images/Listen.svg";

interface PageProps {
  params: { slug: string };
}

const BlogDetailPage = async ({ params }: PageProps) => {
  const { slug } = params;

  // Get token from cookies server side
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";
  const usernameFromCookies = cookieStore.get("username")?.value;

  // Fetch the blog details using your API function.
  const blogData = await getPerticularBlog(slug, accessToken);

  //fetching comments
  const commentsData = await getComments(slug, 0, 10, accessToken);

  const createdAt = new Date(blogData.createdAt);
  const updatedAt = new Date(blogData.updatedAt);
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
        
        <ProfileHeaderDetailedBlog
          username={blogData.author.username}
          fullName={blogData.author.fullName}
          followersCount={blogData.author.followersCount}
          followingCount={blogData.author.followingCount}
          isFollowed={blogData.author.isFollowed}
          totalBlogs={blogData.author.totalBlogs}
          usernameFromCookies={usernameFromCookies}
          isFavourite={blogData.isFavourite}
          blogSlug={blogData.slug}
          profileImage={blogData.author.profileImage}
        />

        <div className="bread-crumbs">
          <Link href={"/company-page"}>{blogData.author.username}</Link>
          <p>/</p>
          <p>{blogData.topic}</p>
        </div>
        <div>
          <p>{blogData.readersCount} readers</p>
          <ReadTTS text={blogData.content}>
            <button
              className={cn(
                "px-4 py-2 rounded-full h-[38px] w-[130px] flex justify-center",
                "bg-gradient-to-r from-purple-500 to-blue-500",
                "shadow-lg hover:shadow-xl",
                "transition-all duration-300",
                "hover:scale-105",
                "text-white font-semibold text-sm",
                "flex items-center gap-2",
                "focus:outline-none focus:ring-2 focus:ring-purple-400",
                "active:scale-95 active:shadow-sm"
              )}
            >
              <Listen className="h-4 w-4" />
              Listen Blog
            </button>
          </ReadTTS>
        </div>

        <div className="single-answer-page">
          <Flex justify="space-between">
            <Flex vertical gap={60} className="single-answer-page-details">
              <Flex vertical gap={30}>
                <Flex vertical className="single-answer">
                  <h2>{blogData.title}</h2>
                  <div className="forImageInsideContent" dangerouslySetInnerHTML={{ __html: blogData.content }} />
                  <LoginToReadFullBlog />
                  <Flex
                    justify="space-between"
                    align="center"
                    wrap="wrap"
                    className="single-answer--details"
                  >
                    <Flex
                      gap={6}
                      align="start"
                      className="flex-col lg:flex-row"
                    >
                      <Flex gap={6} align="center">
                        <div className="awnser-box--company">
                          <Image
                            className=""
                            src={ `https://blogs-backend-ftie.onrender.com/${blogData.author.profileImage}` ||  DefaultImage}
                            alt="Tarun"
                            width={40}
                            height={40}
                          />
                        </div>
                        <Link href={`/user/${blogData.author.username}`}>
                          <Flex gap={4} align="start">
                            <h5>By {blogData.author.fullName}</h5>
                          </Flex>
                        </Link>
                      </Flex>
                      <div className="hidden lg:inline-block date-space"></div>
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
                  <div className="lg:hidden">
              <FaqPageActionsMobile
                slug={blogData.slug}
                reaction={blogData.reaction}
                totalComments={blogData.totalComments}
                isLiked={blogData.isLiked}
                isConfusing={blogData.isConfusing}
                isAmazing={blogData.isAmazing}
                isDisliked={blogData.isDisliked}
              />
            </div>
                </Flex>
                <Image className="divider" src={Divider} alt="divider" />
                <Flex vertical className="">
                  <div id="comments">
                    <Comments
                      slug={blogData.slug}
                      initialComments={commentsData.comments}
                      initialTotalComments={commentsData.totalComments}
                      blogAuthor={blogData.author.username}
                    />
                  </div>
                </Flex>
              </Flex>
            </Flex>
            
            <div className="hidden lg:block">
              <FaqPageActions
                slug={blogData.slug}
                reaction={blogData.reaction}
                totalComments={blogData.totalComments}
                isLiked={blogData.isLiked}
                isConfusing={blogData.isConfusing}
                isAmazing={blogData.isAmazing}
                isDisliked={blogData.isDisliked}
              />
            </div>
          </Flex>
          {/* uncomment this below div when you need to give related blogs */}
          {/* <div className="related-question">
            <Image className="divider" src={Divider} alt="divider" />
            <Flex vertical gap={24} className="related-question--list">
              <h3>Related Questions</h3>
              <MiddleRelatedFaqs />
            </Flex>
          </div> */}
        </div>
      </div>
    </main>
    
  );
};

export default BlogDetailPage;
