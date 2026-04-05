
export const dynamicParams = true;
export const revalidate = 3600; 
import { format } from "date-fns";
import "../styles/page.css";
import "../styles/awnserbox.css";
import Link from "next/link";
import Image from "next/image";
import { Flex } from "antd";
import Comments from "../Components/CommentsUIFix";
import ProfileHeaderDetailedBlog from "../Components/ProfileHeaderDetailedBlog";
import MiddleRelatedFaqs from "../Components/MiddleRelatedFaqs";
import { getComments } from "../services/api";
import { getPerticularBlog } from "../services/apissr";
import BlogContent from "../Components/Blogcontent";
// Images
import Divider from "../../assets/images/divider.png";
import { cookies } from "next/headers";
import FaqPageActions from "../Components/FaqPageActions";
import FaqPageActionsMobile from "../Components/FaqPageActionsMobile";
import LoginToReadFullBlog from "../Components/LoginToReadFullBlog";
import ProfileAvatar from "../Components/ProfileAvatar";

interface PageProps {
  params: { slug: string };
}

const BlogDetailPage = async ({ params }: PageProps) => {
  const backendBaseUrl = "https://blogs-backend-ftie.onrender.com";
  const { slug } = await params;

  // Get token from cookies server side
  const cookieStore = await cookies();
  const usernameFromCookies = cookieStore.get("username")?.value;

  // Fetch the blog details using your API function.
  const blogData = await getPerticularBlog(slug);
  console.log(blogData);

  //fetching comments
  const commentsData = await getComments(slug, 0, 10);

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
        <div></div>

        <div className="single-answer-page">
          <div className="w-full flex justify-between">
            <Flex vertical gap={60} className="single-answer-page-details">
              <Flex vertical gap={30}>
                <Flex vertical className="single-answer">
                  <h1>{blogData.title}</h1>
                  <BlogContent content={blogData.content} />
                  {/* <LoginToReadFullBlog /> */}
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
                          <ProfileAvatar
                            profileImage={blogData.author.profileImage}
                            backendBaseUrl={backendBaseUrl}
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
                  {/* action buttons for mobile and tablet screens */}
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
            {/* action buttons for desktop */}
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
          </div>
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
