import React, { useState } from "react";
import {
  Stack,
  Text,
  IStackTokens,
  PrimaryButton,
  DefaultButton,
  Spinner,
  SpinnerSize,
  MessageBar,
  MessageBarType,
} from "@fluentui/react";
import "../styling/general.css";
import {
  containerStyles,
  sectionStyles,
  sectionTitleStyles,
  colors,
} from "../styling/theme";

interface Testimonial {
  id: string;
  text: string;
  email: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

const moderationCardStyles = {
  root: {
    backgroundColor: colors.white,
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: "16px",
    width: "100%",
    maxWidth: "800px",
  },
};

const actionButtonStyles = {
  root: {
    marginLeft: "8px",
  },
};

const stackTokens: IStackTokens = {
  childrenGap: 16,
};

// Sample testimonials data - In a real app, this would come from your backend
const sampleTestimonials: Testimonial[] = [
  {
    id: "1",
    text: "This service has completely changed how I handle my personal information. No more worrying about my data being misused!",
    email: "john.doe@example.com",
    date: "2024-03-15",
    status: "pending",
  },
  {
    id: "2",
    text: "The pseudo-number system is brilliant. I feel much more secure knowing my real information is protected.",
    email: "sarah.smith@example.com",
    date: "2024-03-14",
    status: "pending",
  },
  {
    id: "3",
    text: "Finally, a solution that puts privacy first. The yearly plan is totally worth it for the peace of mind.",
    email: "michael.brown@example.com",
    date: "2024-03-13",
    status: "pending",
  },
];

const TestimonialModeration: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(sampleTestimonials);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: MessageBarType; text: string } | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleModeration = async (id: string, action: 'approve' | 'reject') => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      setTestimonials(prev => 
        prev.map(testimonial => 
          testimonial.id === id 
            ? { ...testimonial, status: action === 'approve' ? 'approved' : 'rejected' }
            : testimonial
        )
      );

      setMessage({
        type: MessageBarType.success,
        text: `Testimonial ${action === 'approve' ? 'approved' : 'rejected'} successfully!`
      });

      // Remove message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: MessageBarType.error,
        text: 'An error occurred while moderating the testimonial.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const pendingTestimonials = testimonials.filter(t => t.status === 'pending');

  return (
    <Stack styles={sectionStyles} horizontalAlign="center">
      <Stack styles={containerStyles} horizontalAlign="center">
        <Text styles={sectionTitleStyles}>Testimonial Moderation</Text>
        
        {message && (
          <MessageBar
            messageBarType={message.type}
            isMultiline={false}
            onDismiss={() => setMessage(null)}
            dismissButtonAriaLabel="Close"
          >
            {message.text}
          </MessageBar>
        )}

        {isLoading ? (
          <Spinner size={SpinnerSize.large} label="Processing..." />
        ) : pendingTestimonials.length === 0 ? (
          <Text>No pending testimonials to moderate.</Text>
        ) : (
          <Stack tokens={stackTokens}>
            {pendingTestimonials.map((testimonial) => (
              <Stack key={testimonial.id} styles={moderationCardStyles}>
                <Text variant="mediumPlus" styles={{ root: { marginBottom: "8px" } }}>
                  {testimonial.text}
                </Text>
                <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                  <Stack>
                    <Text styles={{ root: { color: colors.gray130 } }}>
                      {testimonial.email}
                    </Text>
                    <Text styles={{ root: { color: colors.gray130, fontSize: "12px" } }}>
                      Submitted on {formatDate(testimonial.date)}
                    </Text>
                  </Stack>
                  <Stack horizontal>
                    <PrimaryButton
                      text="Approve"
                      onClick={() => handleModeration(testimonial.id, 'approve')}
                      styles={actionButtonStyles}
                    />
                    <DefaultButton
                      text="Reject"
                      onClick={() => handleModeration(testimonial.id, 'reject')}
                      styles={actionButtonStyles}
                    />
                  </Stack>
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default TestimonialModeration; 