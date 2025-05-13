import React, { useEffect, useState } from "react";

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
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="left-side" style={{ textAlign: "center" }}>
      <div className="signup-image">
        <img
          src={slides[currentSlide].image}
          alt="Illustrative"
          className="signup-image"
        />
        <div className="literature">
          <h2>{slides[currentSlide].caption}</h2>
          <p>{slides[currentSlide].story}</p>
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
