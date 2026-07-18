"use client";
import { useState, useEffect } from "react"; // removed useLayoutEffect
import { Flex, Button, Modal, Form, Input } from "antd";
import OtpInput from "react-otp-input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signUpUser, verifyUser, resedOtp } from "../services/api";
import "../styles/signin.css";
import Logo from "../../../public/images/logo.svg";
import UserIcon from "../../../public/images/user.svg";
import Email from "../../../public/images/set-email.svg";
import SuccessGif from "../../../public/images/success.gif";

interface CustomModalProps {
  isModalOpen?: boolean;
  setIsModalOpen?: any;
  showLoginModal?: any;
}

const RESEND_COOLDOWN = 30; // seconds — single source of truth

const SignInModal: React.FC<CustomModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  showLoginModal,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formLevel, setFormLevel] = useState(0);
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState<any>(false);
  const [disable, setDisable] = useState(true);
  const [error, setError] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");
  const router = useRouter();
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [showResendMessage, setShowResendMessage] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");

  const [form] = Form.useForm();

  // True whenever any API call in this modal is in flight.
  // Used to block the user from closing the modal mid-request.
  const isBusy = loading || otpLoading;

  const handleCancel = () => {
    if (isBusy) return;
    setIsModalOpen(false);
    setEnteredOtp("");
    setError(false);
    setTimeout(() => {
      document.body.classList.remove("modal-opened");
    }, 300);
    setFormLevel(0);
    setErrorMessage("");
    setCountdown(RESEND_COOLDOWN);
    setIsResendDisabled(true);
    setIsModalOpen(false);
  };

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const signUpData = {
        fullName: values.name,
        username: values.username,
        email: values.mail,
        password: values.password,
      };
      const response = await signUpUser(signUpData);

      setLoading(false);
      setEmailForOtp(values.mail);
      setFormLevel(1);
    } catch (error: any) {
      setLoading(false);
      setErrorMessage(error.message || "Failed to register");
    }
  };

  const onOtpVerify = async () => {
    try {
      setOtpLoading(true);
      const payload = {
        email: form.getFieldValue("mail"),
        otp: String(enteredOtp),
      };
      const response = await verifyUser(payload);

      setOtpLoading(false);
      window.location.href = "/lekhan/home";
    } catch (error: any) {
      setOtpLoading(false);
      setError(true);
      setErrorMessage(error.message || "OTP verification failed");
    }
  };

  useEffect(() => {
    setDisable(enteredOtp.length !== 6);
  }, [enteredOtp]);

  const onResendOtp = async () => {
    if (isResendDisabled) return;
    try {
      setOtpLoading(true);
      const payload = {
        email: form.getFieldValue("mail"),
      };
      const response = await resedOtp(payload);

      setOtpLoading(false);
      setShowResendMessage(true);
      setCountdown(RESEND_COOLDOWN);
      setIsResendDisabled(true);

      setTimeout(() => setShowResendMessage(false), 3000);
    } catch (error: any) {
      setOtpLoading(false);
      setErrorMessage(error.message || "Failed to resend OTP");
    }
  };

  // Single clean interval, starts when entering OTP screen or after a resend
  useEffect(() => {
    if (formLevel !== 1) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [formLevel, isResendDisabled]); // reruns when a resend restarts the cooldown

  return (
    isModalOpen && (
      <Modal
        title=""
        centered
        className={
          (formLevel === 2 ? "sign-in-modal success" : "sign-in-modal") +
          " w-screen! h-screen! m-0! p-0! rounded-none! sm:w-auto! sm:h-auto! sm:m-4! sm:p-6! sm:rounded-lg!"
        }
        style={{ top: 0 }}
        styles={{ body: { height: "100%", overflowY: "auto", padding: "1rem" } }}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        closable={!isBusy}
        maskClosable={!isBusy}
        keyboard={!isBusy}
      >
        {formLevel === 0 ? (
          <Flex className="sign-in-modal--feilds" vertical>
            <div className="sign-in-modal--header">
              <h2>Signup to get started</h2>
            </div>
            <Form name="signin" form={form} onFinish={onFinish}>
              <Form.Item
                name="name"
                rules={[
                  { required: true, message: "Please enter your name!" },
                  { min: 3, message: "Name must be at least 3 characters long!" },
                  { pattern: /^[A-Za-z\s]+$/, message: "Name can only contain letters and spaces!" },
                ]}
              >
                <Input placeholder="Your name" prefix={<UserIcon />} />
              </Form.Item>
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please enter your username!" },
                  { min: 3, message: "Username must be at least 3 characters long!" },
                  { pattern: /^[^\s]+$/, message: "Username cannot contain spaces!" },
                ]}
              >
                <Input placeholder="Enter username" prefix={<UserIcon />} />
              </Form.Item>
              <Form.Item
                name="mail"
                rules={[
                  { required: true, message: "Please enter your email!" },
                  { type: "email", message: "The input is not a valid email!" },
                ]}
              >
                <Input type="email" placeholder="Enter your email" prefix={<Email />} />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Please enter your password!" }]}
              >
                <Input.Password placeholder="Enter your password" prefix={<Email />} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Get OTP
                </Button>
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
              </Form.Item>
            </Form>
            <p>
              Already have an account? <span onClick={showLoginModal}>Login</span>
            </p>
          </Flex>
        ) : formLevel === 1 ? (
          <Flex className="sign-in-modal--feilds" vertical>
            <div className="sign-in-modal--header">
              <h2>Enter OTP</h2>
              <p>
                OTP sent on <a href={`/`}>{emailForOtp}</a>
              </p>
            </div>
            <Form name="basic" autoComplete="off">
              <div className={error ? "error otp" : "otp"}>
                <OtpInput
                  value={enteredOtp}
                  onChange={setEnteredOtp}
                  numInputs={6}
                  inputType="tel"
                  placeholder="______"
                  shouldAutoFocus={true}
                  renderInput={(props) => <input {...props} />}
                />
                {error ? <p className="ant-form-item-explain-error">OTP is Incorrect!</p> : ""}
              </div>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={otpLoading}
                  disabled={disable}
                  onClick={onOtpVerify}
                >
                  Verify
                </Button>
              </Form.Item>
            </Form>
            {showResendMessage ? (
              <p style={{ textAlign: "center", color: "#0969da" }}> OTP Sent Successfully</p>
            ) : (
              ""
            )}
            <p>
              Did not receive an OTP?{" "}
              {countdown > 0 ? (
                <span>
                  <span style={{ color: "#b3a5a5", cursor: "not-allowed" }}>Resend OTP</span>{" "}
                  <span style={{ cursor: "text" }}>in {countdown} seconds</span>
                </span>
              ) : (
                <span
                  onClick={onResendOtp}
                  style={{
                    cursor: isResendDisabled ? "not-allowed" : "pointer",
                    color: isResendDisabled ? "#b3a5a5" : "#0969DA",
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
            <p className="success-text">Your account has been successfully created</p>
          </>
        )}
      </Modal>
    )
  );
};

export default SignInModal;