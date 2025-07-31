import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Spinner,
  Alert,
  Table,
  Row,
  Col,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";

import {
  lookupBooking,
  updateBookingStatus
} from "../../../be/Admin/Booking/Booking.api";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarcode,
  faEnvelope,
  faPhone,
  faUser,
  faSearch,
  faTable,
  faPenToSquare,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";

const BookingLookupModal = ({ show, onHide }) => {
  const [formData, setFormData] = useState({
    bookingCode: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    tableId: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editedStatus, setEditedStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  const statusOptions = ["Booked", "CheckedIn", "Completed", "Canceled"];

  const isFormValid = () =>
    !!(
      formData.bookingCode ||
      formData.customerName ||
      formData.customerEmail ||
      formData.customerPhone ||
      formData.tableId
    );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async () => {
    if (!isFormValid()) return;

    setLoading(true);
    setErrorMsg("");
    setResult(null);
    setIsEditing(false);

    const payload = {
      bookingCode: formData.bookingCode,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      tableId: formData.tableId ? parseInt(formData.tableId) : undefined
    };

    try {
      const res = await lookupBooking(payload);
      if (res?.isSuccess && res?.data) {
        setResult(res.data);
      } else {
        setErrorMsg(res?.message || "Không tìm thấy kết quả.");
      }
    } catch (err) {
      setErrorMsg("Đã xảy ra lỗi khi tra cứu.");
    } finally {
      setLoading(false);
    }
  };



const handleUpdateStatus = async () => {
  if (!editedStatus || !result?.id) return;

  setUpdating(true);
  try {
    const res = await updateBookingStatus(result.id, editedStatus);

    if (res?.code === 200) {
      toast.success(res?.message || "Cập nhật thành công.", { autoClose: 3000 });
      setResult((prev) => ({ ...prev, status: editedStatus }));
      setIsEditing(false);
    } else {
      toast.error(res?.message || "Cập nhật thất bại.", { autoClose: 3000 });
    }
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error);

    const message = error?.response?.data?.message;
    const code = error?.response?.data?.code;

    toast.error(message || `Đã xảy ra lỗi (${code || "unknown"})`, { autoClose: 3000 });
  } finally {
    setUpdating(false);
  }
};





  const renderTooltip = (props) => (
    <Tooltip {...props}>Nhập ít nhất một trường để tra cứu</Tooltip>
  );

  return (
    <>
    <Modal show={show} onHide={onHide} centered backdrop="static" size="lg">
      <Modal.Header closeButton>
        <Modal.Title>🔎 Tra cứu đơn đặt bàn</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>
                <FontAwesomeIcon icon={faBarcode} className="me-1" /> Mã đơn đặt bàn
              </Form.Label>
              <Form.Control
                type="text"
                name="bookingCode"
                value={formData.bookingCode}
                placeholder="VD: BK-20250731-XXXXXX"
                onChange={handleChange}
              />
            </Col>
            <Col md={6}>
              <Form.Label>
                <FontAwesomeIcon icon={faUser} className="me-1" /> Tên khách hàng
              </Form.Label>
              <Form.Control
                type="text"
                name="customerName"
                value={formData.customerName}
                placeholder="Nhập tên..."
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>
                <FontAwesomeIcon icon={faEnvelope} className="me-1" /> Email
              </Form.Label>
              <Form.Control
                type="email"
                name="customerEmail"
                value={formData.customerEmail}
                placeholder="Nhập email..."
                onChange={handleChange}
              />
            </Col>
            <Col md={6}>
              <Form.Label>
                <FontAwesomeIcon icon={faPhone} className="me-1" /> Số điện thoại
              </Form.Label>
              <Form.Control
                type="text"
                name="customerPhone"
                value={formData.customerPhone}
                placeholder="Nhập SĐT..."
                onChange={handleChange}
              />
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>
              <FontAwesomeIcon icon={faTable} className="me-1" /> ID bàn (tuỳ chọn)
            </Form.Label>
            <Form.Control
              type="number"
              name="tableId"
              value={formData.tableId}
              placeholder="Nhập ID bàn..."
              onChange={handleChange}
            />
          </Form.Group>

          <div className="text-end">
            {!isFormValid() ? (
              <OverlayTrigger placement="top" overlay={renderTooltip}>
                <span className="d-inline-block">
                  <Button variant="primary" disabled style={{ pointerEvents: "none" }}>
                    <FontAwesomeIcon icon={faSearch} className="me-1" />
                    Tìm kiếm
                  </Button>
                </span>
              </OverlayTrigger>
            ) : (
              <Button variant="primary" onClick={handleSearch} disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Đang tìm...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSearch} className="me-1" />
                    Tìm kiếm
                  </>
                )}
              </Button>
            )}
          </div>
        </Form>

        {errorMsg && (
          <Alert variant="danger" className="mt-3">
            {errorMsg}
          </Alert>
        )}

        {result && (
          <div className="mt-4">
            <h6>Kết quả tra cứu:</h6>
            <Table bordered striped hover responsive>
              <tbody>
                <tr><th>Mã đơn</th><td>{result.bookingCode}</td></tr>
                <tr><th>Tên KH</th><td>{result.customerName}</td></tr>
                <tr><th>Email</th><td>{result.customerEmail}</td></tr>
                <tr><th>SĐT</th><td>{result.customerPhone}</td></tr>
                <tr><th>Thời gian</th><td>{new Date(result.bookingTime).toLocaleString()}</td></tr>
                <tr><th>Số khách</th><td>{result.guestCount}</td></tr>
                <tr>
                  <th>Trạng thái</th>
                  <td>
                    {isEditing ? (
                      <Form.Select
                        value={editedStatus}
                        onChange={(e) => setEditedStatus(e.target.value)}
                        size="sm"
                      >
                        <option value="">-- Chọn trạng thái --</option>
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </Form.Select>
                    ) : (
                      result.status
                    )}
                  </td>
                </tr>
                <tr><th>Số bàn</th><td>{result.tableNumber}</td></tr>
                <tr><th>Ghi chú</th><td>{result.note}</td></tr>
              </tbody>
            </Table>

            <div className="text-end mt-3">
              {!isEditing ? (
                <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => {
                    setEditedStatus(result.status);
                    setIsEditing(true);
                    }}
                >
                    <FontAwesomeIcon icon={faPenToSquare} className="me-1" />
                    Chỉnh sửa trạng thái
                </Button>
                ) : (
                <Button
                    variant="success"
                    size="sm"
                    onClick={handleUpdateStatus}
                    disabled={!editedStatus || updating}
                >
                    {updating ? (
                    <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Đang cập nhật...
                    </>
                    ) : (
                    <>
                        <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                        Cập nhật
                    </>
                    )}
                </Button>
                )}

            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Đóng</Button>
      </Modal.Footer>
     
    </Modal>
     <ToastContainer/>
     </>
  );
};

export default BookingLookupModal;
