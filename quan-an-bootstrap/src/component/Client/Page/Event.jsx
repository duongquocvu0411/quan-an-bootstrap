import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

const eventData = [
  {
    title: "Birthday Parties",
    price: "$189",
    image: "assets/img/events-slider/events-slider-1.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    features: [
      "Ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit.",
      "Ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    ],
    note:
      "Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur"
  },
  {
    title: "Private Parties",
    price: "$290",
    image: "assets/img/events-slider/events-slider-2.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    features: [
      "Ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit.",
      "Ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    ],
    note:
      "Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur"
  },
  {
    title: "Custom Parties",
    price: "$99",
    image: "assets/img/events-slider/events-slider-3.jpg",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    features: [
      "Ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit.",
      "Ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    ],
    note:
      "Ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur"
  }
];

const Events = () => {
  return (
    <>
    <br /><br /><br /><br /><br /><br /><br />

    <section id="events" className="events section">
      <img
        className="slider-bg"
        src="assets/img/events-bg.jpg"
        alt=""
        data-aos="fade-in"
      />

      <div className="container">
        <Swiper
          modules={[Pagination, Autoplay]}
          loop={true}
          speed={600}
          autoplay={{ delay: 5000 }}
          slidesPerView="auto"
          pagination={{ clickable: true }}
          className="init-swiper"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {eventData.map((event, idx) => (
            <SwiperSlide key={idx}>
              <div className="row gy-4 event-item">
                <div className="col-lg-6">
                  <img src={event.image} className="img-fluid" alt="" />
                </div>
                <div className="col-lg-6 pt-4 pt-lg-0 content">
                  <h3>{event.title}</h3>
                  <div className="price">
                    <p><span>{event.price}</span></p>
                  </div>
                  <p className="fst-italic">{event.description}</p>
                  <ul>
                    {event.features.map((feature, i) => (
                      <li key={i}>
                        <i className="bi bi-check2-circle"></i> <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <p>{event.note}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="swiper-pagination"></div>
        </Swiper>
      </div>
    </section>    </>
  );
};

export default Events;
