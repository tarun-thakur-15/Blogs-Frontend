"use client";
import { useState, useLayoutEffect, useEffect } from "react";
import Cookies from "js-cookie";
import { Flex, Button, Modal, Form, Input } from "antd";
import OtpInput from "react-otp-input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginUser } from "../services/api";
// CSS
import "../styles/signin.css";
// IMAGES
import Email from "../../../public/images/set-email.svg";
import SuccessGif from "../../../public/images/success.gif";
interface CustomModalProps {
  isModalOpen?: boolean;
  setIsModalOpen?: any;
  showSignModal?: any;
}

const identifierRules = [
  {
    required: true,
    message: "Please enter your email or username!",
  },
  {
    validator: (_, value: any) => {
      if (!value) {
        return Promise.resolve();
      }
      // Regular expression for email validation.
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // A simple regex for username validation: at least 3 alphanumeric characters (adjust as needed).
      const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;

      if (emailRegex.test(value) || usernameRegex.test(value)) {
        return Promise.resolve();
      }
      return Promise.reject("Please enter a valid email or username!");
    },
  },
];
const LogInModal: React.FC<CustomModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  showSignModal,
}) => {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const [receivedOtp, setReceivedOtp] = useState<string>("");
  const [formLevel, setFormLevel] = useState(0);
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [error, setError] = useState(false);
  const [otp, setOtp] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [otpLoading, setotpLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [showResendMessage, setShowResendMessage] = useState(false);

  useLayoutEffect(() => {
    if (otp.length === 6) {
      setDisable(false);
      setError(false);
    } else {
      setDisable(true);
    }
  }, [otp]);
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFormLevel(formLevel + 1);
    }, 3000);
  };

  const handleCancel = () => {
    setOtp("");
    setTimeout(() => {
      document.body.classList.remove("modal-opened");
    }, 300);
    setFormLevel(0);
    setError(false);
    setErrorMessage("");
    form.resetFields();
    setCountdown(5);
    setIsResendDisabled(true);
    setIsModalOpen(false);
  };
  // Login form submission handler
  const handleLogin = async (values: any) => {
    try {
      setSaveLoading(true);
      // Create payload matching the Login interface
      const payload = {
        identifier: values.identifier,
        password: values.password,
      };
      const response = await loginUser(payload);
      console.log("Login response:", response);
      // Store returned values in cookies
      Cookies.set("accessToken", response.accessToken);
      Cookies.set("email", response.email);
      Cookies.set("username", response.username);
      Cookies.set("fullname", response.fullname);
      Cookies.set("profileImage", response.profileImage);
      setSaveLoading(false);
      window.location.reload();
      // Redirect after successful login (e.g., to dashboard)
    } catch (error: any) {
      setSaveLoading(false);
      setErrorMessage(error.message || "Login failed");
    }
  };
  return (
    <>
      <Modal
        title=""
        centered
        className={
          /* your existing sign-in-modal + login/success */
          formLevel === 2
            ? "sign-in-modal success"
            : "sign-in-modal login" +
              /* make full-screen on mobile, restore at sm+ */
              " !w-screen !h-screen !m-0 !p-0 !rounded-none" +
              " sm:!w-auto sm:!h-auto sm:!m-4 sm:!p-6 sm:!rounded-lg"
        }
        style={{ top: 0 }}
        styles={{ body: { height: "100%", overflowY: "auto", padding: "1rem" } }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >

        {formLevel === 0 ? (
          <Flex className="sign-in-modal--feilds" vertical>
            <div className="sign-in-modal--header">
              <h2>Log in to your Account</h2>
            </div>
            <Form
              form={form}
              name="login"
              onFinish={handleLogin}
              autoComplete="on"
            >
              <Form.Item name="identifier" rules={identifierRules} hasFeedback>
                <Input
                  placeholder="Enter your email or username"
                  prefix={
                    // You can combine icons if desired or choose one.
                    <>
                      {/* <MailOutlined style={{ marginRight: 8 }} /> */}
                      {/* <UserOutlined /> */}
                    </>
                  }
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please enter your password!" },
                  // Optionally add more rules here (e.g., min length, regex, etc.)
                ]}
              >
                <Input.Password
                  placeholder="Enter your password"
                  prefix={
                    // You can combine icons if desired or choose one.
                    <>
                      {/* <MailOutlined style={{ marginRight: 8 }} /> */}
                      {/* <UserOutlined /> */}
                    </>
                  }
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={saveLoading}>
                  Login
                </Button>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
              </Form.Item>
            </Form>
            <p>
              Don't have an account?{" "}
              <span onClick={showSignModal}>Sign up</span>
            </p>
          </Flex>
        ) : formLevel === 1 ? (
          <Flex className="sign-in-modal--feilds" vertical>
            <div className="sign-in-modal--header">
              <h2>Enter OTP</h2>
              <p>
                OTP sent on <a href={`/`}>johndoe@gmail.com</a>
              </p>
            </div>
            <Form
              name="validateOtp"
              //   onFinish={onFinishValidation}
              //   onFinishFailed={onFinishFailedValidation}
              autoComplete="off"
            >
              <div className={error ? "error otp" : "otp"}>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  inputType="tel"
                  placeholder="______"
                  shouldAutoFocus={true}
                  renderInput={(props) => <input {...props} />}
                />
                {error && (
                  <p className="ant-form-item-explain-error">{errorMessage}</p>
                )}
              </div>
              <Form.Item>
                <Button
                  disabled={disable}
                  type="primary"
                  htmlType="submit"
                  loading={otpLoading}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
            {showResendMessage ? (
              <p style={{ textAlign: "center", color: "#0969DA" }}>
                OTP Sent Successfully
              </p>
            ) : (
              ""
            )}
            <p>
              Did not receive an OTP?{" "}
              {formLevel === 1 && countdown > 0 ? (
                <span>
                  <span style={{ color: "#B3A5A5", cursor: "not-allowed" }}>
                    Resend OTP
                  </span>{" "}
                  <span style={{ cursor: "text" }}>in {countdown} seconds</span>
                </span>
              ) : (
                <span
                  style={{
                    cursor: isResendDisabled ? "not-allowed" : "pointer",
                  }}
                >
                  Resend
                </span>
              )}
            </p>
          </Flex>
        ) : (
          <>
            <Image className="success-gif" src={SuccessGif} alt="success" />
            <p className="success-text">
              Logged in to your account successfully
            </p>
          </>
        )}
      </Modal>
    </>
  );
};
export default LogInModal;
