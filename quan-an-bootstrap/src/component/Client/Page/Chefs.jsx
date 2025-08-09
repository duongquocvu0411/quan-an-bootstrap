import React, { useEffect, useState } from "react";
import { getAllChefsClient } from "../../../be/Client/Chefs/ChefsClient.api";


function Chefs() {
  const [chefsData, setChefsData] = useState([]);

  useEffect(() => {
    const fetchChefs = async () => {
      const res = await getAllChefsClient();
      if (res.isSuccess) {
        setChefsData(res.data || []);
      } else {
        console.error(res.message);
      }
    };
    fetchChefs();
  }, []);

  return (
    <section id="chefs" className="chefs section">
      <br /><br /><br /><br /><br />
      <div className="container section-title" data-aos="fade-up">
        <h2>Team</h2>
        <p>Necessitatibus eius consequatur</p>
      </div>
      {/* End Section Title */}

      <div className="container">
        <div className="row gy-4">
          {chefsData
            .sort((a, b) => a.displayOrder - b.displayOrder)
            .map((chef, index) => (
              <div
                className="col-lg-4"
                data-aos="fade-up"
                data-aos-delay={chef.displayOrder * 100}
                key={chef.id || index}
              >
                <div className="member">
                  <img
                    src={chef.imageUrl}
                    className="img-fluid chef-img"
                    alt={chef.name}
                  />
                  <div className="member-info">
                    <div className="member-info-content">
                      <h4>{chef.name}</h4>
                      <span>{chef.role}</span>
                    </div>
                    <div className="social">
                      {chef.twitterLink && (
                        <a href={chef.twitterLink} target="_blank" rel="noreferrer">
                          <i className="bi bi-twitter-x" />
                        </a>
                      )}
                      {chef.facebookLink && (
                        <a href={chef.facebookLink} target="_blank" rel="noreferrer">
                          <i className="bi bi-facebook" />
                        </a>
                      )}
                      {chef.instagramLink && (
                        <a href={chef.instagramLink} target="_blank" rel="noreferrer">
                          <i className="bi bi-instagram" />
                        </a>
                      )}
                      {chef.linkedinLink && (
                        <a href={chef.linkedinLink} target="_blank" rel="noreferrer">
                          <i className="bi bi-linkedin" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

export default Chefs;
