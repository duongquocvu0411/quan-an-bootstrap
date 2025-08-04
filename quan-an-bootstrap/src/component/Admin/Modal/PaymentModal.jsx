import React, { useState, useEffect } from 'react';
import { Modal, Button, Spinner } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { createPaymentQrForBooking } from '../../../be/Admin/Booking/Order.api';
import { getActiveBankAccounts, getBankLogoUrl } from '../../../be/Admin/Payment/payment.api';

const PaymentModal = ({ show, onHide, bookingId }) => {
  const [step, setStep] = useState('method'); // method | chooseBank | qr
  const [isCreating, setIsCreating] = useState(false);
  const [qrData, setQrData] = useState(null);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [selectedBankId, setSelectedBankId] = useState(null);
  const [loadingBanks, setLoadingBanks] = useState(false);

  useEffect(() => {
    if (show && step === 'chooseBank') {
      fetchBankAccounts();
    }
  }, [show, step]);

  // Lấy danh sách tài khoản + logo từ BIN
  const fetchBankAccounts = async () => {
    setLoadingBanks(true);
    try {
      const accounts = await getActiveBankAccounts();
      const accountsWithLogos = await Promise.all(
        accounts.map(async (bank) => {
          const logo = await getBankLogoUrl(bank.bankBin);
          return { ...bank, logo };
        })
      );
      setBankAccounts(accountsWithLogos);
    } catch (error) {
      toast.error('Không thể tải danh sách ngân hàng');
    } finally {
      setLoadingBanks(false);
    }
  };

  const handlePayment = (method) => {
    if (method === 'cash') {
      toast.info('Chức năng thanh toán tiền mặt đang phát triển.');
      onHide();
    } else if (method === 'online') {
      setStep('chooseBank');
    }
  };

  const handleBankSelection = async (bankId) => {
    setSelectedBankId(bankId);
    setIsCreating(true);
    try {
      const res = await createPaymentQrForBooking(bookingId, bankId);
      if (res?.isSuccess) {
        setQrData(res.data);
        setStep('qr');
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
  };

  const reset = () => {
    setStep('method');
    setQrData(null);
    setSelectedBankId(null);
    onHide();
  };

  return (
    <Modal show={show} onHide={reset} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Thanh toán</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {step === 'method' && (
          <div className="d-grid gap-2">
            <Button variant="secondary" onClick={() => handlePayment('cash')} disabled={isCreating}>
              Tiền mặt
            </Button>
            <Button variant="success" onClick={() => handlePayment('online')} disabled={isCreating}>
              Thanh toán Online (QR)
            </Button>
          </div>
        )}

        {step === 'chooseBank' && (
          <>
            <p>Chọn tài khoản ngân hàng để tạo mã QR:</p>
            {loadingBanks ? (
              <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Đang tải danh sách tài khoản...</p>
              </div>
            ) : (
              <div className="row">
                {bankAccounts.map((bank) => (
                  <div className="col-12 col-md-6 col-lg-4 mb-3" key={bank.id}>
                    <div
                      className={`card h-100 border ${selectedBankId === bank.id ? 'border-success' : ''}`}
                      onClick={() => !isCreating && handleBankSelection(bank.id)}
                      style={{ cursor: isCreating ? 'not-allowed' : 'pointer' }}
                    >
                      <div className="card-body text-center">
                        {bank.logo && (
                          <img
                            src={bank.logo}
                            alt="Bank logo"
                            className="mb-2"
                            style={{ height: '40px' }}
                          />
                        )}
                        <h6 className="mb-1">{bank.accountName}</h6>
                        <p className="mb-0">
                          <strong>{bank.accountNumber}</strong>
                        </p>
                        <small className="text-muted">BIN: {bank.bankBin}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {isCreating && (
              <div className="text-center mt-3">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Đang tạo mã QR...</p>
              </div>
            )}
          </>
        )}

        {step === 'qr' && qrData && (
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
