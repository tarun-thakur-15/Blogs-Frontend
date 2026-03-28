"use client";
import React, { useEffect, useState } from "react";
import "./styles/homepage.css";
import Image from "next/image";
import Arrow from "../assets/images/arrow1.png";
import ImageTwo from "../assets/images/BlogImageTwo-removebg-preview.png";
import ImageFour from "../assets/images/BlogImageFour-removebg-preview.png";
import ImageFive from "../assets/images/BlogImageFive-removebg-preview.png";
import ImageSix from "../assets/images/BlogImageSix-removebg-preview.png";
import LogInModal from "./Components/LogInModal";
import Cookies from "js-cookie";
import SignInModal from "./Components/SignInModal";
const Home: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  useEffect(() => {

    const storedEmail = Cookies.get("email");
    const storedUsername = Cookies.get("username");
    const storedFullName = Cookies.get("fullname");
    const accessToken = Cookies.get("accessToken");

    if (storedEmail && storedUsername && storedFullName && accessToken) {
      setEmail(storedEmail);
      setUsername(storedUsername);
      setFullName(storedFullName);
      setIsLoggedIn(true);
 
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
    setIsLoginModalOpen(false);
    document.body.classList.add("modal-opened");
  };
  const showLoginModal = () => {
    setIsModalOpen(false);
    setIsLoginModalOpen(true);
    document.body.classList.add("modal-opened");
  };
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
                    <p className="pSection1 ">
                      Discover a platform where your ideas spark conversations
                      and inspire change. Write today. Be heard.
                    </p>
                  </div>
                </div>
              </div>

              <div className="">
                <button onClick={showLoginModal} className="buttonGetStarted">
                  <span className="btnText">Get Started</span>
                  <Image
                    src={Arrow}
                    alt="Get-Started"
                    height={24}
                    width={24}
                    className="arrowImageSize"
                  ></Image>
                </button>
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
              <div>
                <p className="pSection5 normaliq-font">
                  Your Story Deserves This Spotlight.
                </p>
              </div>
              <button onClick={showLoginModal} className="section5Btn">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* ----------------section 3------------------ */}
      <section>
        <div className="containerSection4 sect4">
          <div className="SectionImageParent">
            <div className="SectionTextDiv">
              <div>
                <p className="pSection4 normaliq-font">
                  Got a story, an idea, or an experience to share? Publish your
                  blog and connect with a community that values your perspective
                  <span className="dot normaliq-font">
                    .
                    {/* <Image
                      src={Vector3}
                      alt="Vector"
                      className="sect4AbsoluteImage"
                    /> */}
                  </span>
                </p>
              </div>
              <button onClick={showLoginModal} className="section4Btn">
                Get Started
              </button>
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
              <div>
                <p className="pSection6 normaliq-font">
                  Your ideas deserve the world’s attention. Start a blog that
                  inspires, informs, and leaves a mark.
                </p>
              </div>
              <button onClick={showLoginModal} className="section6Btn">
                Get Started
              </button>
            </div>
          </div>
          <div className="SectionImageParent">
            {/* <Image src={Section6Image} alt="section" className="SectImage" /> */}
            <Image src={ImageSix} alt="section" className="SectImage" />
            <Image src={ImageSix} alt="section" className="SectImageMobile" />
          </div>
        </div>
      </section>
      <SignInModal
        setIsModalOpen={setIsModalOpen}
        showLoginModal={showLoginModal}
        isModalOpen={isModalOpen}
      />
      <LogInModal
        setIsModalOpen={setIsLoginModalOpen}
        showSignModal={showModal}
        isModalOpen={isLoginModalOpen}
      />
    </>
  );
};

export default Home;
// ------------------
