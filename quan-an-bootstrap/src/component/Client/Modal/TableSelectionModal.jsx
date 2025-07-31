import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Row,
  Col,
  Card,
  Spinner,
  Form,
  Badge,
} from "react-bootstrap";
import TableDetailModal from "./TableDetailModal";
import { getSuggestedTables, getTableClientDetailById } from "../../../be/Client/table_suggestion.api";
import ReactPaginate from "react-paginate";

function TableSelectionModal({ show, onHide, onConfirm, peopleCount }) {
  const [pagedData, setPagedData] = useState({
    currentPage: 1,
    pageSize: 6,
    totalCount: 0,
    totalPages: 0,
    results: [],
  });

  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [tableToShow, setTableToShow] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSuggested = async (page = 1) => {
    setLoading(true);
    const res = await getSuggestedTables(
      peopleCount,
      page,
      pagedData.pageSize
    );
    setPagedData(res);
    setLoading(false);
  };

  useEffect(() => {
    if (show && peopleCount) {
      fetchSuggested(1);
      setSelected(null);
      setFilterStatus("");
    }
  }, [show, peopleCount]);

  const handleClick = async (table) => {
    if (!table?.id) return;

    const detail = await getTableClientDetailById(table.id);
    if (detail) {
        setTableToShow(detail);
        setShowDetail(true);
        
        if (detail.status === "Available") {
            setSelected(detail); // chỉ chọn nếu còn trống
        } else{
            setSelected(null); // reset nếu đã bị đổi trạng thái
        }
        
    }
  }

  const handleConfirm = () => {
    onConfirm(selected);
    setSelected(null);
  };

  const handlePageChange = (selectedPage) => {
    const newPage = selectedPage.selected + 1;
    fetchSuggested(newPage);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Available":
        return <Badge bg="success">Còn trống</Badge>;
      case "Reserved":
        return <Badge bg="warning" text="dark">Đã đặt</Badge>;
      case "Occupied":
        return <Badge bg="danger">Đang dùng</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const filteredTables = filterStatus
    ? pagedData.results.filter((t) => t.status === filterStatus)
    : pagedData.results;

  return (
    <>
      <Modal show={show} onHide={onHide} fullscreen centered backdrop="static">
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>
            <i className="bi bi-layout-wtf me-2"></i> Chọn bàn cho {peopleCount} khách
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-light">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Form.Select
              style={{ maxWidth: "250px" }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Available">Còn trống</option>
              <option value="Reserved">Đã đặt</option>
              <option value="Occupied">Đang sử dụng</option>
            </Form.Select>
            <span className="text-muted">
              Tổng số bàn: {pagedData.totalCount}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="warning" />
              <p className="mt-2">Đang tải danh sách bàn phù hợp...</p>
            </div>
          ) : filteredTables.length > 0 ? (
            <>
              <Row xs={1} md={2} lg={3} className="g-4">
                {filteredTables.map((table) => (
                  <Col key={table.id}>
                    <Card
                      className={`shadow-sm border border-3 ${
                        selected?.id === table.id
                          ? "border-success bg-light"
                          : "border-primary"
                      }`}
                      onClick={() => handleClick(table)}
                      style={{
                        cursor: "pointer",
                        minHeight: "230px",
                        position: "relative",
                      }}
                    >
                      <Card.Body>
                        <h5>
                          <i className="bi bi-table text-primary me-2"></i>
                          Bàn <strong>{table.tableNumber}</strong>
                        </h5>
                        <p className="mb-1">
                          <i className="bi bi-people-fill text-success me-2"></i>
                          Sức chứa: <strong>{table.capacity}</strong>
                        </p>
                        <p className="mb-1">
                          <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                          {table.location}
                        </p>
                        <p className="mb-1">
                          <i className="bi bi-circle-fill me-2 text-info"></i>
                          {getStatusBadge(table.status)}
                        </p>
                        {selected?.id === table.id && (
                          <i
                            className="bi bi-check-circle-fill text-success"
                            style={{
                              position: "absolute",
                              top: "10px",
                              right: "10px",
                              fontSize: "1.5rem",
                            }}
                          />
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <div className="mt-4">
                <ReactPaginate
                  pageCount={pagedData.totalPages}
                  onPageChange={handlePageChange}
                  forcePage={pagedData.currentPage - 1}
                  containerClassName="pagination justify-content-center"
                  pageClassName="page-item"
                  pageLinkClassName="page-link"
                  previousLabel="←"
                  nextLabel="→"
                  previousClassName="page-item"
                  previousLinkClassName="page-link"
                  nextClassName="page-item"
                  nextLinkClassName="page-link"
                  activeClassName="active"
                />
              </div>
            </>
          ) : (
            <p className="text-muted">
              Không có bàn phù hợp với số lượng khách đã nhập.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer className="bg-light">
          <Button variant="secondary" onClick={onHide}>
            <i className="bi bi-x-circle me-1"></i> Đóng
          </Button>
          <Button variant="success" onClick={handleConfirm} disabled={!selected}>
            <i className="bi bi-check2-circle me-1"></i> Xác nhận chọn bàn
          </Button>
        </Modal.Footer>
      </Modal>

      {showDetail && tableToShow && (
        <TableDetailModal
          table={tableToShow}
          show={showDetail}
          onHide={() => setShowDetail(false)}
        />
      )}
    </>
  );
}

export default TableSelectionModal;
