import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { toast, ToastContainer } from "react-toastify";
import { createContactUser, getActiveContactAdmins } from "../../../be/Client/ContactUser/ContactUser.api";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const data = await getActiveContactAdmins();
        if (data.length > 0) {
          setContactInfo(data[0]);
        }
      } catch (error) {
        toast.error("Không thể tải thông tin liên hệ.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchContactInfo();
  }, []);

  const handlePhoneInput = (e) => {
    const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 20);
    setFormData((prev) => ({ ...prev, phone: onlyNums }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (formData.phone.length < 10) {
      toast.error("Số điện thoại phải có ít nhất 10 chữ số.");
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        yourName: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      };

      const res = await createContactUser(payload);

      if (res?.isSuccess) {
        toast.success(res.message || "Thành công");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(res?.message || "Đã xảy ra lỗi");
      }
    } catch (err) {
      toast.error("Đã xảy ra lỗi khi gửi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <section id="contact" className="contact section">
        <br /><br /><br /><br /><br /><br /><br />

        <div className="container section-title" data-aos="fade-up">
          <h2>Contact</h2>
          <p>Contact Us</p>
        </div>

        {!isLoading && contactInfo && (
          <>
            <div className="mb-5" data-aos="fade-up" data-aos-delay={200}>
              <iframe
                style={{ border: 0, width: "100%", height: 400 }}
                src={contactInfo.mapurl}
                frameBorder={0}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map"
              />
            </div>

            <div className="container" data-aos="fade-up" data-aos-delay={100}>
              <div className="row gy-4">
                <div className="col-lg-4">
                  <div className="info-item d-flex" data-aos="fade-up" data-aos-delay={300}>
                    <i className="bi bi-geo-alt flex-shrink-0" />
                    <div>
                      <h3>Location</h3>
                      <p>{contactInfo.location}</p>
                    </div>
                  </div>
                  <div className="info-item d-flex" data-aos="fade-up" data-aos-delay={400}>
                    <i className="bi bi-clock flex-shrink-0" />
                    <div>
                      <h3>Open Hours</h3>
                      <p>{contactInfo.openHours}</p>
                    </div>
                  </div>
                  <div className="info-item d-flex" data-aos="fade-up" data-aos-delay={400}>
                    <i className="bi bi-telephone flex-shrink-0" />
                    <div>
                      <h3>Call Us</h3>
                      <p>{contactInfo.phoneNumber}</p>
                    </div>
                  </div>
                  <div className="info-item d-flex" data-aos="fade-up" data-aos-delay={500}>
                    <i className="bi bi-envelope flex-shrink-0" />
                    <div>
                      <h3>Email Us</h3>
                      <p>{contactInfo.emailAddress}</p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-8">
                  <form
                    onSubmit={handleSubmit}
                    className="php-email-form"
                    data-aos="fade-up"
                    data-aos-delay={200}
                  >
                    <div className="row gy-4">
                      <div className="col-md-4">
                        <input
                          type="text"
                          name="name"
                          className="form-control"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="col-md-4 ">
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="text"
                          name="phone"
                          className="form-control"
                          placeholder="Your Phone"
                          value={formData.phone}
                          onChange={handlePhoneInput}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="col-md-12">
                        <input
                          type="text"
                          name="subject"
                          className="form-control"
                          placeholder="Subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="col-md-12">
                        <textarea
                          className="form-control"
                          name="message"
                          rows={6}
                          placeholder="Message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="col-md-12 text-center">
                        <button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? "Loading..." : "Send Message"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      <ToastContainer />
  
    </>
  );
}

export default Contact;
