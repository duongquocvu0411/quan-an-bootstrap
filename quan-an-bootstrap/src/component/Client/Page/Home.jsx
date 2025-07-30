import react  from "react";
import Header from "./Header";
import About from "./About";
import Menu from "./Menu";
import Specials from "./Specials";
import Event from "./Event";
import Booking from "./Booking";
import Testimonials from "./Testimonials";
import Gallery from "./Gallery";
import Chefs from "./Chefs";
import Contact from "./Contact";
import Footer from "./Footer";

function Home() {
    return(
     
       <>
                {/* Hero Section */}
                <section id="hero" className="hero section dark-background">
                <img src="assets/img/hero-bg.jpg" alt data-aos="fade-in" />
                <div className="container">
                    <div className="row">
                    <div className="col-lg-8 d-flex flex-column align-items-center align-items-lg-start">
                        <h2 data-aos="fade-up" data-aos-delay={100}>Welcome to <span>Restaurantly</span></h2>
                        <p data-aos="fade-up" data-aos-delay={200}>Delivering great food for more than 18 years!</p>
                        <div className="d-flex mt-4" data-aos="fade-up" data-aos-delay={300}>
                        <a href="#menu" className="cta-btn">Our Menu</a>
                        <a href="#book-a-table" className="cta-btn">Book a Table</a>
                        </div>
                    </div>
                    <div className="col-lg-4 d-flex align-items-center justify-content-center mt-5 mt-lg-0">
                        <a href="https://www.youtube.com/watch?v=Y7f98aduVJ8" className="glightbox pulsating-play-btn" />
                    </div>
                    </div>
                </div>
                </section>{/* /Hero Section */}


                {/* About */}
                 <section id="about" className="about section">
                        <About />
                </section>
                {/* End About */}

            {/* Menu */}
            <section id="menu" className="menu section">
                <Menu/>
            </section>
            {/* End Menu */}

            {/* Specials */}
          <section id="specials" className="specials section">
            <Specials />
          </section>
            {/* End Specials */}

            {/* Event */}

            <section id="events" className="events section">
                <Event />
            </section>
            {/* End Event */}


            {/* Booking */}
                <section id="book-a-table" className="book-a-table section">
               <Booking/>   
                </section>
            {/* End Booking */}

            {/* Testimonials */}
            <section id="testimonials" className="testimonials section">
                <Testimonials />
            </section>
            {/* End Testimonials */}


            {/* Gallery */}
             <section id="gallery" className="gallery section">
                <Gallery />
             </section>
            {/* End Gallery */}


            {/* Chefs  */}
            <section id="chefs" className="chefs section">
                <Chefs />
            </section>
            {/* End Chefs */}

            {/* Contact */}
             <section id="contact" className="contact section">
               <Contact />
             </section>
            {/* End Contact */}
      

 
   </>
    )
}
export default Home;