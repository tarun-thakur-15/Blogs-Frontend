// app/home/page.tsx
// export const dynamic = "force-dynamic";
export const revalidate = 60; // 1 hour
import "../styles/page.css";
import "../styles/awnserbox.css";
import CustomAutoComplete from "../Components/CustomAutoComplete";
import FaqsForHomePage from "../Components/FaqsForHomePage";
import { getAllBlogs } from "../services/api";

async function HomePageServerSide() {

  // Fetch blogs from your backend API with offset=0, limit=10
  const blogsData = await getAllBlogs(0, 10);

  return (
    <main className="main">
      <div className="container relative">
        <div className="banner-content">
          <h1>Find the Blogs That Matter</h1>
          <p>
            Your source for ideas, stories, and inspiration.
          </p>
          <CustomAutoComplete />
        </div>
        <div className="company-tabs homeParentOuter">
          <div>
            <span className="topPicksSpan">Top Picks For You</span>
          </div>
          <div className="homeParent">
            <div className="ansBoxParent">
              {/* Pass the fetched blogs to the FaqsForHomePage component */}
              <FaqsForHomePage initialBlogs={blogsData.blogs} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default HomePageServerSide;
