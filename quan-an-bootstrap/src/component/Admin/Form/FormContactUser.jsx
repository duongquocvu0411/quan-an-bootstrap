import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DarkModeContext } from '../DarkModeContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../Page/Sidebar';
import { getContactUserById, replyToContactUser } from './../../../be/Admin/Contact/ContactUserAdmin.api';


const FormContactUser = ({ mode }) => {
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [replyMessage, setReplyMessage] = useState('');
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await getContactUserById(id);
        if (response.isSuccess) {
          setContact(response.data);
        } else {
          toast.error(response.message || 'Không tìm thấy liên hệ');
        }
      } catch (error) {
        toast.error("Lỗi khi tải thông tin liên hệ");
      }
    };
    fetchContact();
  }, [id]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) {
      toast.warning("Vui lòng nhập nội dung phản hồi");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        contactUserId: parseInt(id),
        replyMessage
      };
      const res = await replyToContactUser(payload);
      toast.success(res.message || 'Phản hồi thành công');
      navigate('/admin/contact-users');
    } catch (err) {
      toast.error(err.message || 'Lỗi khi gửi phản hồi');
    } finally {
      setLoading(false);
    }
  };

  if (!contact) return <div>Loading...</div>;

  return (
    <div className={`d-flex ${darkMode ? 'bg-dark text-light' : ''}`}>
      <Sidebar />
      <div className="container py-4" style={{ marginLeft: '250px' }}>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/admin/dashboard">Dashboard</a>
            </li>
            <li className="breadcrumb-item">
              <a href="/admin/contact-users">Liên hệ</a>
            </li>
            <li className="breadcrumb-item active">
              {mode === 'reply' ? <><i className="bi bi-reply-fill me-1"></i>Phản hồi</> : <>Chi tiết</>}
            </li>
          </ol>
        </nav>

        <button className="btn btn-outline-secondary mb-3" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left-circle me-1"></i> Quay lại danh sách
        </button>

        <div className="card shadow-sm">
          <div className="card-header bg-primary text-white d-flex align-items-center">
            <i className="bi bi-person-lines-fill me-2 fs-5"></i>
            <h5 className="mb-0">Thông tin liên hệ</h5>
          </div>

          <div className="card-body">
            <p><i className="bi bi-person-fill me-2 text-info"></i><strong>Họ tên:</strong> {contact.yourName}</p>
            <p><i className="bi bi-envelope-fill me-2 text-warning"></i><strong>Email:</strong> {contact.email}</p>
            <p><i className="bi bi-telephone-fill me-2 text-success"></i><strong>Điện thoại:</strong> {contact.phone}</p>
            <p><i className="bi bi-chat-right-dots-fill me-2 text-danger"></i><strong>Tiêu đề:</strong> {contact.subject}</p>
            <p><i className="bi bi-stickies-fill me-2 text-secondary"></i><strong>Nội dung:</strong> {contact.message}</p>
            <p><i className="bi bi-calendar-event-fill me-2 text-muted"></i><strong>Ngày gửi:</strong> {new Date(contact.createdAt).toLocaleString('vi-VN')}</p>
            <p>
              <i className="bi bi-info-circle-fill me-2 text-dark"></i>
              <strong>Trạng thái:</strong>{' '}
              {contact.isReplied ? (
                <span className="badge bg-success"><i className="bi bi-check-circle me-1"></i>Đã phản hồi</span>
              ) : (
                <span className="badge bg-danger"><i className="bi bi-x-circle me-1"></i>Chưa phản hồi</span>
              )}
            </p>

            {contact.isReplied && contact.contactUserReply && (
              <div className="mt-4 border-top pt-3">
                <h6 className="fw-bold"><i className="bi bi-chat-left-quote-fill text-success me-2"></i>Nội dung phản hồi</h6>
                <p className="border p-3 rounded bg-light text-dark">
                  {contact.contactUserReply.replyMessage}
                </p>
                <p className="text-muted">
                  <i className="bi bi-person-check-fill me-1"></i>Phản hồi bởi: {contact.repliedBy} | 
                  <i className="bi bi-clock-fill ms-2 me-1"></i>Thời gian: {new Date(contact.repliedAt).toLocaleString('vi-VN')}
                </p>
              </div>
            )}

            {mode === 'reply' && !contact.isReplied && (
              <>
                <hr />
                <form onSubmit={handleReply}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <i className="bi bi-pencil-square me-1 text-primary"></i>Nhập nội dung phản hồi
                    </label>
                    <textarea
                      className="form-control"
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={5}
                      placeholder="Nhập nội dung phản hồi tại đây..."
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Đang gửi...' : <><i className="bi bi-send-check-fill me-1"></i>Gửi phản hồi</>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default FormContactUser;
