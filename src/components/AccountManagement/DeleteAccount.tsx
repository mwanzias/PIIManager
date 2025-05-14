import React from "react";
import { accountManagementProps } from "../../Interfaces/PseudoInterfaces";
import { Field } from "@fluentui/react-field";
import { Label, PrimaryButton } from "@fluentui/react";
import { Input } from "@fluentui/react-input";
import { useNavigate } from "react-router";
import AccountDeletedMessage from "./AccountDeletedMessage";

const DeleteAccount: React.FC<accountManagementProps> = ({
  idnumber,
  emailAddress,
  phoneNumber,
}) => {
  const [accountMatch, setAccountMatch] = React.useState<boolean>(false);
  const [accountemail, setAccountEmail] = React.useState<string>("");
  const [accountphone, setAccountPhone] = React.useState<number>(0);
  const [verifiedOTP, setVerifiedOTP] = React.useState<boolean>(false);
  const [otpDestination, setOtpDestination] = React.useState<string>("email");
  const [accountDeleted, setAccountDeleted] = React.useState<boolean>(false);
  const [feedbackReceived, setFeedbackReceived] =
    React.useState<boolean>(false);
  const [feedbackCancelled, setFeedbackCanceled] =
    React.useState<boolean>(false);

  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    if (accountMatch === true && verifiedOTP === true) {
      //proceed to post for deletion
      setAccountDeleted(true);
    }
  };

  const handleOTP = () => {
    // Simulate OTP verification
    setVerifiedOTP(true);
  };

  const handleNext = () => {
    if (accountemail === emailAddress && accountphone === phoneNumber) {
      setAccountMatch(true);
    } else {
      alert("Account details do not match.");
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
                }}
              >
                <Field label={<Label>Enter the OTP sent to you</Label>}>
                  <Input placeholder="OTP" type="text" />
                </Field>
                <div style={{ marginTop: 20 }}>
                  <PrimaryButton onClick={handleOTP}>Next</PrimaryButton>
                </div>
              </div>
            ) : (
              <div>
                <p>OTP verified successfully. you may delete account</p>
                {!accountDeleted ? (
                  <PrimaryButton onClick={handleDeleteAccount}>
                    Delete Account
                  </PrimaryButton>
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
