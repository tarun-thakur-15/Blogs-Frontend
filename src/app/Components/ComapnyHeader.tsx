// "use client";
// import { FC, useState, useLayoutEffect, useContext, forwardRef, useEffect } from "react";
// import Image from "next/image";
// import { Flex, Button, Select, Modal, Input } from "antd";
// import CreateModal from "./CreateModal";

// import Verified from "../../../public/images/verified.svg";
// import Sony from "../../../public/images/sony-trending.png";
// import Search from '../../../public/images/search.svg';
// import { getLoggedInUserSubscriberList, removeFollowerofLoggedinuser, uploadProfileImage } from "@/api";
// import Cookies from "js-cookie";
// import bydefaultUser from "../../../public/images/profile-default.png";
// import { useProfile } from "./context/ProfileContext";
// import UserNotFound from "../../../public/images/avatar2.png";
// import { useRouter } from "next/navigation";
// interface CommentsProps {
//   ownProfile?: boolean;
//   profileData?:any
//   setProfileDetails?: React.Dispatch<React.SetStateAction<any>>;
// }

// const CompanyHeader = forwardRef<HTMLDivElement, CommentsProps>(({setProfileDetails, ownProfile,profileData }, ref) => {
//   const [profileUploaded, setProfileUploaded] = useState(false);
//   const [uploadedImageUrl, setUploadedImageUrl] = useState<any>(null); 
//   const [subscriberList, setSubscriberList] = useState<any>([]);
//   const { setProfileImageUrl } = useProfile();
//   const router = useRouter();
//   const [searchQuery, setSearchQuery] = useState(""); 
//   const filteredSubscribers = subscriberList?.data?.filter((follower: any) =>
//     follower?.subscriber_full_name
//       ?.toLowerCase()
//       .includes(searchQuery.toLowerCase())
//   );
// useEffect(()=>{
//   const getSubscriberListAPI = async () => {
//     try {
  
//       const data = await getLoggedInUserSubscriberList();
    
//       setSubscriberList(data);
//     } catch (error) {
//       console.error("Error fetching subscriber list:", error);
//     }
//   };

//   getSubscriberListAPI()
// },[])


// const handleUsernameClick = (username: string) => {
//   router.push(`/user/${encodeURIComponent(username)}`);
// };

// const handleInputProfile = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   const file = e.target.files?.[0];
//   if (!file) return;

//   const formData = new FormData();
//   formData.append("profile_image", file);
//   const token = Cookies.get("accessToken");

//   try {
//     const response = await uploadProfileImage(formData, token);
//     if (response.data.status_code === 200) {
    
//       const imageUrl = URL.createObjectURL(file);
//       setUploadedImageUrl(imageUrl); 
//       setProfileImageUrl(imageUrl);
//       setProfileUploaded(true); 
//     } else {
//       console.error("Error updating profile image");
//     } 
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

//   const [isCreateOpen, setIsCreateOpen] = useState(false);
//   const [userLogedIn, setUserLogedIn] = useState("false");
//   useLayoutEffect(() => {
//     const userLogedIn2 = localStorage.getItem("userLogedIn");
//     setUserLogedIn(userLogedIn2 ? userLogedIn2 : "");
//   }, []);

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const showModal = () => {
//     setIsModalOpen(true);
//   };
//   const handleCancel = () => {
//     setIsModalOpen(false);
//   };

//   const handleRemoveFollower = async (username: any) => {
//     const token = Cookies.get('accessToken') || '';
//     try {
//       await removeFollowerofLoggedinuser(username, token);

//       const updatedList = subscriberList?.data?.filter(
//         (follower: any) => follower?.subscriber_userName !== username
//       );
//       setSubscriberList({ ...subscriberList, data: updatedList });
  
//       if (setProfileDetails) {
//         setProfileDetails((prevDetails: any) => ({
//           ...prevDetails,
//           subscriber_count: prevDetails.subscriber_count - 1,
//         }));
//       }
//     } catch (error) {
//       console.error("Error removing follower:", error);
//     }
//   };

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchQuery(e.target.value);
//   };
  

//   return (
//     <>
//       <Flex
//         align="center"
//         wrap="wrap"
//         className="company-header"
//         gap={20}
//         justify="space-between"
//       >
//         <Flex align="center">
//           {ownProfile ? (
//             <div className="wrapper">
//               <div className="file-upload" ref={ref}>
//                 <input
//                   onChange={handleInputProfile}
//                   className="profile-pic"
//                   type="file"
//                 />
//               <Image
//                 src={
//                   profileUploaded && uploadedImageUrl 
//                     ? uploadedImageUrl 
//                     : profileData?.profile_image_url 
//                     ? profileData.profile_image_url 
//                     : UserNotFound
//                 }
//                 alt="Profile Image"
//                 width={55}
//                 height={55}
//                 onClick={() => handleUsernameClick(profileData.userName)}
//               />
//               </div>
//             </div>
//           ) : (
//             <div className="company-header-img">
//               <Image src={Sony} alt="sony" />
//             </div>
//           )}
//           <Flex gap={5} vertical className="company-header-info">
//             <Flex align="center" gap={8}>
//               <h3 className="company-header-name" style={{cursor:"pointer"}}  onClick={() => handleUsernameClick(profileData.userName)}>
//                 {profileData?.name}
//               </h3>
        
//             </Flex>
//             <Flex align="center" gap={8} className="company-header-details">
//               <p className="dark" style={{cursor:"pointer"}}  onClick={() => handleUsernameClick(profileData.userName)}>
//                 @{profileData?.userName}
//               </p>
//               <p className="dark">•</p>
//               <p onClick={showModal}>
//                 <span className="dark">{profileData?.subscriber_count}</span> Subscribers
//               </p>
//               <p className="dark">•</p>
//               <p>
//                 <span className="dark">{profileData?.qna_count}</span> QnAs
//               </p>
//             </Flex>
//           </Flex>
//         </Flex>
//         <CreateModal
//           askingQuestion={true}
//           setIsModalOpen={setIsCreateOpen}
//           isModalOpen={isCreateOpen}
//         />
//       </Flex>
//       <Modal
//         open={isModalOpen}
//         onCancel={handleCancel}
//         footer={null}
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           maxWidth: "100%",
//         }}
//         className="sampleModal"
//       >
//         <div className="followersModalParent" style={{ maxWidth: "100%" }}>
//           <div className="followersSpanParent" style={{ maxWidth: "100%" }}>
//             <span className="followersSpan">Subscribers</span>
//           </div>


//           <Input
//             className="home-search"
//             placeholder="Search"
//             prefix={<Search />}
//             value={searchQuery} 
//             onChange={handleSearch} 
//             style={{ maxWidth: "100%" }}
//           />


//           <div className="followersList" style={{ maxWidth: "100%" }}>
//            {filteredSubscribers?.length ? (
//       filteredSubscribers.map((follower: any) => (
//                 <div key={follower?.subscriber_userName} className="followerItem">
//                   <div>
//                     <div className="followerItemInner">
//                       <div className="followerIconContainer">
//                         <Image
//                          src={follower?.subscriber_profile_image_url || bydefaultUser}
//                           alt="follower"
//                           className="followerIcon"
//                           width={40}
//                           height={40}
//                         />
//                       </div>
//                       <div className="followerInfo">
//                         <span className="followerName">{follower?.subscriber_full_name}</span>
//                         <span className="followerUsername">@{follower?.subscriber_userName}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <button
//                     className="removeBtn"
//                     onClick={() =>
//                       handleRemoveFollower(follower?.subscriber_userName)
//                     }
//                   >Remove</button>
//                 </div>
//               ))
//             ) : (
//               <p>No Subscribers found.</p>
//             )}
//           </div>
//         </div>
//       </Modal>
//     </>
//   );
// });

// export default CompanyHeader;
