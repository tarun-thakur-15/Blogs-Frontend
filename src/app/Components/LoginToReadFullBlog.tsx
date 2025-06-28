"use client";
import { useState } from "react";
import LogInModal from "./LogInModal";
import SignInModal from "./SignInModal";
import Cookies from "js-cookie";
import Image from "next/image";
import Vector from "../../assets/images/vector.png";
export default function LoginToReadFullBlog() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const accessToken = Cookies.get("accessToken");

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
      {!accessToken && (
        <div className="no-data-profile">
          <div style={{position: "relative"}}>
            <h2>
              <span className="!text-[#0969da] !font-bold" onClick={showLoginModal}>Login</span> to read the full Blog 😊
            </h2>
          </div>
        </div>
      )}
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
}
