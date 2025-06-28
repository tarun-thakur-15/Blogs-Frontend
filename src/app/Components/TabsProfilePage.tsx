"use client"
import React, {
  useState,
  useLayoutEffect,
  useRef,
  useContext,
  forwardRef,
  useEffect,
} from "react";
import { Flex, Select, Button, Modal, Form, Input } from "antd";
import BlogForProfilePage from "../Components/BlogForProfilePage";
import { GlobalContext } from "../context/store";
import Cookies from "js-cookie";

// CSS
import "../styles/tabs.css";
// IMAGES
import SelectDrop from "../../../public/images/select-drop.svg";
import EditIcon from "../../../public/images/edit.svg";
import DeleteIcon from "../../../public/images/delete-icon.svg";
import FormIcon from "../../../public/images/form-icon..svg";
import BoxIcon from "../../../public/images/box.svg";

interface CompanyTabsContentProps {
    type: string;
    name: string;
  }

 export default function TabsProfilePage ( {type, name}: CompanyTabsContentProps  )
  {
    const [aboutText, setAboutText] = useState("");
    const [editAbout, setEditAbout] = useState<boolean>(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

   
    const handleEditAboutClick = async () => {
      setAboutText("");
      setEditAbout(!editAbout);
    };

    useLayoutEffect(() => {
      if (editAbout) {
        textareaRef.current?.focus();
      }
    }, [editAbout]);

    const { handleResizeGlobal } = useContext(GlobalContext);
    const handleSelect = (value: any) => {
      handleResizeGlobal();
    };

    const [isModalOpen, setIsModalOpen] = useState(false);



    const [showHighlight, setHighlight] = useState(true);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const handleCreate = () => {
      setIsCreateOpen(true);
      setHighlight(true);
    };
    const [form] = Form.useForm();

  
    
    return (
      <div className="company-tabs--content">
        <Flex vertical gap={20}>
          

             
          {/* Answer Boxes */}
          {type === "highlights" && name === "Highlights" ? (
            <Flex className="company-tabs--list" vertical gap={20}>
             <BlogForProfilePage/>
            </Flex>
          ) : null}

          {/* About Section */}
          {type == "about" ? (
            <Flex vertical className="about-section">
              { editAbout ? (
                <>
                  <textarea
                    ref={textareaRef}
                    className="aboutProfile"
                    name="aboutProfile"
                    placeholder="Your full name"
                    cols={30}
                    rows={8}
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                  />
                  {aboutText && (
                    <Button
                      type="primary"
                      style={{ width: "100px" }}
                      
                    >
                      Save
                    </Button>
                  )}
                </>
              ) : (
                <div className="about-section--para" >
                  <p>about content</p>
                </div>
              )}
            </Flex>
          ) : null}
        </Flex>
      </div>
    )
  };
