import "./styles/homepage.css";
import Image from "next/image";
import ImageTwo from "../assets/images/BlogImageTwo-removebg-preview.png";
import ImageFour from "../assets/images/BlogImageFour-removebg-preview.png";
import ImageFive from "../assets/images/BlogImageFive-removebg-preview.png";
import ImageSix from "../assets/images/BlogImageSix-removebg-preview.png";
import HomeButton from "./Components/HomePageButton";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  // 🔥 Redirect if logged in
  if (token) {
    redirect("/home");
  }

  return (
    <>
      {/* ------------------section 1--------------------- */}
      <section>
        <div className="containerSection1 sect1">
          <div className="SectionImageParent">
            <Image
              src={ImageTwo}
              alt="section"
              className="StreetSign fade-image"
            />
          </div>
          <div className="sect1left">
            <div className="sect1Inner">
              <div>
                <div className="text">
                  <div className="heading">
                    <span className="section1Span">
                      Where Words Shape the World
                    </span>
                    <h1 className="h1Section1 normaliq-font">
                      Your Voice, Your Story — Share It With Millions
                    </h1>
                  </div>
                  <div className="description">
                    <p className="pSection1">
                      Discover a platform where your ideas spark conversations
                      and inspire change. Write today. Be heard.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <HomeButton className="buttonGetStarted" showArrow={true} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------section 2------------------ */}
      <section>
        <div className="containerSection5 sect5">
          <div className="SectionImageParent">
            <Image src={ImageFive} alt="section" className="SectImage" />
            <Image src={ImageFive} alt="section" className="SectImageMobile" />
          </div>
          <div className="SectionImageParent">
            <div className="SectionTextDiv">
              <p className="pSection5 normaliq-font">
                Your Story Deserves This Spotlight.
              </p>
              <HomeButton className="section5Btn" showArrow={false} />
            </div>
          </div>
        </div>
      </section>

      {/* ----------------section 3------------------ */}
      <section>
        <div className="containerSection4 sect4">
          <div className="SectionImageParent">
            <div className="SectionTextDiv">
              <p className="pSection4 normaliq-font">
                Got a story, an idea, or an experience to share? Publish your
                blog and connect with a community that values your perspective
                <span className="dot normaliq-font">.</span>
              </p>
              <HomeButton className="section4Btn" showArrow={false} />
            </div>
          </div>
          <div className="SectionImageParent">
            <Image src={ImageFour} alt="section" className="SectImage" />
            <Image src={ImageFour} alt="section" className="SectImageMobile" />
          </div>
        </div>
      </section>

      {/* ----------------section 4------------------ */}
      <section>
        <div className="containerSection2 sect6">
          <div className="SectionImageParent">
            <div className="SectionTextDiv">
              <p className="pSection6 normaliq-font">
                Your ideas deserve the world’s attention. Start a blog that
                inspires, informs, and leaves a mark.
              </p>
              <HomeButton className="section6Btn" showArrow={false} />
            </div>
          </div>
          <div className="SectionImageParent">
            <Image src={ImageSix} alt="section" className="SectImage" />
            <Image src={ImageSix} alt="section" className="SectImageMobile" />
          </div>
        </div>
      </section>
    </>
  );
}
