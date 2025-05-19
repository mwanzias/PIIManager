import React, { useState, useEffect } from "react";
import {
  Stack,
  Text,
  IStackTokens,
  IconButton,
  Spinner,
  SpinnerSize,
  PrimaryButton,
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
import { Testimonial } from "../types/testimonial";
import { testimonialService } from "../services/testimonialService";
import TestimonialForm from "./TestimonialForm";

const testimonialCardStyles = {
  root: {
    backgroundColor: colors.white,
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    flex: 1,
    minWidth: "300px",
    maxWidth: "400px",
    position: "relative" as const,
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "translateY(-4px)",
    },
  },
};

const quoteIconStyles = {
  root: {
    fontSize: "48px",
    color: colors.primaryLight,
    position: "absolute" as const,
    top: "16px",
    left: "16px",
    opacity: 0.2,
  },
};

const customerNameStyles = {
  root: {
    fontSize: "16px",
    fontWeight: "600",
    color: colors.primary,
    marginTop: "16px",
  },
};

const customerEmailStyles = {
  root: {
    fontSize: "14px",
    color: colors.gray130,
    marginTop: "4px",
  },
};

const dateStyles = {
  root: {
    fontSize: "12px",
    color: colors.gray130,
    marginTop: "4px",
    fontStyle: "italic",
  },
};

const paginationStyles = {
  root: {
    marginTop: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
};

const stackTokens: IStackTokens = {
  childrenGap: 24,
};

const Testimonials: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const testimonialsPerPage = 3;
  const [isLoading, setIsLoading] = useState(true);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { testimonials: fetchedTestimonials, total } = await testimonialService.getApprovedTestimonials(currentPage, testimonialsPerPage);
      setTestimonials(fetchedTestimonials);
    } catch (err) {
      setError('Failed to load testimonials. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [currentPage]);

  // Function to get name from email
  const getNameFromEmail = (email: string) => {
    const name = email.split('@')[0];
    return name.split('.').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ');
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleTestimonialSubmitted = () => {
    setShowForm(false);
    fetchTestimonials(); // Refresh testimonials after submission
  };

  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);
  const startIndex = (currentPage - 1) * testimonialsPerPage;
  const endIndex = startIndex + testimonialsPerPage;
  const currentTestimonials = testimonials.slice(startIndex, endIndex);

  // If there are no testimonials and we're not loading, don't render the section
  if (!isLoading && testimonials.length === 0) {
    return null;
  }

  return (
    <Stack styles={sectionStyles} horizontalAlign="center">
      <Stack styles={containerStyles} horizontalAlign="center">
        <Text styles={sectionTitleStyles}>What Our Users Say</Text>

        {error && (
          <MessageBar
            messageBarType={MessageBarType.error}
            isMultiline={false}
            onDismiss={() => setError(null)}
            dismissButtonAriaLabel="Close"
            styles={{ root: { marginBottom: "16px", width: "100%" } }}
          >
            {error}
          </MessageBar>
        )}

        {isLoading ? (
          <Spinner size={SpinnerSize.large} label="Loading testimonials..." />
        ) : (
          <>
            <Stack horizontal wrap tokens={stackTokens} horizontalAlign="center">
              {currentTestimonials.map((testimonial) => (
                <Stack key={testimonial.id} styles={testimonialCardStyles}>
                  <Text styles={quoteIconStyles}>"</Text>
                  <Text styles={{ root: { marginTop: "24px", lineHeight: "1.6" } }}>
                    {testimonial.text}
                  </Text>
                  <Stack>
                    <Text styles={customerNameStyles}>
                      {getNameFromEmail(testimonial.email)}
                    </Text>
                    <Text styles={customerEmailStyles}>
                      {testimonial.email}
                    </Text>
                    <Text styles={dateStyles}>
                      {formatDate(testimonial.date)}
                    </Text>
                  </Stack>
                </Stack>
              ))}
            </Stack>

            {/* Only show pagination if there are multiple pages */}
            {totalPages > 1 && (
              <Stack horizontal styles={paginationStyles}>
                <IconButton
                  iconProps={{ iconName: 'ChevronLeft' }}
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                />
                <Text>{`Page ${currentPage} of ${totalPages}`}</Text>
                <IconButton
                  iconProps={{ iconName: 'ChevronRight' }}
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                />
              </Stack>
            )}

            {/* Share Your Experience Button */}
            <PrimaryButton
              text={showForm ? "Hide Form" : "Share Your Experience"}
              onClick={() => setShowForm(!showForm)}
              styles={{
                root: {
                  marginTop: "32px",
                  borderRadius: "25px",
                  padding: "8px 24px",
                },
              }}
            />

            {/* Testimonial Form */}
            {showForm && (
              <TestimonialForm onSubmitted={handleTestimonialSubmitted} />
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default Testimonials; 