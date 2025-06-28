// "use client";
// import React, {
//   useState,
//   useLayoutEffect,
//   useRef,
//   useContext,
//   forwardRef,
//   useEffect,
// } from "react";
// import { Flex, Select, Button, Modal, Form, Input } from "antd";
// import AwnserBox from "../components/AnswerBox";
// import CreateModal from "./CreateModal";
// import { GlobalContext } from "../context/store";
// import Cookies from "js-cookie";
// import { ClipLoader } from "react-spinners";
// import {
//   addBio,
//   addSocialLink,
//   deleteSocialLink,
//   EditSocialLink,
// } from "@/api";

// import "../styles/tabs.css";

// import SelectDrop from "../../../public/images/select-drop.svg";
// import EditIcon from "../../../public/images/edit.svg";
// import DeleteIcon from "../../../public/images/delete-icon.svg";
// import FormIcon from "../../../public/images/form-icon..svg";
// import BoxIcon from "../../../public/images/box.svg";
// import RequestBox from "./RequestBox";
// import Activity from "./Activity";

// export default function CompanyTabsContent ()
//     {
//     const { ref2, ref3 } = combinedRef || {};
//     const { Option } = Select;

//     const [platformName, setPlatformName] = useState("");
//     const [socialLink, setSocialLink] = useState("");
//     const [saveLinkLoading, setSaveLinkLoading] = useState(false);
//     const [isEditMode, setIsEditMode] = useState(false);
//     const [aboutText, setAboutText] = useState<any>(profileData?.bio || "");
//     const [editAbout, setEditAbout] = useState<boolean>(false);
//     const textareaRef = useRef<HTMLTextAreaElement>(null);
//     const [loading, setLoading] = useState(true);
//     const [faqId, setFaqId] = useState<number | null>(null);
//     const [answerBoxes4, setAnswerBoxes4] = useState([]);
//     const [isBioSaved, setIsBioSaved] = useState(false);
//     const [filteredHighlights, setFilteredHighlights] = useState(highlights);
//     const [selectedFilter, setSelectedFilter] = useState("popular");
//     const [filteredcategoryFaqs, setFilteredcategoryFaqs] =
//       useState(answerBoxes);
//     const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("new");
//     const [filteredRequestedFaqs, setFilteredRequestedFaqs] =
//       useState(requests);
//     const [selectedRequestedFilter, setSelectedRequestedFilter] =
//       useState("new");
//       const [filteredActivityFaqs, setFilteredActivityFaqs] = useState(activities);
//       const [selectedActivityFilter, setSelectedAcitivtyFilter] = useState("likes");

//     const [isHighlightEmpty, setIsHighlightEmpty] = useState<
//       boolean | undefined
//     >(undefined);
//     const [isCategoryDraftEmpty, setIsCategoryDraftEmpty] = useState<boolean>();
//     const [isActivityFaqsEmpty, setIsActivityFaqsEmpty] = useState<
//       boolean | undefined
//     >(undefined);
//     const [isRequestedFaqsEmpty, setIsRequestedFaqsEmpty] = useState<
//       boolean | undefined
//     >(undefined);


//     useLayoutEffect(() => {
//       if (editAbout) {
//         textareaRef.current?.focus();
//       }
//     }, [editAbout]);


//     useEffect(() => {}, [isCategoryDraftEmpty]);

//     const { handleResizeGlobal } = useContext(GlobalContext);
//     const handleSelect = (value: any) => {
//       handleResizeGlobal();
//     };

//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const handlePlatformChange = (value: string) => {
//       const capitalizedValue =
//         value?.charAt(0)?.toUpperCase() + value?.slice(1);
//       setPlatformName(capitalizedValue);
//     };

//     const [showHighlight, setHighlight] = useState(true);

//     const [isCreateOpen, setIsCreateOpen] = useState(false);
//     const handleCreate = () => {
//       setIsCreateOpen(true);
//       setHighlight(true);
//     };

//     const [form] = Form.useForm();

//     const handleHighlightSelect = (value: any) => {
//       setSelectedFilter(value);
//     };

//     const handleCategorySelect = (value: any) => {
//       setSelectedCategoryFilter(value);
//     };

//     const handleRequestSelect = (value: any) => {
//       setSelectedRequestedFilter(value);
//     };

    
//     useEffect(() => {
//       if (Array.isArray(activities)) {
//         if (selectedActivityFilter === "likes") {
         
//           const filteredLikes = activities.filter(
//             (activity) => activity.type === "user_like"
//           );
//           setFilteredActivityFaqs(filteredLikes);
//         } else if (selectedActivityFilter === "comments") {
         
//           const filteredComments = activities.filter(
//             (activity) => activity.type === "user_comment"
//           );
//           setFilteredActivityFaqs(filteredComments);
//         }
//       }
//     }, [selectedActivityFilter, activities]);
    

//     const handleActivitySelect = (value: any) => {
//       setSelectedAcitivtyFilter(value);
//     };
//     const renderSelect = () => {
//       if (type === "highlights" && name === "Highlights" && highlights?.length > 0) {
//         return (
//           <Select
//             onChange={handleHighlightSelect}
//             defaultValue="popular"
//             suffixIcon={<SelectDrop />}
//             placement="bottomLeft"
//             options={[
//               { value: "popular", label: "Popular" },
//               { value: "new", label: "Oldest" },
//               { value: "old", label: "Newest" },
//             ]}
//           />
//         );
//       }
    
//       if (type === "requests" && requests?.length > 0) {
//         return (
//           <Select
//             onChange={handleRequestSelect}
//             defaultValue="recent"
//             suffixIcon={<SelectDrop />}
//             placement="bottomLeft"
//             options={[
//               { value: "draft", label: "Drafts" },
//               { value: "recent", label: "Recent" },
//               { value: "new", label: "Old to new" },
//               { value: "old", label: "New to old" },
//             ]}
//           />
//         );
//       }
    
//       if (type === "activity" 
//         && activities?.length > 0
//       ) {
//         return (
//           <Select
//             onChange={handleActivitySelect}
//             defaultValue="likes"
//             suffixIcon={<SelectDrop />}
//             placement="bottomLeft"
//             options={[
//               { value: "likes", label: "Likes" },
//               { value: "comments", label: "Comments" },
//             ]}
//           />
//         );
//       }
    
//       if (type === "category" && answerBoxes?.length > 0) {
//         return (
//           <Select
//             onChange={handleCategorySelect}
//             defaultValue="new"
//             suffixIcon={<SelectDrop />}
//             placement="bottomLeft"
//             options={[
//               { value: "old", label: "Old to new" },
//               { value: "new", label: "New to old" },
//             ]}
//           />
//         );
//       }
    
//       return null;
//     };
    
  
    
//     return (
//       <>
      
      
//       <div className="company-tabs--content">
//         <Flex vertical gap={type !== "about" ? 20 : 12}>
//           {showHighlight ? (
//             <Flex justify="space-between" align="center">
//               <Flex gap={6} align="center">
//                 <h4 className="mb-0">{name}</h4>
//                 {type === "about" && ownProfile ? (
//                   <EditIcon
//                     className="pointer"
//                     onClick={handleEditAboutClick}
//                   />
//                 ) : (
//                   ""
//                 )}
//               </Flex>
//               <>{type !== "about" && renderSelect()}</>
              
//             </Flex>
//           ) : (
//             <div className="no-data-profile">
//               <BoxIcon />
//               <div>
//                 <h2>Add FAQ in highlight</h2>
//                 <p>Add frequently asked question in highlights.</p>
//               </div>
//               <Button onClick={handleCreate}>Create</Button>
//             </div>
//           )}
//           {/* Answer Boxes */}
//           {type === "highlights" && name === "Highlights" ? (
//             <Flex className="company-tabs--list" vertical gap={20}>
//               <AwnserBox
//                 highlights={filteredHighlights}
//                 ownProfile={ownProfile}
//                 activity={false}
//                 type={type}
//                 name={name}
//                 removeHighlight={removeHighlight}
//                 faqId={faqId}
//                 onHighlightStatusChange={handleHighlightStatus}
//                 answerBoxes={[]}
//                 automaticDraftsLoading={automaticDraftsLoading}
//                 handleLikeHighlightedFaqs={handleLikeHighlightedFaqs}
//               />
//             </Flex>
//           ) : null}

//           {type === "answers" && showHighlight ? (
//             <Flex className="company-tabs--list" vertical gap={20}>
//               <AwnserBox
//                 answerBoxes={ownProfile ? answerBoxes2 : answerBoxes}
//                 ownProfile={ownProfile}
//                 activity={name === "Activity"}
//                 name={name}
//               />
//             </Flex>
//           ) : null}

//           {/* Drafts - Show only if type is drafts */}
//           {type === "drafts" && (
//             <Flex className="company-tabs--list" vertical gap={20}>
//               <AwnserBox
//                 drafts={drafts}
//                 ownProfile={ownProfile}
//                 activity={false}
//                 type={type}
//                 name={name}
//                 removeDraft={removeDraft}
//                 answerBoxes={[]}
//                 isDraftssLoading={isDraftLoading}
//               />
//             </Flex>
//           )}

//           {/* Requests */}
//           {type == "requests" && (
//             <Flex className="company-tabs--list" vertical gap={20}>
//               <RequestBox
//                 ownProfile={ownProfile}
//                 activity={false}
//                 type={type}
//                 name={name}
//                 requests={filteredRequestedFaqs}
//                 onRequestedStatusChange={handleRequestStatus}
//                 isRequestLoading={isRequestLoading}
//               />
//             </Flex>
//           )}
//           {type == "activity" && (
//             <Flex className="company-tabs--list" vertical gap={20}>
//               <Activity
//                 activities={filteredActivityFaqs}
//                 ownProfile={ownProfile}
//                 activity={true}
//                 type={type}
//                 name={name}
//                 onActivityStatusChange={handleActivityStatus}
//                 isActivityLoading={isActivityLoading}
//               />
//             </Flex>
//           )}

//           {/* About Section */}
//           {type == "about" ? (
//             <Flex vertical className="about-section">
//               {ownProfile && editAbout ? (
//                 <>
//                   <textarea
//                     ref={textareaRef}
//                     className="aboutProfile"
//                     name="aboutProfile"
//                     placeholder="Your full name"
//                     cols={30}
//                     rows={8}
//                     value={aboutText}
//                     onChange={(e) => setAboutText(e.target.value)}
//                   />
//                   {aboutText && (
//                     <Button
//                       type="primary"
//                       style={{ width: "100px" }}
//                       onClick={handleSendBtnAboutClick}
//                     >
//                       {isBioSaved ? (
//                         <ClipLoader
//                           size={14}
//                           color="#fff"
//                           loading={isBioSaved}
//                         />
//                       ) : (
//                         "Save"
//                       )}
//                     </Button>
//                   )}
//                 </>
//               ) : (
//                 <div className="about-section--para" ref={ref2}>
//                   <p>{profileData?.bio}</p>
//                 </div>
//               )}
//               <div ref={ref3} className="about-section--social-media">
//                 <h4>Social Media</h4>
//                 <Flex gap={12} vertical className="about-section--links">
//                   {profileData?.social_links &&
//                     Object.entries(profileData?.social_links)?.map(
//                       ([platform, username]: any, index) => (
//                         <Flex
//                           key={index}
//                           gap={20}
//                           align="center"
//                           className="about-section--links--link"
//                         >
//                           <p className="font-md">{platform}</p>
//                           {username}
//                           {ownProfile && (
//                             <>
//                               <EditIcon
//                                 onClick={() =>
//                                   showLinksPopup(platform, username)
//                                 }
//                                 style={{ cursor: "pointer" }}
//                               />
//                               <DeleteIcon
//                                 style={{ cursor: "pointer" }}
//                                 height="10"
//                                 width="10"
//                                 onClick={() => {
//                                   handleDelete(platform);
//                                 }}
//                               />
//                             </>
//                           )}
//                         </Flex>
//                       )
//                     )}
//                   {ownProfile && (
//                     <Button
//                       onClick={showLinksPopupAdd}
//                       type="text"
//                       className="add-social-media"
//                     >
//                       + Add
//                     </Button>
//                   )}
//                 </Flex>
//               </div>
//             </Flex>
//           ) : null}
//           <Modal
//             title=""
//             centered
//             className="save-draft update"
//             open={isModalOpen}
//             onOk={handleOk}
//             onCancel={() => setIsModalOpen(false)}
//             footer={null}
//           >
//             <Flex gap={8} align="center">
//               <h3>{isEditMode ? "Update Social Media" : "Add social media"}</h3>
//             </Flex>
//             <Form
//               name="updateLinks"
//               onFinish={handleOk}
//               onFinishFailed={onFinishFailed}
//               autoComplete="off"
//               form={form}
//             >
//               <div className="relative">
//                 <Form.Item
//                   name="platform"
//                   rules={[
//                     { required: true, message: "Please select your platform!" },
//                   ]}
//                 >
//                   <Select
//                     style={{
//                       border: "1px solid #d9d9d9",
//                       borderRadius: "5px",
//                       fontSize: "15px",
//                       paddingLeft: "8px",
//                       backgroundColor: "#f5f5f5",
//                     }}
//                     placeholder="Select a platform"
//                     onChange={handlePlatformChange}
//                   >
//                     {["Linkedin", "Instagram", "Facebook", "Twitter", "Github"]
//                       ?.filter(
//                         (platform) =>
//                           !profileData?.social_links ||
//                           !Object.keys(profileData.social_links)?.includes(
//                             platform
//                           )
//                       )
//                       ?.map((platform, index) => (
//                         <Option key={index} value={platform}>
//                           {platform?.charAt(0)?.toUpperCase() +
//                             platform?.slice(1)}
//                         </Option>
//                       ))}
//                   </Select>
//                 </Form.Item>
//               </div>
//               <Form.Item
//                 name="username"
//                 rules={[
//                   {
//                     required: true,
//                     message: "Please enter your username!",
//                   },
//                 ]}
//                 hasFeedback
//               >
//                 <Input
//                   placeholder="Enter your username"
//                   value={socialLink}
//                   onChange={(e) => setSocialLink(e.target.value)}
                  
//                 />
//               </Form.Item>
//               <Flex gap={8} align="center" justify="center">
//                 <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
//                 <Button
//                   htmlType="submit"
//                   type="primary"
//                   disabled={saveLinkLoading}
//                   loading={saveLinkLoading}
//                 >
//                   {isEditMode ? "Update" : "Add "}
//                 </Button>
//               </Flex>
//             </Form>
//           </Modal>

          
//           {type === "category" && (
//             <Flex className="company-tabs--list" vertical gap={20}>
              
//                 <AwnserBox
//                   ownProfile={ownProfile}
//                   activity={false}
//                   faqId={faqId}
//                   name={name}
//                   answerBoxes={filteredcategoryFaqs}
//                   onDeleteFaq={handleDeleteFaq} 
//                   catLoading={catLoading}
//                   handleLikeCategoryFaq={handleLikeCategoryFaq}
//                 />
              
//             </Flex>
//           )}
//         </Flex>

//         <CreateModal
//           setIsModalOpen={setIsCreateOpen}
//           isModalOpen={isCreateOpen}
//         />
//       </div>
//       </>
//     );
//   }
