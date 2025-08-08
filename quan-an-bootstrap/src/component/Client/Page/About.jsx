import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { getAllAboutClient } from "../../../be/Client/About/About.api";
import { getClientFeatureList } from "../../../be/Client/Feture/FeatureClient.api";


function About() {
  const [aboutList, setAboutList] = useState([]);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
  
    fetchData();
    fetchFeatures();
  }, []);

  const fetchData = async () => {
      try {
        const data = await getAllAboutClient();
        setAboutList(data);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách About:", err);
      }
    };

    const fetchFeatures = async () => {
    try {
      const res = await getClientFeatureList();
      if (res.isSuccess) {
        setFeatures(res.data);
      } else {
        console.error("Lỗi khi lấy danh sách Features:", res.message);
      }
    } catch (err) {
      console.error("Lỗi khi gọi API Features:", err);
    }
  };

  return (
    <>
      {/* About Section */}
      <br /><br /><br /><br /><br /><br /><br />
      <div className="container" data-aos="fade-up" data-aos-delay="100">
        {aboutList.map((about, index) => {
          const sortedImages = [...about.images].sort((a, b) => a.displayOrder - b.displayOrder);
          const isEven = index % 2 === 0;

          return (
            <div
              className={`row gy-5 ${index === 0 ? "mb-5" : ""} align-items-center`}
              key={about.id}
            >
              {/* Swiper Carousel */}
              <div className={`col-lg-6 order-1 order-lg-2`}>
                <Swiper
                  modules={[Autoplay, Pagination]}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  loop={true}
                  className="about-swiper"
                >
                  {sortedImages.map((img) => (
                    <SwiperSlide key={img.id}>
                      <img
                        src={img.url}
                        className="img-fluid about-img w-100"
                        alt={`Slide ${img.id}`}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Content */}
              <div className="col-lg-6 order-2 order-lg-1 content">
                <div dangerouslySetInnerHTML={{ __html: about.descriptions }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* WHY US Section */}
<section id="why-us" className="why-us section">
  <div className="container section-title" data-aos="fade-up">
    <h2>WHY US</h2>
    <p>Why Choose Our Company</p>
  </div>

  <div className="container">
    <div className="row gy-4">
      {features.map((item, index) => (
        <div
          className="col-lg-4"
          data-aos="fade-up"
          data-aos-delay={(index + 1) * 100}
          key={item.id}
        >
          <div className="card-item text-center">
            {/* Bỏ span STT ở đây */}
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="mb-3"
                style={{ width: "60px", height: "60px", objectFit: "contain" }}
              />
            )}
            <h4>
              <a href={item.link} className="stretched-link">
                {item.title}
              </a>
            </h4>
            <p>{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>



    </>
  );
}

export default About;
