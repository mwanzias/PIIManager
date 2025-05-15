import React from "react";

interface verificationCompleteProps {
  onDataCollection: (data: string, toVerify: string) => void;
  toVerify: string;
}

const VerifyDetails: React.FC<verificationCompleteProps> = ({
  onDataCollection,
  toVerify,
}) => {
  const [verificationCode, setVerificationCode] = React.useState("");
  return (
    <div>
      {toVerify === "email" ? (
        <>
          <p>Email Verification</p>
          <div>
            <p>
              We have sent a verification email to your registered email
              address. Please check your inbox and click on the verification
              link to confirm your email address.
            </p>
            <p>
              If you do not receive the email within a few minutes, please check
              your spam or junk folder. If you still do not see it, you can
              request a new verification email.
            </p>
          </div>
        </>
      ) : (
        <>
          <p>Phone Verification</p>
          <div>
            <p>
              We have sent a verification code to your registered phone number.
              Please check your SMS and enter the code below to confirm your
              phone number.
            </p>
            <p>
              If you do not receive the SMS within a few minutes, please check
              your network connection. If you still do not see it, you can
              request a new verification code.
            </p>
          </div>
        </>
      )}

      <input
        type="text"
        placeholder="Enter verification code"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
      <div style={{ marginTop: "16px" }}>
        <button onClick={() => onDataCollection(verificationCode, toVerify)}>
          Verify
        </button>
      </div>
    </div>
  );
};

export default VerifyDetails;
