import React, { useEffect, useState, useRef } from "react";
import Isotope from "isotope-layout";
import { Pagination } from "react-bootstrap";
import { getAllCategories, getFoodsByCategory } from "../../../be/Admin/category/category.api";


function Menu() {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [foods, setFoods] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const containerRef = useRef(null);
  const isotope = useRef(null);

  useEffect(() => {
    getAllCategories().then(data => {
      setCategories(data);
      if (data.length > 0) {
        setSelectedCategoryId(data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedCategoryId == null) return;
    getFoodsByCategory(selectedCategoryId, page).then(({ foods, totalPages }) => {
      setFoods(foods);
      setTotalPages(totalPages);
    });
  }, [selectedCategoryId, page]);

  useEffect(() => {
    if (containerRef.current) {
      isotope.current = new Isotope(containerRef.current, {
        itemSelector: ".isotope-item",
        layoutMode: "masonry",
      });
    }
    return () => isotope.current?.destroy();
  }, [foods]);

  return (
    <>
      <div className="index-page">
        <br /><br /><br /><br /><br /><br /><br />
        <div className="main">
          <section id="menu" className="menu section">
            <div className="container section-title" data-aos="fade-up">
              <h2>Menu</h2>
              <p>Check Our Tasty Menu</p>
            </div>

            <div className="container isotope-layout" data-default-filter="*" data-layout="masonry" data-sort="original-order">
              <div className="row" data-aos="fade-up" data-aos-delay={100}>
                <div className="col-lg-12 d-flex justify-content-center">
                  <ul className="menu-filters isotope-filters">
                    {categories.map((cat) => (
                      <li
                        key={cat.id}
                        className={selectedCategoryId === cat.id ? "filter-active" : ""}
                        onClick={() => {
                          setSelectedCategoryId(cat.id);
                          setPage(1);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {cat.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="row isotope-container" data-aos="fade-up" data-aos-delay={200} ref={containerRef}>
                {foods.map((food) => (
                  <div key={food.id} className={`col-lg-6 menu-item isotope-item ${food.filterClass}`}>
                    <img src={food.imageUrl} className="menu-img" alt={food.name} />
                    <div className="menu-content">
                      <a href="#!">{food.name}</a><span>{food.price.toLocaleString()}₫</span>
                    </div>
                    <div className="menu-ingredients">
                      {food.description || "No description"}
                    </div>
                  </div>
                ))}
              </div>

             {totalPages > 1 && (
  <div className="row mt-4 justify-content-center">
    <Pagination>
      <Pagination.Prev disabled={page === 1} onClick={() => setPage(page - 1)} />
      {Array.from({ length: totalPages }, (_, i) => (
        <Pagination.Item
          key={i + 1}
          active={i + 1 === page}
          onClick={() => setPage(i + 1)}
        >
          {i + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next disabled={page === totalPages} onClick={() => setPage(page + 1)} />
    </Pagination>
  </div>
)}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default Menu;
