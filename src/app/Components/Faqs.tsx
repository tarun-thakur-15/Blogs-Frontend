"use client"
import { useState } from "react";
import Image from "next/image";
import Plus from "../../assets/images/Plus.svg";
import Minuss from "../../assets/images/Minuss.svg";
import Waves from "../../../public/images/FAQAbsolute.webp";

export default function Faqs() {
  const faqs = [
    {
      question: "How can I create a blog post?",
      answer:
        "To create a blog post, log in to your account and navigate to the `Create Blog` section. Add a title, write your content, choose a topic, and hit Publish.",
    },
    {
      question: "Can I edit or delete my blog after publishing?",
      answer:
        "Yes, you can edit or delete your blog anytime from your profile. Simply go to `My Blogs,` select the post, and choose the edit or delete option.",
    },
    {
      question: "How do I get notified about interactions on my blog?",
      answer:
        "You will receive real-time notifications when someone comments on or reacts to your blog, follows you, or when users you follow publish a new post.",
    },
    {
      question: "Can I delete comments on my blog?",
      answer:
        "Yes, as a blog owner, you can delete any comment on your blog. Additionally, users can delete their own comments.",
    },
    {
      question: "How do I gain more visibility for my blogs?",
      answer:
        "To increase visibility, engage with other blogs by commenting and reacting. Share your blog on social media, and write engaging content that attracts readers.",
    },
  ];
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index: any) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <>
      <section>
        <div className="w-[1440px] px-[20px] lg:px-[120px] max-w-full mx-auto relative">
          <div className="w-full flex py-[60px] lg:py-[120px] flex-col lg:flex-row items-start gap-[24px] lg:gap-[48px] self-stretch">
            <div className="lg:w-[50%]">
              <div className="w-full flex py-[24px] flex-col justify-center items-start gap-[8px] flex-grow flex-shrink-0 basis-0">
                <h2
                  className="text-[#202020] text-[28px] lg:text-[36px] font-bold leading-[2.5rem] lg:leading-[54px] font-libre"
                  
                >
                  Your Questions, <br />
                  Answered!
                </h2>
                <p className="text-[#666666] text-base font-medium leading-normal font-inter">
                  Find quick answers to common questions <br className="hidden md:inline-block"/> about our platform.
                </p>
              </div>
            </div>
            <div className="w-full lg:w-[50%] flex flex-col items-start gap-[20px] flex-grow flex-shrink-0 basis-0">
              <div className="w-full flex flex-col gap-[20px]">
                {faqs.map((faq, index) => (
                  <div className="w-full" key={index}>
                    <button
                      className={`px-7 py-[18px] bg-white rounded shadow-[0px_0px_14px_0px_rgba(28,45,58,0.04)] border border-[#c7d4f4] justify-center items-center gap-2.5 inline-flex w-full cursor-pointer ${
                        openIndex === index ? "border-b-0" : ""
                      } `}
                      onClick={() => toggleAccordion(index)}
                    >
                      <p
                        className="grow shrink basis-0 text-[#202020] text-[16px] font-normal leading-[24px] font-libre text-start"
                        
                      >
                        {faq.question}
                      </p>
                      <div
                        className={`transition-transform duration-300 ${
                          openIndex === index ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        {openIndex === index ? (
                          <Minuss className="w-[20px] h-[20px]" />
                          
                        ) : (
                          <Plus className="w-[20px] h-[20px]" />
                        )}
                      </div>
                    </button>
                    <div
                      className={`transition-all duration-300 ease-in-out ${
                        openIndex === index
                          ? "max-h-[200px] py-4 px-7 border border-t-0 border-[#c7d4f4]"
                          : "max-h-0 px-7"
                      }`}
                    >
                      <p
                        className={`text-[#202020] text-[14px] font-normal leading-[20px] font-inter ${
                          openIndex === index ? "block" : "hidden"
                        }`}
                      >
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* -------------------------------------- */}
            </div>
          </div>
        </div>
        <Image src={Waves} alt="waves" className="waves" />
      </section>
    </>
  );
}
