import react from "react";

function Chefs(){
    return(
        <>
           <div className="index-page ">

        <div className="main ">
          <br /><br /><br /><br /><br /><br /><br />
  {/* Section Title */}
  <div className="container " data-aos="fade-up">
    <h2>Team</h2>
    <p>Necessitatibus eius consequatur</p>
  </div>{/* End Section Title */}
  <div className="container">
    <div className="row gy-4">
      <div className="col-lg-4" data-aos="fade-up" data-aos-delay={100}>
        <div className="member">
          <img src="assets/img/chefs/chefs-1.jpg" className="img-fluid" alt />
          <div className="member-info">
            <div className="member-info-content">
              <h4>Walter White</h4>
              <span>Master Chef</span>
            </div>
            <div className="social">
              <a href><i className="bi bi-twitter-x" /></a>
              <a href><i className="bi bi-facebook" /></a>
              <a href><i className="bi bi-instagram" /></a>
              <a href><i className="bi bi-linkedin" /></a>
            </div>
          </div>
        </div>
      </div>{/* End Team Member */}
      <div className="col-lg-4" data-aos="fade-up" data-aos-delay={200}>
        <div className="member">
          <img src="assets/img/chefs/chefs-2.jpg" className="img-fluid" alt />
          <div className="member-info">
            <div className="member-info-content">
              <h4>Sarah Jhonson</h4>
              <span>Patissier</span>
            </div>
            <div className="social">
              <a href><i className="bi bi-twitter-x" /></a>
              <a href><i className="bi bi-facebook" /></a>
              <a href><i className="bi bi-instagram" /></a>
              <a href><i className="bi bi-linkedin" /></a>
            </div>
          </div>
        </div>
      </div>{/* End Team Member */}
      <div className="col-lg-4" data-aos="fade-up" data-aos-delay={300}>
        <div className="member">
          <img src="assets/img/chefs/chefs-3.jpg" className="img-fluid" alt />
          <div className="member-info">
            <div className="member-info-content">
              <h4>William Anderson</h4>
              <span>Cook</span>
            </div>
            <div className="social">
              <a href><i className="bi bi-twitter-x" /></a>
              <a href><i className="bi bi-facebook" /></a>
              <a href><i className="bi bi-instagram" /></a>
              <a href><i className="bi bi-linkedin" /></a>
            </div>
          </div>
        </div>
      </div>{/* End Team Member */}
    </div>
  </div>
  </div>
  </div>


        </>
    )
}
export default Chefs;