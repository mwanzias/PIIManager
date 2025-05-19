import React, { useState } from "react";
import {
  Stack,
  Text,
  IStackTokens,
  IconButton,
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

interface Testimonial {
  id: string;
  text: string;
  email: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

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

// Sample testimonials data - In a real app, this would come from your backend
const sampleTestimonials: Testimonial[] = [
  {
    id: "1",
    text: "This service has completely changed how I handle my personal information. No more worrying about my data being misused!",
    email: "john.doe@example.com",
    date: "2024-03-15",
    status: "approved",
  },
  {
    id: "2",
    text: "The pseudo-number system is brilliant. I feel much more secure knowing my real information is protected.",
    email: "sarah.smith@example.com",
    date: "2024-03-14",
    status: "approved",
  },
  {
    id: "3",
    text: "Finally, a solution that puts privacy first. The yearly plan is totally worth it for the peace of mind.",
    email: "michael.brown@example.com",
    date: "2024-03-13",
    status: "approved",
  },
  {
    id: "4",
    text: "Great service! The customer support is excellent and the system is very intuitive.",
    email: "emma.wilson@example.com",
    date: "2024-03-12",
    status: "approved",
  },
  {
    id: "5",
    text: "I've recommended this to all my friends. It's exactly what we needed for better privacy.",
    email: "david.clark@example.com",
    date: "2024-03-11",
    status: "approved",
  },
];

const Testimonials: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const testimonialsPerPage = 3;
  const [isLoading, setIsLoading] = useState(false);

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

  // Get current testimonials
  const indexOfLastTestimonial = currentPage * testimonialsPerPage;
  const indexOfFirstTestimonial = indexOfLastTestimonial - testimonialsPerPage;
  const currentTestimonials = sampleTestimonials
    .filter(t => t.status === 'approved')
    .slice(indexOfFirstTestimonial, indexOfLastTestimonial);
  const totalPages = Math.ceil(sampleTestimonials.filter(t => t.status === 'approved').length / testimonialsPerPage);

  const handlePageChange = (newPage: number) => {
    setIsLoading(true);
    setCurrentPage(newPage);
    // Simulate loading delay
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <Stack styles={sectionStyles} horizontalAlign="center">
      <Stack styles={containerStyles} horizontalAlign="center">
        <Text styles={sectionTitleStyles}>What Our Users Say</Text>
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

            {/* Pagination */}
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
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default Testimonials; 