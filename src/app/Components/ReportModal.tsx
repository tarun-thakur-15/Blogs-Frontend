import "../styles/ShareModal.css";
import Link from "next/link";
import Modal, { Styles } from "react-modal";
import React, { useEffect, useState } from "react";
import ReportedSuccessfully from "../../assets/gifs/ReportedSuccessfully.gif";
import Image from "next/image";

interface ReportModalProps {
  isReportModalOpen: boolean;
  closeReportModal?: () => void;
  isAnimating?: boolean;
  commentSlug?: any;
}

export default function ReportModal({
  isReportModalOpen,
  closeReportModal,
  isAnimating,
  commentSlug,
}: ReportModalProps) {
  const [formLevel, setFormLevel] = useState(0);
  const [selectedReason, setSelectedReason] = useState("");

  const reportReasons = [
    "Violates Community Guidelines",
    "Spam",
    "Offensive Content",
    "Misinformation",
    "Harassment",
    "Duplicate Content",
    "Irrelevant Content",
    "Plagiarism",
    "Copyright Infringement",
    "Trolling or Disruptive Behavior",
    "Privacy Violation",
    "Harmful or Dangerous Content",
  ];

  useEffect(() => {
    if (!isReportModalOpen) {
      setFormLevel(0);
      setSelectedReason("");
    }
  }, [isReportModalOpen]);
  const handleClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (closeReportModal) {
      closeReportModal();
    }
  };
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
      maxWidth: '100%',
      width: '100%%',
      margin: '0 auto'
    }
  };
  return (
    <> 

      <Modal
        isOpen={isReportModalOpen}
        onRequestClose={closeReportModal}
        className={`modal-content ${
          isAnimating ? "animate-open" : "animate-close"
        } w-full lg:w-[500px] max-w-full h-full lg:h-[592px] max-h-full`}
        overlayClassName="modal-overlay"
        ariaHideApp={false}
        style={customStyles}
      >
        <div>
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl"
          onClick={handleClose}
        
        >
          &#10005;
        </button>
        {formLevel === 0 && (
          <div className="w-full h-full !p-8 bg-white rounded-lg flex-col justify-center lg:justify-start items-start gap-8 inline-flex max-h-[90vh] overflow-y-auto">
            <div className="flex-col justify-start items-start gap-2 inline-flex mt-[30px] md:mt-0">
              <h2 className="text-[#202020] text-xl font-bold leading-[30px] font-libre">
                Submit a report
              </h2>
              <p className="text-[#666666] text-sm font-normal leading-snug font-inter">
                Thanks for looking out for yourself and your fellow redditors by reporting things that break the rules. Let us know what&apos;s happening, and we&apos;ll look into it.
              </p>
            </div>
            <div className="justify-start items-start gap-4 flex flex-wrap">
              {reportReasons?.map((reason) => (
                <button
                  key={reason}
                  className={`!px-3 !py-2 rounded justify-start items-center gap-1 inline-flex overflow-hidden border ${
                    selectedReason === reason
                      ? "bg-red-500 text-white"
                      : "bg-slate-100 border-transparent hover:border-slate-200"
                  } transition duration-300`}
                  onClick={() => setSelectedReason(reason)}
                >
                  <p className="text-sm font-normal leading-snug font-inter">{reason}</p>
                </button>
              ))}
            </div>
            <div className="justify-start items-start gap-1.5 inline-flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
              >
                <path
                  d="M8 14.25C11.3137 14.25 14 11.5637 14 8.25C14 4.93629 11.3137 2.25 8 2.25C4.68629 2.25 2 4.93629 2 8.25C2 11.5637 4.68629 14.25 8 14.25Z"
                  stroke="#666666"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.5 7.75C7.63261 7.75 7.75979 7.80268 7.85355 7.89645C7.94732 7.99021 8 8.11739 8 8.25V10.75C8 10.8826 8.05268 11.0098 8.14645 11.1036C8.24021 11.1973 8.36739 11.25 8.5 11.25"
                  stroke="#666666"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.75 6.25C8.16421 6.25 8.5 5.91421 8.5 5.5C8.5 5.08579 8.16421 4.75 7.75 4.75C7.33579 4.75 7 5.08579 7 5.5C7 5.91421 7.33579 6.25 7.75 6.25Z"
                  fill="#666666"
                />
              </svg>
              <span className="text-[#666666] text-xs font-normal leading-[18px] font-inter">
                Not sure if something is breaking the rules? Review{" "}
                <Link href={"/"} className="!text-[#1d72d2] !text-xs !font-medium !underline !leading-[18px] font-inter">
                  Civlet’s Privacy Policy
                </Link>{" "}
                &{" "}
                <Link href={"/"} className="!text-[#1d72d2] !text-xs !font-medium !underline !leading-[18px] font-inter">
                  Terms of Use
                </Link>
              </span>
            </div>
            <button
              
              disabled={!selectedReason}
              className="!px-[18px] !py-2 bg-[#e10e30] rounded justify-center items-center gap-1 inline-flex hover:bg-[#c40b29] transition-colors ease-in-out duration-300 overflow-hidden min-h-[35.25px]"
            >
              <span className="!text-white text-sm font-medium leading-snug font-inter">
                Submit report
              </span>
            </button>
          </div>
        )}
        {formLevel === 1 && (
          <div className="w-full h-full lg:h-[352px] max-h-full p-8 bg-white rounded-lg flex-col justify-center items-center gap-3 inline-flex">
            <Image
              src={ReportedSuccessfully}
              alt="Reported Successfully"
              width={150}
              height={150}
              className="h-[150px] w-[150px]"
            />
            <div className="flex-col justify-start items-center gap-2 inline-flex">
              <h2 className="text-[#202020] text-xl font-bold leading-[30px] font-libre">
                Report submitted
              </h2>
              <p className="text-center text-[#666666] text-sm font-normal leading-snug font-inter">
                Thanks again for your report and for looking out for yourself and your fellow users. Your reporting helps make the platform a better, safer, and more welcoming place for everyone.
              </p>
            </div>
          </div>
        )}
        </div>
      </Modal>
    </>
  );
}
