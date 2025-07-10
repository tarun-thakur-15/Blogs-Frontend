// UPDATED ShareModal.jsx
import "../styles/ShareModal.css";
import Modal, { Styles } from "react-modal";
import React, { useEffect, useState } from "react";
import FaceBook from "../../assets/images/FacebookLogo.svg";
import LinkedIn from "../../assets/images/LinkedInLogo.svg";
import Reddit from "../../assets/images/RedditLogo.svg";
import Tiktok from "../../assets/images/TikTok.svg";
import WhatsApp from "../../assets/images/WhatsApp.svg";
import Mail from "../../assets/images/Envelope.svg";
import Link from "next/link";

interface ShareModalProps {
  isShareModalOpen: boolean;
  closeShareModal?: () => void;
  isShareModalAnimating?: boolean;
  shareUrl?:any
}

export default function ShareModal({
  isShareModalOpen,
  closeShareModal,
  isShareModalAnimating,
  shareUrl
}: ShareModalProps) {
  
  const [text, setText] = useState(shareUrl);
  const [isCopied, setIsCopied] = useState(false);
  useEffect(() => {
    setText(shareUrl);
  }, [shareUrl]);
  const handleCopy = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  // Remove stopPropagation here so that the modal’s events work correctly
  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (closeShareModal) {
      closeShareModal();
    }
  };
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const customStyles: Styles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    content: {
      position: 'absolute',
      inset: 'auto',
      padding: 0,
      border: 'none',
      background: 'none',
      maxWidth: isMobile ? "100%" : "500px",
      width: '100%%',
      margin: '0 auto'
    }
  };

  return (
    <Modal
      isOpen={isShareModalOpen}
      onRequestClose={closeShareModal}
      className={`modal-content ${isShareModalAnimating ? "animate-open" : "animate-close"} !relative`}
      overlayClassName="modal-overlay"
      style={customStyles}
      ariaHideApp={false}
    >
      {/* Wrap modal content in a container that stops propagation */}
      <div onClick={(e) => e.stopPropagation()} className="relative w-full h-full !p-8 bg-white rounded-lg flex-col justify-center md:justify-start items-start gap-8 inline-flex">
        {/* Close Icon */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl"
        >
          &#10005;
        </button>

        <div className="flex-col justify-start items-start gap-2 inline-flex">
          <h2 className="text-[#202020] text-xl font-bold leading-[30px] font-libre">
            Share this blog with your circle!
          </h2>
          <p className="text-[#666666] text-sm font-normal leading-snug font-inter">
            Inspire, relate, or spark a thought — spread the story on your socials.
          </p>
        </div>
        <div className="flex flex-col justify-center items-center gap-6 w-full">
          <div className="h-9 !pl-3 !pr-1.5 !py-1 bg-slate-100 rounded items-center gap-1 inline-flex overflow-hidden w-full justify-between">
            <input
              type="text"
              value={text}
              readOnly
              onChange={(e) => setText(e.target.value)}
              placeholder="https://www.figma.com/design/6E2T9DeIJmuK2M4"
              className="text-slate-800 text-sm font-normal leading-snug w-full bg-slate-100 focus:outline-none focus:ring-0 font-inter"
            />
            <button onClick={handleCopy} className="px-2 py-1 rounded-sm justify-center items-center gap-2.5 inline-flex overflow-hidden">
              <span className="text-[#1d72d2] text-[13px] font-medium leading-tight font-inter">{isCopied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="w-full">
            <div className="flex items-center justify-center w-full">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-2 text-gray-500 font-inter">OR</span>
              <div className="flex-grow h-px bg-gray-300"></div>
            </div>
          </div>
          <div className="flex justify-center items-center gap-6 w-full flex-wrap">
            <Link target="_blank" rel="noopener noreferrer" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(text)}`} className="h-12 p-2 bg-slate-100 rounded inline-flex items-center">
              <FaceBook className="w-8 h-8" />
            </Link>
            <Link target="_blank" rel="noopener noreferrer" href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(text)}`} className="h-12 p-2 bg-slate-100 rounded inline-flex items-center">
              <LinkedIn className="w-8 h-8" />
            </Link>
            <Link target="_blank" rel="noopener noreferrer" href={`https://www.reddit.com/submit?url=${encodeURIComponent(text)}&title=${encodeURIComponent('Check this out')}`} className="h-12 p-2 bg-slate-100 rounded inline-flex items-center">
              <Reddit className="w-8 h-8" />
            </Link>
            <Link target="_blank" rel="noopener noreferrer" href={`https://www.tiktok.com/share?url=${encodeURIComponent(text)}`} className="h-12 p-2 bg-slate-100 rounded inline-flex items-center">
              <Tiktok className="w-8 h-8" />
            </Link>
            <Link target="_blank" rel="noopener noreferrer" href={`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`} className="h-12 p-2 bg-slate-100 rounded inline-flex items-center">
              <WhatsApp className="w-8 h-8" />
            </Link>
            <Link target="_blank" rel="noopener noreferrer" href={`mailto:?subject=${encodeURIComponent('Check this out')}&body=${encodeURIComponent(text)}`} className="h-12 p-2 bg-slate-100 rounded inline-flex items-center">
              <Mail className="w-8 h-8" />
            </Link>
          </div>
        </div>
      </div>
    </Modal>
  );
}
