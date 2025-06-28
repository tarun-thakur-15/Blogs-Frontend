import Image from "next/image";
import Arrow from "../../../public/images/ArrowRight.svg";
// import Strings from "../../../public/images/Strings.png";
import circleAbsolute from "../../../public/images/ExploreAbsoluteImage.webp";
import RepresentativeProfiles from "../../../public/images/RepresentativeProfiles.webp";
import Engage from "../../../public/images/Engage.webp";
import NewsAndMedia from "../../../public/images/NewsAndMedia.webp";
import LocalCivicEvents from "../../../public/images/LocalCivicEvents.webp";
import AccessLegislativeUpdates from "../../../public/images/AccessLegislativeUpdates.webp";
import WhoAreWe from "../../../public/images/WhoAreWe.webp";
import Link from "next/link";

export default function explore() {
  return (
    <>
      <section className="relative">
        <Image
          src={circleAbsolute}
          alt="circleAbsolute"
          className="w-[227px] lg:w-[346px] h-[269px] lg:h-[405px] absolute right-0 top-[-12px] lg:top-[-80px]"
        />
        {/* <Image src={Strings} alt="strings" className="strings" /> */}
        <div
          id="container"
          className="px-[20px] lg:px-[120px] mx-auto w-[1440px] max-w-full"
        >
          <div className="flex-col justify-start items-start gap-2 inline-flex">
            <h2 className="text-[#202020] text-[28px] lg:text-[36px] font-bold leading-[54px] font-libre">
              What Can You Explore?
            </h2>
            <p className="text-[#666666] text-base font-medium leading-normal mt-[8px] font-inter">
              Discover comprehensive civic information and engage with your
              community. <br /> Everything you need, all in one place!
            </p>
          </div>
          <div className="mt-[32px] flex flex-col md:flex-row py-[25px] lg:py-[50px] items-center gap-[44px] lg:gap-[88px] self-stretch w-full">
            <div className="w-full lg:w-[50%]">
              <Image
                src={RepresentativeProfiles}
                alt="RepresentativeProfiles"
                className="w-full h-full"
              />
            </div>
            <div className="w-full lg:w-[50%] flex items-center flex-col gap-[32px]">
              <div className="flex-col justify-center items-start gap-1.5 inline-flex">
                <h3 className="text-[#202020] text-[32px] font-bold leading-[48px] font-libre">
                  Representative Profiles
                </h3>
                <p className="text-[#666666] text-base font-normal leading-normal font-inter">
                  Discover detailed information about your elected officials at
                  the federal, state, and local levels, including their roles,
                  contact details, voting history, and key initiatives they
                  support. Stay informed about who represents you and how
                  they’re shaping policies that impact your community and the
                  nation.
                </p>
              </div>
              <div className="w-full flex justify-start">
                <Link
                  href={"/representatives"}
                  className="pl-[18px] pr-4 py-2.5 exploreButtons rounded justify-start items-center gap-1 flex overflow-hidden group"
                >
                  <span className="text-white text-sm font-medium leading-snug font-inter">
                    View civic data
                  </span>
                  <Image
                    src={"/images/ArrowRight.svg"}
                    alt="Redirect"
                    height={18}
                    width={18}
                    className="transform transition-transform group-hover:translate-x-1 duration-500 ease-in-out relative"
                  />
                  {/* <Arrow className="transform w-[18px] h-[18px] transition-transform group-hover:translate-x-1 duration-500 ease-in-out relative" /> */}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----two----- */}
      <section className="exploreLinearGradient">
        <div
          id="container"
          className="px-[20px] lg:px-[120px] mx-auto w-[1440px] max-w-full"
        >
          <div className="flex flex-col mt-[32px] py-[50px] items-center gap-[88px] self-stretch w-full md:flex-row-reverse exploreLinearGradient">
            <div className="w-full lg:w-[50%]">
              <Image src={Engage} alt="Engage" className="w-full h-full" />
            </div>
            <div className="w-full lg:w-[50%] flex items-center flex-col gap-[32px]">
              <div className="flex-col justify-center items-start gap-1.5 inline-flex">
                <h3 className="text-[#202020] text-[32px] font-bold leading-[48px] font-libre">
                  Engage in Community <br /> Discussions
                </h3>
                <p className="text-[#666666] text-base font-normal leading-normal font-inter">
                  Engage in meaningful conversations with fellow citizens on
                  civic topics. Share your thoughts, ask questions, and connect
                  with your community to foster informed discussions.
                </p>
              </div>
              <div className="w-full flex justify-start">
                <Link href={"/discussions"}>
                  <button className="pl-[18px] pr-4 py-2.5 exploreButtons rounded justify-start items-center gap-1 flex overflow-hidden group">
                    <span className="text-white text-sm font-medium leading-snug font-inter">
                      View Discussion
                    </span>
                    <Arrow className="transform w-[18px] h-[18px] transition-transform group-hover:translate-x-1 duration-500 ease-in-out relative" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----three----- */}
      <section className="relative">
        {/* <Image src={Strings} alt="strings" className="strings" /> */}
        <div
          id="container"
          className="px-[20px] lg:px-[120px] mx-auto w-[1440px] max-w-full"
        >
          <div className="mt-[32px] flex flex-col md:flex-row py-[25px] lg:py-[50px] items-center gap-[44px] lg:gap-[88px] self-stretch w-full">
            <div className="w-full lg:w-[50%]">
              <Image
                src={NewsAndMedia}
                alt="NewsAndMedia"
                className="w-full h-full"
              />
            </div>
            <div className="w-full lg:w-[50%] flex items-center flex-col gap-[32px]">
              <div className="flex-col justify-center items-start gap-1.5 inline-flex">
                <h3 className="text-[#202020] text-[32px] font-bold leading-[48px] font-libre">
                  News & Media Resources
                </h3>
                <p className="text-[#666666] text-base font-normal leading-normal font-inter">
                  Stay updated with news and events relevant to your
                  representatives at the federal, state, and local levels.
                </p>
                <p className="text-[#414141] text-base font-semibold font-inter leading-normal mt-[10px]">
                  Dive into the details of:
                </p>
                <ul className="ml-[10px]">
                  <li className="text-[#666666] text-[16px] font-normal leading-[24px] font-inter">
                    • &nbsp; Local and national news coverage
                  </li>
                  <li className="text-[#666666] text-[16px] font-normal leading-[24px] font-inter">
                    • &nbsp; AI-generated summaries of key news articles news
                  </li>
                  <li className="text-[#666666] text-[16px] font-normal leading-[24px] font-inter">
                    • &nbsp; News & events tailored to each representative on
                    their detail pages
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----four---- */}
      <section className="exploreLinearGradient">
        <div
          id="container"
          className="px-[20px] lg:px-[120px] mx-auto w-[1440px] max-w-full"
        >
          <div className="flex mt-[32px] flex-col py-[50px] items-center gap-[88px] self-stretch w-full md:flex-row-reverse">
            <div className="w-full lg:w-[50%]">
              <Image
                src={LocalCivicEvents}
                alt="LocalCivicEvents"
                className="w-full h-full"
              />
            </div>
            <div className="w-full lg:w-[50%] flex items-center flex-col gap-[32px]">
              <div className="flex-col justify-center items-start gap-1.5 inline-flex">
                <h3 className="text-[#202020] text-[32px] font-bold leading-[48px] font-libre">
                  Local Civic Events
                </h3>
                <p className="text-[#666666] text-base font-normal leading-normal font-inter">
                  Discover political and civic events happening near you and
                  stay engaged with your community.
                </p>
                <p className="text-[#414141] text-base font-semibold font-inter leading-normal mt-[10px]">
                  Dive into the details of:
                </p>
                <ul className="ml-[10px]">
                  <li className="text-[#666666] text-[16px] font-normal leading-[24px] font-inter">
                    • &nbsp; Local, state, and federal events relevant to your representatives
                  </li>
                  <li className="text-[#666666] text-[16px] font-normal leading-[24px] font-inter">
                    • &nbsp; Community gatherings, town halls, and public meetings
                  </li>
                  <li className="text-[#666666] text-[16px] font-normal leading-[24px] font-inter">
                    • &nbsp; Representative-specific event listings on their detail pages
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----five---- */}
      <section className="relative">
        {/* <Image src={Strings} alt="strings" className="strings" /> */}
        <div
          id="container"
          className="px-[20px] lg:px-[120px] mx-auto w-[1440px] max-w-full"
        >
          <div className="mt-[32px] flex flex-col md:flex-row py-[50px] items-center gap-[88px] self-stretch w-full">
            <div className="w-full lg:w-[50%]">
              <Image
                src={AccessLegislativeUpdates}
                alt="AccessLegislativeUpdates"
                className="w-full h-full"
              />
            </div>
            <div className="w-full lg:w-[50%] flex items-center flex-col gap-[32px]">
              <div className="flex-col justify-center items-start gap-1.5 inline-flex">
                <h3 className="text-[#202020] text-[32px] font-bold leading-[48px] font-libre">
                  Access Legislative Updates
                </h3>
                <p className="text-[#666666] text-base font-normal leading-normal font-inter">
                Stay informed on key legislative developments at the federal and state levels.
                </p>
                <p className="text-[#414141] text-base font-semibold leading-normal mt-[6px] font-inter">
                  Dive into the details of:
                </p>
                <ul className="ml-[10px] mt-[2px]">
                  <li className="text-[#666666] text-[16px] font-normal leading-[24px] font-inter">
                    • &nbsp; Current and historic bills shaping policy
                  </li>
                  <li className="text-[#666666] text-[16px] font-normal leading-[24px] font-inter">
                    • &nbsp; AI-generated summaries for quick understanding of complex topics
                  </li>
                  <li className="text-[#666666] text-[16px] font-normal leading-[24px] font-inter">
                    • &nbsp; Representative-specific legislative updates on their detail pages
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----six---- */}
      <section className="bg-[#e7eeff] mt-[40px] lg:mt-[80px]">
        <div
          id="container"
          className="px-[20px] lg:px-[120px] mx-auto w-[1440px] max-w-full"
        >
          <div className="mt-[32px] flex flex-col items-center gap-[88px] self-stretch w-full md:flex-row-reverse">
            <div className="w-full lg:w-[50%]">
              <Image src={WhoAreWe} alt="WhoAreWe" className="w-full h-full" />
            </div>
            <div className="w-full lg:w-[50%] flex items-center flex-col gap-[32px]">
              <div className="flex-col justify-center items-start gap-1.5 inline-flex">
                <h3 className="text-[#202020] text-[32px] font-bold leading-[48px] font-libre">
                  Who are we?
                </h3>
                <p className="text-[#424242] text-base font-normal leading-normal font-inter">
                  Civic Info Viewer is your go-to platform for discovering and
                  understanding the civic landscape around you. We provide
                  localized, accurate, and comprehensive information about
                  representatives, legislation, and events, empowering you to
                  stay informed and engaged. With user-friendly design and
                  AI-powered insights, we make complex information accessible,
                  helping you connect with your community and government
                  effortlessly.
                </p>
                <p className="text-[#424242] text-base font-normal leading-normal mt-[12px] font-inter">
                  Our mission is to educate, inform, and empower every citizen
                  by making civic engagement simple, accessible, and impactful.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* </div>
      </section> */}
    </>
  );
}
