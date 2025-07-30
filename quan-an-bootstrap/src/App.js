import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientRoutes from './routes/ClientRoutes';
import AdminRoutes from './routes/AdminRoutes';
import { useRestaurantlyUI } from './component/hook/useRestaurantlyUI';
import { ToastContainer } from 'react-toastify';

function App() {
  useRestaurantlyUI();
  return (
  
    <Router>
      <Routes>
        {/* Routes cho client (hiển thị header/footer) */}
        <Route path="/*" element={<ClientRoutes />} />

        {/* Routes cho admin (không hiển thị header/footer) */}
        <Route path="/admin/*" element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <AdminRoutes />
          </React.Suspense>
        } />
      </Routes>
     
    </Router>

  );
}

export default App;