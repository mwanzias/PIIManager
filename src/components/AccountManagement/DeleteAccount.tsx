import React, { useState } from "react";
import { accountManagementProps } from "../../Interfaces/PseudoInterfaces";
import { Field } from "@fluentui/react-field";
import {
  Label,
  PrimaryButton,
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,
} from "@fluentui/react";
import { Input } from "@fluentui/react-input";
import { useNavigate } from "react-router";
import AccountDeletedMessage from "./AccountDeletedMessage";
import { useAuth } from "../../context/AuthContext";
import API_CONFIG from "../../config/api";

const DeleteAccount: React.FC<accountManagementProps> = ({
  idnumber,
  emailAddress,
  phoneNumber,
}) => {
  const [accountMatch, setAccountMatch] = useState<boolean>(false);
  const [accountemail, setAccountEmail] = useState<string>("");
  const [accountphone, setAccountPhone] = useState<number>(0);
  const [verifiedOTP, setVerifiedOTP] = useState<boolean>(false);
  const [otpDestination, setOtpDestination] = useState<string>("email");
  const [accountDeleted, setAccountDeleted] = useState<boolean>(false);
  const [feedbackReceived, setFeedbackReceived] = useState<boolean>(false);
  const [feedbackCancelled, setFeedbackCanceled] = useState<boolean>(false);
  const [pseudoCode, setPseudoCode] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleDeleteAccount = async () => {
    if (accountMatch === true && verifiedOTP === true) {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.confirmAccountDeletion}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
            body: JSON.stringify({
              otp: otp,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to delete account");
        }

        setAccountDeleted(true);
        setSuccessMessage("Account deletion initiated successfully");

        // Sign out the user after successful deletion
        setTimeout(() => {
          signOut();
          navigate("/");
        }, 5000);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while deleting account"
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleOTP = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.requestAccountDeletion}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            phone_number_verify: otpDestination === "phone",
            pseudo_code: pseudoCode,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Failed to request account deletion"
        );
      }

      const data = await response.json();
      setSuccessMessage(data.message);
      setVerifiedOTP(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while requesting account deletion"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (accountemail === emailAddress && accountphone === phoneNumber) {
      setAccountMatch(true);
      setError(null);
    } else {
      setError("Account details do not match.");
    }
  };

  const handleExitFeedback = () => {
    // save the feedback for further sentimental analysis
    setFeedbackReceived(true);
  };

  const handleExitFeedbackCancelled = () => {
    // save the feedback for further sentimental analysis
    setFeedbackCanceled(true);
  };
  return (
    <div>
      <h2>Account Deletion</h2>
      {feedbackCancelled || feedbackReceived ? (
        <div>
          <AccountDeletedMessage />
        </div>
      ) : null}
      {!accountMatch ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "16px",
          }}
        >
          <div>
            <label
              htmlFor="emailInput"
              style={{ display: "block", marginBottom: "4px" }}
            >
              Email Address
            </label>
            <input
              id="emailInput"
              type="text"
              placeholder="Enter your email"
              value={accountemail}
              onChange={(e) => setAccountEmail(e.target.value)}
              style={{ width: "300px", padding: "8px" }}
            />
          </div>

          <div>
            <label
              htmlFor="phoneInput"
              style={{ display: "block", marginBottom: "4px" }}
            >
              Phone Number
            </label>
            <input
              id="phoneInput"
              type="text"
              placeholder="Enter your phone number"
              value={accountphone}
              onChange={(e) => setAccountPhone(Number(e.target.value))}
              style={{ width: "300px", padding: "8px" }}
            />
          </div>

          <div>
            <label>Preferred Contact Method:</label>
            <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
              <div>
                <input
                  type="radio"
                  id="email"
                  name="contactMethod"
                  value="email"
                  checked={otpDestination === "email"}
                  onChange={() => setOtpDestination("email")}
                />
                <label htmlFor="email">Email</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="phone"
                  name="contactMethod"
                  value="phone"
                  checked={otpDestination === "phone"}
                  onChange={() => setOtpDestination("phone")}
                />
                <label htmlFor="phone">Phone</label>
              </div>
            </div>
          </div>

          <button onClick={handleNext} style={{ marginTop: "16px" }}>
            Next
          </button>
        </div>
      ) : (
        <div>
          <p>
            Account details match. Please verify OTP send to your email/phone as
            per selection.
          </p>
          <div>
            {!verifiedOTP ? (
              <div
                style={{
                  maxWidth: 400,
                  borderRadius: 8,
                  boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                  backgroundColor: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "16px",
                  padding: "16px",
                }}
              >
                {error && (
                  <MessageBar
                    messageBarType={MessageBarType.error}
                    isMultiline={false}
                    dismissButtonAriaLabel="Close"
                    style={{ width: "100%" }}
                  >
                    {error}
                  </MessageBar>
                )}

                {successMessage && (
                  <MessageBar
                    messageBarType={MessageBarType.success}
                    isMultiline={false}
                    dismissButtonAriaLabel="Close"
                    style={{ width: "100%" }}
                  >
                    {successMessage}
                  </MessageBar>
                )}

                <Field label={<Label>Enter your Pseudo Code</Label>}>
                  <Input
                    placeholder="Pseudo Code"
                    type="text"
                    value={pseudoCode}
                    onChange={(e) => setPseudoCode(e.target.value)}
                  />
                </Field>

                <Field label={<Label>Enter the OTP sent to you</Label>}>
                  <Input
                    placeholder="OTP"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={!verifiedOTP}
                  />
                </Field>

                <div style={{ marginTop: 20 }}>
                  {isLoading ? (
                    <Spinner size={SpinnerSize.medium} label="Processing..." />
                  ) : (
                    <PrimaryButton onClick={handleOTP} disabled={!pseudoCode}>
                      Request OTP
                    </PrimaryButton>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <p>
                  Enter the OTP sent to your{" "}
                  {otpDestination === "email" ? "email" : "phone"} to confirm
                  account deletion.
                </p>

                {error && (
                  <MessageBar
                    messageBarType={MessageBarType.error}
                    isMultiline={false}
                    dismissButtonAriaLabel="Close"
                    style={{ marginBottom: "16px", width: "100%" }}
                  >
                    {error}
                  </MessageBar>
                )}

                {successMessage && (
                  <MessageBar
                    messageBarType={MessageBarType.success}
                    isMultiline={false}
                    dismissButtonAriaLabel="Close"
                    style={{ marginBottom: "16px", width: "100%" }}
                  >
                    {successMessage}
                  </MessageBar>
                )}

                <Field label={<Label>Enter the OTP sent to you</Label>}>
                  <Input
                    placeholder="OTP"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </Field>

                {!accountDeleted ? (
                  <div style={{ marginTop: 20 }}>
                    {isLoading ? (
                      <Spinner
                        size={SpinnerSize.medium}
                        label="Processing..."
                      />
                    ) : (
                      <PrimaryButton
                        onClick={handleDeleteAccount}
                        disabled={!otp}
                      >
                        Delete Account
                      </PrimaryButton>
                    )}
                  </div>
                ) : (
                  <div>
                    <p>Your account has been deleted successfully.</p>
                    <p>
                      We are unhappy to see you go. Would you educate us more on
                      why your departure?
                    </p>
                    <textarea
                      placeholder="Your feedback"
                      style={{
                        width: "100%",
                        height: "100px",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                      rows={4}
                      cols={50}
                      maxLength={200}
                      onChange={(e) => console.log(e.target.value)}
                    />
                    <div style={{ marginTop: 20 }}>
                      <PrimaryButton onClick={handleExitFeedback}>
                        Submit Feedback
                      </PrimaryButton>
                      <PrimaryButton onClick={handleExitFeedbackCancelled}>
                        Cancel
                      </PrimaryButton>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
