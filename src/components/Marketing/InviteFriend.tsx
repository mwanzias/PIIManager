import { Button } from "@fluentui/react-button";
import { InviteAFriendProps } from "../../Interfaces/PseudoInterfaces";
import { Stack } from "@fluentui/react";
import React, { useState } from "react";
import {
  PersonRegular,
  MailRegular,
  PhoneRegular,
  ChatRegular,
  ShareRegular,
  CopyRegular,
  CheckmarkCircleRegular,
} from "@fluentui/react-icons";

const InviteAFriend: React.FC<InviteAFriendProps> = ({
  userNameInviting,
  userPhoneInviting,
  userEmailInviting,
}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    friendName: "",
    friendEmail: "",
    friendPhone: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const processInvite = () => {
    // Here you would handle the actual invite submission
    console.log("Processing invite with data:", formData);
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setFormData({
      friendName: "",
      friendEmail: "",
      friendPhone: "",
      message: "",
    });
    setIsSubmitted(false);
  };

  const InputField = ({
    label,
    name,
    placeholder,
    icon,
    value,
    onChange,
  }: {
    label: string;
    name: string;
    placeholder: string;
    icon: React.ReactNode;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  }) => (
    <div className="form-field" style={{ marginBottom: "16px" }}>
      <label
        htmlFor={name}
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: 500,
        }}
      >
        {label}
      </label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          padding: "0 12px",
          backgroundColor: "white",
        }}
      >
        <div style={{ color: "#666", marginRight: "8px" }}>{icon}</div>
        <input
          type="text"
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{
            border: "none",
            padding: "12px 8px",
            width: "100%",
            outline: "none",
            fontSize: "14px",
          }}
        />
      </div>
    </div>
  );

  if (isSubmitted) {
    return (
      <div
        className="invite-friend-container"
        style={{ maxWidth: "800px", margin: "0 auto" }}
      >
        <div
          className="success-message"
          style={{
            textAlign: "center",
            padding: "32px",
            background: "#e6f7e6",
            borderRadius: "12px",
            marginTop: "24px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{ fontSize: "48px", color: "#28a745", marginBottom: "16px" }}
          >
            <CheckmarkCircleRegular />
          </div>
          <h2 style={{ color: "#28a745", marginBottom: "16px" }}>
            Invitation Sent!
          </h2>
          <p style={{ fontSize: "16px", marginBottom: "24px" }}>
            Your friend will receive an email with your invitation soon.
          </p>
          <Button
            appearance="primary"
            style={{
              borderRadius: "9999px",
              padding: "8px 24px",
              background: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
            onClick={resetForm}
          >
            Invite Another Friend
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="invite-friend-container"
      style={{ maxWidth: "800px", margin: "0 auto" }}
    >
      {/* Hero Section */}
      <div
        className="hero-section"
        style={{
          background: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
          borderRadius: "12px",
          padding: "30px",
          color: "white",
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "16px" }}>Invite Friends & Earn Rewards</h1>
        <p style={{ fontSize: "16px", marginBottom: "24px" }}>
          Share the benefits of privacy protection with your friends and family
        </p>
        <img
          src="/privacy_icon.png"
          alt="Referral"
          style={{
            maxWidth: "120px",
            filter: "brightness(0) invert(1)",
            opacity: "0.9",
          }}
        />
      </div>

      {/* Form Section with Card-like appearance */}
      <div
        className="form-section"
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          marginBottom: "24px",
        }}
      >
        <h2 style={{ marginBottom: "24px", textAlign: "center" }}>
          Send an Invitation
        </h2>

        <Stack horizontal={false} tokens={{ childrenGap: 16 }}>
          <InputField
            label="Friend's Name"
            name="friendName"
            placeholder="Enter your friend's name"
            icon={<PersonRegular />}
            value={formData.friendName}
            onChange={handleInputChange}
          />

          <InputField
            label="Friend's Email"
            name="friendEmail"
            placeholder="Enter your friend's email"
            icon={<MailRegular />}
            value={formData.friendEmail}
            onChange={handleInputChange}
          />

          <InputField
            label="Friend's Phone"
            name="friendPhone"
            placeholder="Enter your friend's phone number"
            icon={<PhoneRegular />}
            value={formData.friendPhone}
            onChange={handleInputChange}
          />

          {/* Hidden fields for inviter info */}
          <input type="hidden" value={userNameInviting} name="inviterName" />
          <input type="hidden" value={userPhoneInviting} name="inviterPhone" />
          <input type="hidden" value={userEmailInviting} name="inviterEmail" />

          <div className="form-field" style={{ marginBottom: "16px" }}>
            <label
              htmlFor="message"
              style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: 500,
              }}
            >
              Your Message
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                padding: "12px",
                backgroundColor: "white",
              }}
            >
              <div
                style={{ color: "#666", marginRight: "8px", marginTop: "2px" }}
              >
                <ChatRegular />
              </div>
              <textarea
                name="message"
                placeholder="Write a personal message to your friend"
                value={formData.message}
                onChange={handleInputChange}
                style={{
                  border: "none",
                  width: "100%",
                  height: "100px",
                  outline: "none",
                  fontSize: "14px",
                  resize: "vertical",
                }}
              />
            </div>
          </div>
        </Stack>

        {/* Sharing options */}
        <div
          className="sharing-options"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            margin: "24px 0",
          }}
        >
          <Button appearance="subtle" icon={<MailRegular />}>
            Email
          </Button>
          <Button appearance="subtle" icon={<ShareRegular />}>
            WhatsApp
          </Button>
          <Button appearance="subtle" icon={<CopyRegular />}>
            Copy Link
          </Button>
        </div>

        {/* Action buttons */}
        <Stack
          horizontal
          tokens={{ childrenGap: 16 }}
          style={{ justifyContent: "center" }}
        >
          <Button
            appearance="primary"
            style={{
              borderRadius: "9999px",
              padding: "8px 24px",
              background: "linear-gradient(135deg, #6B73FF 0%, #000DFF 100%)",
              border: "none",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            }}
            onClick={processInvite}
          >
            Send Invite
          </Button>
          <Button
            appearance="secondary"
            style={{
              borderRadius: "9999px",
              padding: "8px 24px",
              border: "1px solid #e0e0e0",
            }}
            onClick={resetForm}
          >
            Cancel
          </Button>
        </Stack>
      </div>

      {/* Rewards and incentives section */}
      <div
        className="rewards-section"
        style={{
          background: "#f9f9f9",
          borderRadius: "12px",
          padding: "24px",
          marginBottom: "24px",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "24px" }}>
          How It Works
        </h3>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div
            className="step"
            style={{
              textAlign: "center",
              flex: "1",
              minWidth: "120px",
            }}
          >
            <div
              className="step-number"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#6B73FF",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                fontWeight: "bold",
              }}
            >
              1
            </div>
            <p>Invite your friends</p>
          </div>
          <div
            className="step"
            style={{
              textAlign: "center",
              flex: "1",
              minWidth: "120px",
            }}
          >
            <div
              className="step-number"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#6B73FF",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                fontWeight: "bold",
              }}
            >
              2
            </div>
            <p>They sign up</p>
          </div>
          <div
            className="step"
            style={{
              textAlign: "center",
              flex: "1",
              minWidth: "120px",
            }}
          >
            <div
              className="step-number"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                background: "#6B73FF",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                fontWeight: "bold",
              }}
            >
              3
            </div>
            <p>Both get rewards</p>
          </div>
        </div>

        <div
          style={{
            marginTop: "24px",
            padding: "16px",
            background: "#e6f4ff",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
            Your Rewards
          </p>
          <p>
            For each friend who signs up, you'll receive 1 month of premium
            features for free!
          </p>
        </div>
      </div>
    </div>
  );
};

export default InviteAFriend;
