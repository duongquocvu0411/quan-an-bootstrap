import React, { useState } from "react";
import { Modal, Button, Row, Col, ListGroup } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Zoom } from "swiper/modules";
import Lightbox from "react-image-lightbox";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import 'react-image-lightbox/style.css';

function TableDetailModal({ table, show, onHide }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  return (
    <>
      <Modal show={show} onHide={onHide} fullscreen centered backdrop="static">
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>
            <i className="bi bi-table me-2 text-warning"></i>
            Chi tiết bàn {table.tableNumber}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <Row className="g-4">
            {/* Hình ảnh bàn */}
            <Col md={6}>
              {table.images && table.images.length > 0 ? (
                <Swiper
                  modules={[Navigation, Pagination, Zoom]}
                  navigation
                  pagination={{ clickable: true }}
                  zoom
                  spaceBetween={10}
                  slidesPerView={1}
                  className="rounded shadow"
                >
                  {table.images.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div className="swiper-zoom-container">
                        <img
                          src={img}
                          alt={`Bàn ${table.tableNumber} - ảnh ${index + 1}`}
                          className="img-fluid w-100 rounded"
                          style={{
                            maxHeight: "450px",
                            objectFit: "cover",
                            cursor: "zoom-in",
                          }}
                          onClick={() => {
                            setPhotoIndex(index);
                            setLightboxOpen(true);
                          }}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <p className="text-muted">Không có ảnh cho bàn này.</p>
              )}
            </Col>

            {/* Thông tin chi tiết */}
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <i className="bi bi-tag-fill me-2 text-primary"></i>
                  <strong>Số bàn:</strong> {table.tableNumber}
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="bi bi-people-fill me-2 text-success"></i>
                  <strong>Sức chứa:</strong> {table.capacity} người
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="bi bi-circle-fill me-2 text-info"></i>
                  <strong>Trạng thái:</strong>{" "}
                  <span className={`badge ${
                    table.status === "Available"
                      ? "bg-success"
                      : table.status === "Reserved"
                      ? "bg-warning text-dark"
                      : "bg-danger"
                  }`}>
                    {table.status === "Available"
                      ? "Còn trống"
                      : table.status === "Reserved"
                      ? "Đã đặt"
                      : "Đang dùng"}
                  </span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="bi bi-geo-alt-fill me-2 text-danger"></i>
                  <strong>Vị trí:</strong> {table.location}
                </ListGroup.Item>
                <ListGroup.Item>
                  <i className="bi bi-hash me-2 text-secondary"></i>
                  <strong>ID bàn:</strong> #{table.id}
                </ListGroup.Item>
                <ListGroup.Item className="mt-3 text-muted fst-italic">
                  * Nhấp vào ảnh để xem chi tiết trong chế độ toàn màn hình.
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={onHide}>
            <i className="bi bi-x-circle me-1"></i> Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Lightbox toàn màn hình */}
      {lightboxOpen && table.images?.length > 0 && (
        <Lightbox
          mainSrc={table.images[photoIndex]}
          nextSrc={table.images[(photoIndex + 1) % table.images.length]}
          prevSrc={table.images[(photoIndex + table.images.length - 1) % table.images.length]}
          onCloseRequest={() => setLightboxOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + table.images.length - 1) % table.images.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % table.images.length)
          }
          imageCaption={`Bàn ${table.tableNumber} - ảnh ${photoIndex + 1}`}
        />
      )}
    </>
  );
}

export default TableDetailModal;
