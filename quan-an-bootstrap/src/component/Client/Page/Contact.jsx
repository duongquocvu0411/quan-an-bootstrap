import react  from "react";
import Header from "./Header";
import Footer from "./Footer";

function Contact(){
    return(
        <>
 
       <div className="index-page ">
              
             <br /><br /><br /><br /><br /><br /><br />
        <div className="main ">
       
  {/* Section Title */}
  <div className="container section-title" data-aos="fade-up">
    <h2>Contact</h2>
    <p>Contact Us</p>
  </div>{/* End Section Title */}
  <div className="mb-5" data-aos="fade-up" data-aos-delay={200}>
    <iframe style={{border: 0, width: '100%', height: 400}} src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d48389.78314118045!2d-74.006138!3d40.710059!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3bda30d%3A0xb89d1fe6bc499443!2sDowntown%20Conference%20Center!5e0!3m2!1sen!2sus!4v1676961268712!5m2!1sen!2sus" frameBorder={0} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
  </div>{/* End Google Maps */}
  <div className="container" data-aos="fade-up" data-aos-delay={100}>
    <div className="row gy-4">
      <div className="col-lg-4">
        <div className="info-item d-flex" data-aos="fade-up" data-aos-delay={300}>
          <i className="bi bi-geo-alt flex-shrink-0" />
          <div>
            <h3>Location</h3>
            <p>A108 Adam Street, New York, NY 535022</p>
          </div>
        </div>{/* End Info Item */}
        <div className="info-item d-flex" data-aos="fade-up" data-aos-delay={400}>
          <i className="bi bi-telephone flex-shrink-0" />
          <div>
            <h3>Open Hours</h3>
            <p>Monday-Saturday:<br />11:00 AM - 2300 PM</p>
          </div>
        </div>{/* End Info Item */}
        <div className="info-item d-flex" data-aos="fade-up" data-aos-delay={400}>
          <i className="bi bi-telephone flex-shrink-0" />
          <div>
            <h3>Call Us</h3>
            <p>+1 5589 55488 55</p>
          </div>
        </div>{/* End Info Item */}
        <div className="info-item d-flex" data-aos="fade-up" data-aos-delay={500}>
          <i className="bi bi-envelope flex-shrink-0" />
          <div>
            <h3>Email Us</h3>
            <p>info@example.com</p>
          </div>
        </div>{/* End Info Item */}
      </div>
      <div className="col-lg-8">
        <form action="forms/contact.php" method="post" className="php-email-form" data-aos="fade-up" data-aos-delay={200}>
          <div className="row gy-4">
            <div className="col-md-6">
              <input type="text" name="name" className="form-control" placeholder="Your Name" required />
            </div>
            <div className="col-md-6 ">
              <input type="email" className="form-control" name="email" placeholder="Your Email" required />
            </div>
            <div className="col-md-12">
              <input type="text" className="form-control" name="subject" placeholder="Subject" required />
            </div>
            <div className="col-md-12">
              <textarea className="form-control" name="message" rows={6} placeholder="Message" required defaultValue={""} />
            </div>
            <div className="col-md-12 text-center">
              <div className="loading">Loading</div>
              <div className="error-message" />
              <div className="sent-message">Your message has been sent. Thank you!</div>
              <button type="submit">Send Message</button>
            </div>
          </div>
        </form>
      </div>{/* End Contact Form */}
    </div>
    </div>
  </div>

</div>  


        </>
    )
}
export default Contact;