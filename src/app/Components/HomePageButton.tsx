"use client";
import { useState } from "react";
import Image from "next/image";
import Arrow from "../../assets/images/arrow1.png";
import LogInModal from "./../Components/LogInModal";
import SignInModal from "./../Components/SignInModal";

interface props {
  className: string;
  showArrow: boolean;
}

export default function HomeButton({ className, showArrow }: props) {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
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
      <button onClick={showLoginModal} className={`${className}`}>
        <span className="btnText">Get Started</span>
        {showArrow && (
          <Image
            src={Arrow}
            alt="Get-Started"
            height={24}
            width={24}
            className="arrowImageSize"
          ></Image>
        )}
      </button>

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
