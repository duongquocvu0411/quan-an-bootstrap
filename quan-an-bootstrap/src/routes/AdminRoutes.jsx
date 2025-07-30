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

      </Route>
    </Routes></DarkModeProvider>
  );
};

export default AdminRoutes;
