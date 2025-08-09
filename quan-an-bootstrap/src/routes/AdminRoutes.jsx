import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../component/Admin/Page/Login';
import Dashboard from '../component/Admin/Page/Dasboard/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import FoodCategoryTable from '../component/Admin/Page/FoodCategoryTable';
import FoodCategoryForm from '../component/Admin/Form/FoodCategoryForm';
import { DarkModeProvider } from '../component/Admin/DarkModeContext';
import FoodsTable from '../component/Admin/Page/FoodsTable';
import FoodForm from '../component/Admin/Form/FoodForm';
import TableManagement from '../component/Admin/Page/TableManagement';
import TableForm from '../component/Admin/Form/TableForm';
import BookingDetail from '../component/Admin/Form/BookingDetailForm';
import BookingTable from '../component/Admin/Page/BookingTable';
import BankAccountTable from '../component/Admin/Page/BankAccountTable';
import BankAccountForm from '../component/Admin/Form/BankAccountForm';
import ContactUser from '../component/Admin/Page/ContactUser';
import FormContactUser from '../component/Admin/Form/FormContactUser';
import ContactAdmin from '../component/Admin/Page/ContactAdmin';
import FormContactAdmin from '../component/Admin/Form/FormContactAdmin';
import AboutAdmin from '../component/Admin/Page/AboutAdmin';
import FormAboutAdmin from '../component/Admin/Form/FormAboutAdmin';
import FeatureAdmin from '../component/Admin/Page/FeatureAdmin';
import FormFeatureAdmin from '../component/Admin/Form/FormFeatureAdmin';
import ChefsAdmin from '../component/Admin/Page/ChefsAdmin';
import FormChefsAdmin from '../component/Admin/Form/FormChefsAdmin';

const AdminRoutes = () => {
  return (
    <DarkModeProvider>
      <Routes>
        {/* Public Route: Login */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />

          {/* Food Categories */}
          <Route path="food-categories" element={<FoodCategoryTable />} />
          <Route path="food-categories/add" element={<FoodCategoryForm mode="add" />} />
          <Route path="food-categories/edit/:id" element={<FoodCategoryForm mode="edit" />} />
          <Route path="food-categories/detail/:id" element={<FoodCategoryForm mode="detail" />} />

          {/* Foods */}
          <Route path="foods" element={<FoodsTable />} />
          <Route path="foods/add" element={<FoodForm mode="add" />} />
          <Route path="foods/edit/:id" element={<FoodForm mode="edit" />} />
          <Route path="foods/detail/:id" element={<FoodForm mode="detail" />} />

          {/* Tables */}
          <Route path="tables" element={<TableManagement />} />
          <Route path="tables/add" element={<TableForm mode="add" />} />
          <Route path="tables/edit/:id" element={<TableForm mode="edit" />} />
          <Route path="tables/detail/:id" element={<TableForm mode="detail" />} />

          {/* Bookings */}
          <Route path="bookings" element={<BookingTable />} />
          <Route path="bookings/detail/:id" element={<BookingDetail />} />

          {/* Bank Accounts */}
          <Route path="bank-accounts" element={<BankAccountTable />} />
          <Route path="bank-accounts/add" element={<BankAccountForm mode="add" />} />
          <Route path="bank-accounts/edit/:id" element={<BankAccountForm mode="edit" />} />
          <Route path="bank-accounts/detail/:id" element={<BankAccountForm mode="detail" />} />

           {/* Contact Users */}
          <Route path="contact-users" element={<ContactUser />} />
          <Route path="contact-users/detail/:id" element={<FormContactUser mode="detail" />} />
          <Route path="contact-users/reply/:id" element={<FormContactUser mode="reply" />} />


          {/* ContactAdmin */}
          <Route path="/contact-admin" element={<ContactAdmin />} />
          <Route path="/contact-admin/add" element={<FormContactAdmin mode="add" />} />
          <Route path="/contact-admin/edit/:id" element={<FormContactAdmin mode="edit" />} />
          <Route path="/contact-admin/detail/:id" element={<FormContactAdmin mode="detail" />} />

          {/* About */}

          <Route path="/about-admin" element={<AboutAdmin />} />
          <Route path="/about/add" element={<FormAboutAdmin mode="add" />} />
          <Route path="/about/edit/:id" element={<FormAboutAdmin mode="edit" />} />
          <Route path="/about/detail/:id" element={<FormAboutAdmin mode="detail" />} />
        

          {/* features */}

          <Route path="/features" element={<FeatureAdmin />} />
          <Route path="/features/add" element={<FormFeatureAdmin mode="add" />} />
          <Route path="/features/edit/:id" element={<FormFeatureAdmin mode="edit" />} />
          <Route path="/features/detail/:id" element={<FormFeatureAdmin mode="detail" />} />



          {/* chefs */}
          <Route path="/chefs" element={<ChefsAdmin />} />
      <Route path="/chefs/add" element={<FormChefsAdmin mode="add" />} />
      <Route path="/chefs/edit/:id" element={<FormChefsAdmin mode="edit" />} />
      <Route path="/chefs/detail/:id" element={<FormChefsAdmin mode="detail" />} />
        </Route>
      </Routes>
    </DarkModeProvider>
  );
};

export default AdminRoutes;
