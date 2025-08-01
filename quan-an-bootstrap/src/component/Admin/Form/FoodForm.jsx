import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DarkModeContext } from '../DarkModeContext';
import Sidebar from '../Page/Sidebar';
import moment from 'moment';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { getAllCategories } from './../../../be/Admin/category/category.api';
import { addFood, getFoodById, updateFood } from '../../../be/Admin/Foods/Foods.api';
import {  toast, ToastContainer } from 'react-toastify';


const FoodForm = ({ mode }) => {
  const { darkMode } = useContext(DarkModeContext);
 
  const navigate = useNavigate();
  const { id } = useParams();

  const [food, setFood] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
    categoryId: '',
    categoryName: '',
    detailDescription: '',
    ingredients: '',
    cookingMethod: '',
    calories: '',
    preparationTimeMinutes: '',
    additionalImages: [],
    createdAt: '',
    createdBy: '',
    updatedAt: '',
    updatedBy: ''
  });

  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
  const [categories,setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const isDetail = mode === 'detail';
  const isEdit = mode === 'edit';

  useEffect(() => {
fetchCategories();

    if (isEdit || isDetail) {
     fetchFood();
    }
  }, [id, mode]);

  const fetchCategories = async () => {
    try{
        const res = await getAllCategories();
        setCategories(res);
    }catch (error) {
      console.error('Lỗi khi lấy danh sách danh mục:', error);
    }
  }
const fetchFood = async () => {
    try {
      const result = await getFoodById(id);
      setFood(result);
    } catch (err) {
      console.error(err);
    }
  };
 const handleChange = (e) => {
    const { name, value } = e.target;
    setFood((prev) => ({ ...prev, [name]: value }));
  };

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setMainImageFile(file); // lưu file để POST
    const previewUrl = URL.createObjectURL(file); // dùng cho hiển thị
    setFood((prev) => ({ ...prev, imageUrl: previewUrl }));
  }
};


const handleAdditionalImagesUpload = (e) => {
  const files = Array.from(e.target.files);
  setAdditionalImageFiles((prev) => [...prev, ...files]); // lưu file để POST

  const previewUrls = files.map((file) => URL.createObjectURL(file));
  setFood((prev) => ({
    ...prev,
    additionalImages: [...prev.additionalImages, ...previewUrls], // dùng URL cho hiển thị
  }));
};


const handleRemoveAdditionalImage = (indexToRemove) => {
  setFood((prev) => ({
    ...prev,
    additionalImages: prev.additionalImages.filter((_, index) => index !== indexToRemove),
  }));

  setAdditionalImageFiles((prev) =>
    prev.filter((_, index) => index !== indexToRemove)
  );
};


const handleReplaceAdditionalImage = (e, index) => {
  const file = e.target.files[0];
  if (file) {
    const newPreviewUrl = URL.createObjectURL(file);

    // Cập nhật preview ảnh
    setFood((prev) => {
      const updatedImages = [...prev.additionalImages];
      updatedImages[index] = newPreviewUrl;
      return { ...prev, additionalImages: updatedImages };
    });

    // Cập nhật file tương ứng
    setAdditionalImageFiles((prev) => {
      const updatedFiles = [...prev];
      updatedFiles[index] = file;
      return updatedFiles;
    });
  }
};

const fetchImageAsFile = async (url, filename) => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type });
};


const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const formData = new FormData();
    formData.append('CategoryId', food.categoryId);
    formData.append('Name', food.name);
    if (food.price !== '') formData.append('Price', food.price);
    if (food.description) formData.append('Description', food.description);

    // Ảnh chính
    if (mainImageFile) {
      formData.append('ImageUrl', mainImageFile);
    } else if (food.imageUrl && typeof food.imageUrl === 'string') {
      const imageFile = await fetchImageAsFile(food.imageUrl, 'main.jpg');
      formData.append('ImageUrl', imageFile);
    }

    // Chi tiết
    if (food.detailDescription) formData.append('DetailDescription', food.detailDescription);
    if (food.ingredients) formData.append('Ingredients', food.ingredients);
    if (food.cookingMethod) formData.append('CookingMethod', food.cookingMethod);
    if (food.calories !== '') formData.append('Calories', food.calories);
    if (food.preparationTimeMinutes !== '') formData.append('PreparationTimeMinutes', food.preparationTimeMinutes);

    // Ảnh phụ
    if (additionalImageFiles.length > 0) {
      additionalImageFiles.forEach(file => formData.append('AdditionalImages', file));
    } else {
      for (let i = 0; i < food.additionalImages.length; i++) {
        const file = await fetchImageAsFile(food.additionalImages[i], `sub-${i}.jpg`);
        formData.append('AdditionalImages', file);
      }
    }

    if (mode === 'add') {
      await addFood(formData);
      toast.success(' Thêm món ăn thành công');

      setMainImageFile(null);
      setAdditionalImageFiles([]);
      setTimeout(() => {
    navigate('/admin/foods');
  }, 1000);
    } else if (mode === 'edit') {
      await updateFood(id, formData);
      toast.success(' Cập nhật món ăn thành công');
      setTimeout(() => {
    navigate('/admin/foods');
  }, 1000); // Điều hướng sau toast
    }
  } catch (error) {
    console.error('Lỗi khi thêm/cập nhật món ăn:', error);
    toast.error(' Đã xảy ra lỗi, vui lòng thử lại!');
  } finally {
    setLoading(false);
  }
};




  const allImages = [food.imageUrl, ...food.additionalImages].filter(Boolean);

  return (
    <div className={`d-flex ${darkMode ? 'bg-dark text-light' : 'bg-light text-dark'}`}>
      <Sidebar />
      <div className="container py-4" style={{ marginLeft: '250px' }}>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="/admin/dashboard">Dashboard</a></li>
            <li className="breadcrumb-item"><a href="/admin/foods">Danh sách món ăn</a></li>
            <li className="breadcrumb-item active" aria-current="page">
              {mode === 'add' && 'Thêm'}
              {mode === 'edit' && 'Chỉnh sửa'}
              {mode === 'detail' && 'Chi tiết'}
            </li>
          </ol>
        </nav>

        <button className="btn btn-secondary mb-3" onClick={() => navigate('/admin/foods')}>
          ← Quay lại danh sách
        </button>

        <div className={`card shadow-sm ${darkMode ? 'bg-secondary text-white' : 'bg-white text-dark'}`}>
          <div className="card-body">
            <h4 className="mb-4 text-dark">
              <i className="bi bi-cup-straw me-2"></i>
              {mode === 'add' && 'Thêm món ăn'}
              {mode === 'edit' && 'Chỉnh sửa món ăn'}
              {mode === 'detail' && 'Chi tiết món ăn'}
            </h4>

            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Tên món</label>
                    <input type="text" className="form-control" name="name" value={food.name} onChange={handleChange} disabled={isDetail} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Giá (VND)</label>
                    <input type="number" className="form-control" name="price" value={food.price} onChange={handleChange} disabled={isDetail} required />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Danh mục</label>
                     <select
                      className="form-select"
                      name="categoryId"
                      value={food.categoryId}
                      onChange={handleChange}
                      disabled={isDetail}
                      required>
                          <option value="">-- Chọn danh mục --</option>
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                      </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Mô tả ngắn</label>
                    <textarea className="form-control" name="description" value={food.description} onChange={handleChange} disabled={isDetail} rows={3}></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Mô tả chi tiết</label>
                    <textarea className="form-control" name="detailDescription" value={food.detailDescription} onChange={handleChange} disabled={isDetail} rows={3}></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Nguyên liệu</label>
                    <textarea className="form-control" name="ingredients" value={food.ingredients} onChange={handleChange} disabled={isDetail} rows={3}></textarea>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Cách chế biến</label>
                    <textarea className="form-control" name="cookingMethod" value={food.cookingMethod} onChange={handleChange} disabled={isDetail} rows={3}></textarea>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Calories</label>
                    <input type="number" className="form-control" name="calories" value={food.calories} onChange={handleChange} disabled={isDetail} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Thời gian chuẩn bị (phút)</label>
                    <input type="number" className="form-control" name="preparationTimeMinutes" value={food.preparationTimeMinutes} onChange={handleChange} disabled={isDetail} />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Hình ảnh chính</label>
                    {food.imageUrl && (
                      <div onClick={() => { setLightboxIndex(0); setIsLightboxOpen(true); }} style={{ cursor: 'zoom-in' }}>
                        <img src={food.imageUrl} alt="preview" className="img-thumbnail mb-2" style={{ width: 120, height: 120, objectFit: 'cover' }} />
                      </div>
                    )}
                    {!isDetail && <input type="file" className="form-control" accept="image/*" onChange={handleImageUpload} />}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Ảnh phụ (nhiều)</label>
                    {!isDetail && <input type="file" className="form-control" accept="image/*" multiple onChange={handleAdditionalImagesUpload} />}
                    <div className="d-flex flex-wrap mt-2">
                     {food.additionalImages.map((img, i) => (
                        <div
                          key={i}
                          className="position-relative me-2 mb-2"
                          style={{ width: 100, height: 100 }}
                        >
                          <img
                            src={img}
                            alt={`sub-${i}`}
                            className="rounded border w-100 h-100"
                            style={{ objectFit: 'cover', cursor: 'zoom-in' }}
                            onClick={() => { setLightboxIndex(i + 1); setIsLightboxOpen(true); }}
                          />

                          {/* Nút xóa */}
                          {!isDetail && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleRemoveAdditionalImage(i); }}
                              className="btn btn-sm btn-danger position-absolute top-0 end-0 p-1"
                              style={{ transform: 'translate(30%, -30%)', borderRadius: '50%' }}
                            >
                              <i className="bi bi-x-lg" style={{ fontSize: '0.7rem' }}></i>
                            </button>
                          )}

                          {/* Nút chỉnh sửa (ẩn input file) */}
                          {!isDetail && (
                            <>
                              <button
                                type="button"
                                className="btn btn-sm btn-light position-absolute bottom-0 start-50 translate-middle-x"
                                style={{ borderRadius: '50%' }}
                                onClick={() => document.getElementById(`replace-input-${i}`).click()}
                              >
                                <i className="bi bi-pencil-fill text-primary"></i>
                              </button>

                              {/* input file ẩn */}
                              <input
                                type="file"
                                accept="image/*"
                                id={`replace-input-${i}`}
                                style={{ display: 'none' }}
                                onChange={(e) => handleReplaceAdditionalImage(e, i)}
                              />
                            </>
                          )}

                          {/* input file ẩn */}
                          <input
                            type="file"
                            accept="image/*"
                            id={`replace-input-${i}`}
                            style={{ display: 'none' }}
                            onChange={(e) => handleReplaceAdditionalImage(e, i)}
                          />
                        </div>
                      ))}

                    </div>
                  </div>
                </div>
              </div>

              {(isEdit || isDetail) && (
                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Ngày tạo</label>
                      <div className="form-control-plaintext">{moment(food.createdAt).format('DD/MM/YYYY HH:mm')}</div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Tạo bởi</label>
                      <div className="form-control-plaintext">{food.createdBy}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Cập nhật gần nhất</label>
                      <div className="form-control-plaintext">{moment(food.updatedAt).format('DD/MM/YYYY HH:mm')}</div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Cập nhật bởi</label>
                      <div className="form-control-plaintext">{food.updatedBy}</div>
                    </div>
                  </div>
                </div>
              )}

             {!isDetail && (
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    {mode === 'add' ? 'Thêm món' : 'Cập nhật'}
                  </>
                )}
              </button>
            )}
            </form>
          </div>
        </div>
      </div>

      {isLightboxOpen && (
        <Lightbox
          mainSrc={allImages[lightboxIndex]}
          nextSrc={allImages[(lightboxIndex + 1) % allImages.length]}
          prevSrc={allImages[(lightboxIndex + allImages.length - 1) % allImages.length]}
          onCloseRequest={() => setIsLightboxOpen(false)}
          onMovePrevRequest={() => setLightboxIndex((lightboxIndex + allImages.length - 1) % allImages.length)}
          onMoveNextRequest={() => setLightboxIndex((lightboxIndex + 1) % allImages.length)}
        />
      )}
       <ToastContainer/>
    </div>
  );
};

export default FoodForm;
