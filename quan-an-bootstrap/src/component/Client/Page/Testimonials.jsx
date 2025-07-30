// src/components/Client/Page/Testimonials.jsx

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const testimonials = [
  {
    text:
      "Proin iaculis purus consequat sem cure digni ssim donec porttitora entum suscipit rhoncus...",
    image: "assets/img/testimonials/testimonials-1.jpg",
    name: "Saul Goodman",
    role: "Ceo & Founder",
  },
  {
    text:
      "Export tempor illum tamen malis malis eram quae irure esse labore quem cillum quid malis...",
    image: "assets/img/testimonials/testimonials-2.jpg",
    name: "Sara Wilsson",
    role: "Designer",
  },
  {
    text:
      "Enim nisi quem export duis labore cillum quae magna enim sint quorum nulla quem veniam...",
    image: "assets/img/testimonials/testimonials-3.jpg",
    name: "Jena Karlis",
    role: "Store Owner",
  },
  {
    text:
      "Fugiat enim eram quae cillum dolore dolor amet nulla culpa multos export minim fugiat...",
    image: "assets/img/testimonials/testimonials-4.jpg",
    name: "Matt Brandon",
    role: "Freelancer",
  },
  {
    text:
      "Quis quorum aliqua sint quem legam fore sunt eram irure aliqua veniam tempor noster veniam...",
    image: "assets/img/testimonials/testimonials-5.jpg",
    name: "John Larson",
    role: "Entrepreneur",
  },
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="testimonials section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Testimonials</h2>
        <p>What they're saying about us</p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          speed={600}
          loop={true}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 40 },
            1200: { slidesPerView: 3, spaceBetween: 20 },
          }}
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="testimonial-item">
                <p>
                  <i className="bi bi-quote quote-icon-left"></i>
                  <span>{item.text}</span>
                  <i className="bi bi-quote quote-icon-right"></i>
                </p>
                <img src={item.image} className="testimonial-img" alt={item.name} />
                <h3>{item.name}</h3>
                <h4>{item.role}</h4>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
