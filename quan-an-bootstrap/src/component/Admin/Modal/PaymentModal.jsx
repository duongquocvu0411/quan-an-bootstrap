import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { createPaymentQrForBooking } from '../../../be/Admin/Booking/Order.api';

const PaymentModal = ({ show, onHide, bookingId }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [qrData, setQrData] = useState(null);

  const handlePayment = async (method) => {
    if (method === 'cash') {
      toast.info('Chức năng thanh toán tiền mặt đang phát triển.');
      onHide();
    } else if (method === 'online') {
      setIsCreating(true);
      try {
        const res = await createPaymentQrForBooking(bookingId);
        if (res?.isSuccess) {
          setQrData(res.data);
        } else {
          toast.error(res?.message || 'Không thể tạo mã QR');
          onHide();
        }
      } catch (err) {
        console.error(err);
        toast.error('Lỗi khi tạo mã QR');
        onHide();
      } finally {
        setIsCreating(false);
      }
    }
  };

  const reset = () => {
    setQrData(null);
    onHide();
  };

  return (
    <Modal show={show} onHide={reset} centered>
      <Modal.Header closeButton>
        <Modal.Title>Chọn phương thức thanh toán</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!qrData ? (
          <div className="d-grid gap-2">
            <Button variant="secondary" onClick={() => handlePayment('cash')} disabled={isCreating}>
              Tiền mặt
            </Button>
            <Button variant="success" onClick={() => handlePayment('online')} disabled={isCreating}>
              Thanh toán Online (QR)
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-success">Đưa mã QR cho khách quét:</p>
            <img src={qrData.qrImageUrl} alt="QR Thanh toán" className="img-fluid mb-3" />
            <p>
              <strong>Ghi chú:</strong> {qrData.finalNote}
            </p>
            <Button variant="outline-primary" onClick={reset}>
              Đóng
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default PaymentModal;
