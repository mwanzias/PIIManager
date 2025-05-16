import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const slides = [
  {
    image: "queue_c.png",
    caption: "When you have to share you personal details in public settings.",
    story:
      "Ever wondered how many people have access to your data? and where they got access from.",
  },
  {
    image: "using_pseudo_c.png",
    caption: "Protect your data with a unique pseudo number.",
    story:
      "The pseudo number is a unique identifier that replaces your personal data. and only you can access it and share with the people you want to.",
  },
  {
    image: "access_controlled_c2.png",
    caption: "You control who accesses your private information.",
    story:
      "Your data is only accessible to your nominated companies. for the purpose of the known transaction after which they lose access.",
  },
  {
    image: "data_protection.png",
    caption: "Your data is protected by the latest encryption technology.",
    story:
      "We use the latest encryption technology to protect your data. and only you can access it and share with the people you want to.",
  },
  {
    image: "data_sharing.png",
    caption: "Share your data with confidence.",
    story:
      "You can share your data with confidence, and you get alerted every time someone needs to access.",
  },
];

const ImageCarousel: React.FC = () => {
  return (
    <div className="left-side" style={{ textAlign: "center" }}>
      <Carousel
        showArrows={true}
        showStatus={false}
        showThumbs={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={5000}
        stopOnHover={true}
        swipeable={true}
        emulateTouch={true}
        dynamicHeight={false}
        className="custom-carousel"
      >
        {slides.map((slide, index) => (
          <div key={index} className="carousel-slide">
            <img
              src={slide.image}
              alt={`Slide ${index + 1}`}
              style={{
                width: "100%",
                height: "600px", // Increased height as requested
                maxHeight: "100vh", // Ensures it doesn't get too large on bigger screens
                minHeight: "400px", // Ensures it doesn't get too small on smaller screens
                objectFit: "scale-down", // Ensures images maintain aspect ratio while filling the container
              }}
            />
            <div className="literature" style={{ padding: "15px" }}>
              <h2>{slide.caption}</h2>
              <p>{slide.story}</p>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
