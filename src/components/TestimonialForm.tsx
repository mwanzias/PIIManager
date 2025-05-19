import React, { useState } from "react";
import {
  Stack,
  Text,
  TextField,
  PrimaryButton,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
} from "@fluentui/react";
import "../styling/general.css";
import {
  containerStyles,
  sectionStyles,
  sectionTitleStyles,
  colors,
} from "../styling/theme";
import { testimonialService } from "../services/testimonialService";

interface TestimonialFormProps {
  onSubmitted: () => void;
}

const formStyles = {
  root: {
    backgroundColor: colors.white,
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    width: "100%",
    maxWidth: "600px",
  },
};

const TestimonialForm: React.FC<TestimonialFormProps> = ({ onSubmitted }) => {
  const [testimonial, setTestimonial] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: MessageBarType; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await testimonialService.submitTestimonial(testimonial);
      
      setMessage({
        type: MessageBarType.success,
        text: "Thank you for your testimonial! It will be reviewed by our team."
      });

      // Clear form
      setTestimonial("");

      // Call the onSubmitted callback
      onSubmitted();

      // Remove success message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      setMessage({
        type: MessageBarType.error,
        text: "An error occurred while submitting your testimonial. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack styles={sectionStyles} horizontalAlign="center">
      <Stack styles={containerStyles} horizontalAlign="center">
        <Text styles={sectionTitleStyles}>Share Your Experience</Text>
        
        {message && (
          <MessageBar
            messageBarType={message.type}
            isMultiline={false}
            onDismiss={() => setMessage(null)}
            dismissButtonAriaLabel="Close"
            styles={{ root: { marginBottom: "16px", width: "100%" } }}
          >
            {message.text}
          </MessageBar>
        )}

        <Stack styles={formStyles}>
          <form onSubmit={handleSubmit}>
            <Stack tokens={{ childrenGap: 16 }}>
              <TextField
                label="Your Testimonial"
                multiline
                rows={4}
                value={testimonial}
                onChange={(_, newValue) => setTestimonial(newValue || "")}
                required
                placeholder="Share your experience with our service..."
                styles={{
                  root: { width: "100%" },
                  field: { minHeight: "100px" },
                }}
              />
              <Text styles={{ root: { fontSize: "12px", color: colors.gray130 } }}>
                Your testimonial will be reviewed by our team before being published.
              </Text>
              <PrimaryButton
                type="submit"
                text="Submit Testimonial"
                disabled={isSubmitting || !testimonial.trim()}
                styles={{
                  root: {
                    width: "100%",
                    maxWidth: "200px",
                    marginTop: "8px",
                  },
                }}
              />
            </Stack>
          </form>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default TestimonialForm; 