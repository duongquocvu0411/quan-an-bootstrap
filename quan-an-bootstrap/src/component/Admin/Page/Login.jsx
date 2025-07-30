import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';  // Import toast
import { login } from '../../../be/Admin/Login.api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Hàm xử lý login
 const handleLogin = async (e) => {
  e.preventDefault();

  if (loading) return; // Ngăn spam nếu đang xử lý

  setLoading(true); // Bắt đầu loading

  const response = await login(username, password, rememberMe);

  if (response.success) {
    toast.success('Đăng nhập thành công!');
    setTimeout(() => {
      navigate('/admin/dashboard');
    }, 1500);
  } else {
    toast.error(response.message || 'Đăng nhập thất bại');
  }

  setLoading(false); // Kết thúc loading
};


  return (
    <section id="login" className="d-flex align-items-center justify-content-center vh-100 bg-dark text-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8">
            <div className="card bg-secondary border-0 rounded shadow-lg">
              <div className="card-body p-5">
                <h3 className="text-center mb-4 text-white">Đăng nhập tài khoản</h3>
                <form onSubmit={handleLogin}>
                  {/* Username Field */}
                  <div className="form-group mb-3">
                    <label htmlFor="username" className="text-light">Tên tài khoản</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      placeholder="Nhập tên tài khoản"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  {/* Password Field */}
                  <div className="form-group mb-4">
                    <label htmlFor="password" className="text-light">Mật khẩu</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {/* Remember Me Checkbox */}
                  <div className="form-check mb-4">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                    />
                    <label className="form-check-label text-light" htmlFor="rememberMe">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>

                  {/* Login Button */}
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                </form>

                {/* Forgot Password Link */}
                <div className="text-center mt-3">
                  <a href="#" className="text-light small">Quên mật khẩu?</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Login;
