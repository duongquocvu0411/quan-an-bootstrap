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



const AdminRoutes = () => {
  return (
      <DarkModeProvider>
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="food-categories" element={<FoodCategoryTable />} />
        <Route path="/food-categories/add" element={<FoodCategoryForm mode="add" />} />
       <Route path="/food-categories/edit/:id" element={<FoodCategoryForm mode="edit" />} />
      <Route path="/food-categories/detail/:id" element={<FoodCategoryForm mode="detail" />} />


      {/* foods */}
      <Route path="foods" element={<FoodsTable />} />
      <Route path="foods/add" element={<FoodForm mode="add" />} />
      <Route path="foods/edit/:id" element={<FoodForm mode="edit" />} />
      <Route path="foods/detail/:id" element={<FoodForm mode="detail" />} />


        {/* Table */}
        <Route path="tables" element={<TableManagement />} />
        <Route path="tables/add" element={<TableForm mode="add" />} />
        <Route path="tables/edit/:id" element={<TableForm mode="edit" />} />
        <Route path="tables/detail/:id" element={<TableForm mode="detail" />} />

        {/* booking */}
        <Route path="bookings" element={<BookingTable />} />
        <Route path="bookings/detail/:id" element={<BookingDetail />} />

        {/* Bankking */}
        <Route path="/bank-accounts" element={<BankAccountTable />} />
        <Route path="/bank-accounts/add" element={<BankAccountForm mode="add" />} />
        <Route path="/bank-accounts/edit/:id" element={<BankAccountForm mode="edit" />} />
        <Route path="/bank-accounts/detail/:id" element={<BankAccountForm mode="detail" />} />

      </Route>
    </Routes></DarkModeProvider>
  );
};

export default AdminRoutes;
