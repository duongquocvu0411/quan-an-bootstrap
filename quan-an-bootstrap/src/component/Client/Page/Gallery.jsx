import react from "react";

function Gallery(){
    return(
        <>
<br /><br /><br /><br /><br /><br /><br />
  {/* Section Title */}
  <div className="container section-title" data-aos="fade-up">
    <h2>Gallery</h2>
    <p>Some photos from Our Restaurant</p>
  </div>{/* End Section Title */}
  <div className="container-fluid" data-aos="fade-up" data-aos-delay={100}>
    <div className="row g-0">
      <div className="col-lg-3 col-md-4">
        <div className="gallery-item">
          <a href="assets/img/gallery/gallery-1.jpg" className="glightbox" data-gallery="images-gallery">
            <img src="assets/img/gallery/gallery-1.jpg" alt className="img-fluid" />
          </a>
        </div>
      </div>{/* End Gallery Item */}
      <div className="col-lg-3 col-md-4">
        <div className="gallery-item">
          <a href="assets/img/gallery/gallery-2.jpg" className="glightbox" data-gallery="images-gallery">
            <img src="assets/img/gallery/gallery-2.jpg" alt className="img-fluid" />
          </a>
        </div>
      </div>{/* End Gallery Item */}
      <div className="col-lg-3 col-md-4">
        <div className="gallery-item">
          <a href="assets/img/gallery/gallery-3.jpg" className="glightbox" data-gallery="images-gallery">
            <img src="assets/img/gallery/gallery-3.jpg" alt className="img-fluid" />
          </a>
        </div>
      </div>{/* End Gallery Item */}
      <div className="col-lg-3 col-md-4">
        <div className="gallery-item">
          <a href="assets/img/gallery/gallery-4.jpg" className="glightbox" data-gallery="images-gallery">
            <img src="assets/img/gallery/gallery-4.jpg" alt className="img-fluid" />
          </a>
        </div>
      </div>{/* End Gallery Item */}
      <div className="col-lg-3 col-md-4">
        <div className="gallery-item">
          <a href="assets/img/gallery/gallery-5.jpg" className="glightbox" data-gallery="images-gallery">
            <img src="assets/img/gallery/gallery-5.jpg" alt className="img-fluid" />
          </a>
        </div>
      </div>{/* End Gallery Item */}
      <div className="col-lg-3 col-md-4">
        <div className="gallery-item">
          <a href="assets/img/gallery/gallery-6.jpg" className="glightbox" data-gallery="images-gallery">
            <img src="assets/img/gallery/gallery-6.jpg" alt className="img-fluid" />
          </a>
        </div>
      </div>{/* End Gallery Item */}
      <div className="col-lg-3 col-md-4">
        <div className="gallery-item">
          <a href="assets/img/gallery/gallery-7.jpg" className="glightbox" data-gallery="images-gallery">
            <img src="assets/img/gallery/gallery-7.jpg" alt className="img-fluid" />
          </a>
        </div>
      </div>{/* End Gallery Item */}
      <div className="col-lg-3 col-md-4">
        <div className="gallery-item">
          <a href="assets/img/gallery/gallery-8.jpg" className="glightbox" data-gallery="images-gallery">
            <img src="assets/img/gallery/gallery-8.jpg" alt className="img-fluid" />
          </a>
        </div>
      </div>{/* End Gallery Item */}
    </div>
  </div>


        </>
    )
}
export default Gallery;