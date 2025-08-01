import React, { useEffect, useState } from 'react';
import {
  Modal,
  Button,
  Form,
  Row,
  Col,
  Badge,
  InputGroup,
  Spinner,
  Card,
  ListGroup
} from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { getAllFoods } from './../../../be/Admin/Foods/Foods.api';
import FoodDetailBookingModal from './FoodDetailBookingModal';
import { toast, ToastContainer } from 'react-toastify';
import { createTableOrder } from '../../../be/Admin/Booking/Order.api';

const OrderModal = ({ show, onHide, onSave ,bookingId}) => {
  const [foodList, setFoodList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(0); // ReactPaginate dùng 0-index
  const [pageSize] = useState(6);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    if (show) {
      setCurrentPage(0);
      fetchFoods(1);
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      fetchFoods(currentPage + 1);
    }
  }, [currentPage]);

  const fetchFoods = async (page) => {
    try {
      setLoading(true);
      const { foods, totalPages } = await getAllFoods(page, pageSize);
      setFoodList(foods);
      setPageCount(totalPages);
    } catch (error) {
      console.error('Lỗi khi lấy món ăn:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Tất cả', ...new Set(foodList.map(f => f.categoryName))];

  const filteredFoods = foodList.filter(f =>
    (selectedCategory === 'Tất cả' || f.categoryName === selectedCategory) &&
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleFoodClick = (food) => {
    setSelectedFood(food);
    setShowDetail(true);
  };

  const addToCart = (form) => {
    setCart(prev => {
      const existing = prev.find(item => item.foodId === selectedFood.id);
      if (existing) {
        return prev.map(item =>
          item.foodId === selectedFood.id
            ? { ...item, quantity: item.quantity + form.quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          foodId: selectedFood.id,
          foodName: selectedFood.name,
          quantity: form.quantity,
          note: form.note,
          price: selectedFood.price
        }
      ];
    });
    setShowDetail(false);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.foodId !== id));
  };

  const updateQuantity = (foodId, newQty) => {
    if (newQty < 1) return;
    setCart(prev =>
      prev.map(item =>
        item.foodId === foodId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

   const handleConfirm = async () =>{
    if (!bookingId || cart.length === 0){
        toast.warning('vui lòng chọn ít nhất 1 món ăn');
        return;
    }

    const payload = {
        bookingId: bookingId,
        items: cart.map(({foodId, quantity,note}) => ({ foodId,quantity,note}))
    };
console.log(JSON.stringify(payload, null, 2));
    
    if(loading) return; // chống double-click
    setLoading(true);
    try{

        const res = await createTableOrder(payload);
        toast.success(res.message || "Gọi món thành công");

        onSave(res.data);

        setCart([]);
        onHide();

    }catch( err){
        toast.error(err?.message || " gọi món thất bại");
    }finally{
        setLoading(false);
    }
   }

  return (
    <>
      <Modal show={show} onHide={onHide} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            Gọi món {cart.length > 0 && <Badge bg="primary">{cart.length}</Badge>}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {/* LEFT: Danh sách món ăn */}
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Control
                  placeholder="Tìm món ăn..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </Form.Group>

              <div className="mb-3">
                {categories.map(cat => (
                  <Button
                    key={cat}
                    variant={cat === selectedCategory ? 'dark' : 'outline-secondary'}
                    size="sm"
                    className="me-2 mb-2"
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </Button>
                ))}
              </div>

              {loading ? (
                <div className="text-center my-4">
                  <Spinner animation="border" variant="primary" />
                  <div className="mt-2">Đang tải danh sách món ăn...</div>
                </div>
              ) : (
                <>
                  <Row>
                    {filteredFoods.map(food => (
                      <Col xs={6} className="mb-4" key={food.id}>
                        <Card
                          className="h-100 shadow-sm"
                          onClick={() => handleFoodClick(food)}
                          style={{ cursor: 'pointer' }}
                        >
                          <Card.Img
                            variant="top"
                            src={food.imageUrl}
                            style={{ height: '150px', objectFit: 'cover' }}
                          />
                          <Card.Body>
                            <Card.Title className="fs-6">{food.name}</Card.Title>
                            <Card.Text className="text-muted">{food.categoryName}</Card.Text>
                            <Card.Text className="fw-bold text-success">
                              {food.price.toLocaleString()} VND
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  {pageCount > 1 && (
                    <ReactPaginate
                      pageCount={pageCount}
                      onPageChange={({ selected }) => setCurrentPage(selected)}
                      containerClassName="pagination justify-content-center mt-3"
                      pageClassName="page-item"
                      pageLinkClassName="page-link"
                      previousLabel="←"
                      nextLabel="→"
                      previousClassName="page-item"
                      previousLinkClassName="page-link"
                      nextClassName="page-item"
                      nextLinkClassName="page-link"
                      activeClassName="active"
                      forcePage={Math.min(currentPage, pageCount - 1)}
                    />
                  )}
                </>
              )}
            </Col>

            {/* RIGHT: Giỏ hàng */}
            <Col md={4}>
              <Card className="h-100 shadow-sm">
                <Card.Header className="bg-primary text-white">
                  <strong>Giỏ hàng ({cart.length} món)</strong>
                </Card.Header>
                <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {cart.length === 0 ? (
                    <p className="text-muted">Chưa có món nào.</p>
                  ) : (
                    <ListGroup variant="flush">
                      {cart.map(item => (
                        <ListGroup.Item key={item.foodId} className="d-flex justify-content-between align-items-center flex-wrap">
                          <div className="me-3" style={{ flex: 1 }}>
                            <strong>{item.foodName}</strong><br />
                            <small className="text-muted">{item.note}</small>
                            <div className="text-muted small">
                              {item.price.toLocaleString()} VND/món
                            </div>
                          </div>
                          <InputGroup size="sm" style={{ width: '110px' }}>
                            <Button variant="outline-secondary" size="sm" onClick={() => updateQuantity(item.foodId, item.quantity - 1)}>-</Button>
                            <Form.Control
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.foodId, +e.target.value)}
                            />
                            <Button variant="outline-secondary" size="sm" onClick={() => updateQuantity(item.foodId, item.quantity + 1)}>+</Button>
                          </InputGroup>
                          <Button variant="danger" size="sm" className="ms-2 mt-2" onClick={() => removeFromCart(item.foodId)}>X</Button>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </Card.Body>
                {cart.length > 0 && (
                  <Card.Footer className="text-end">
                    <div className="mb-2"><strong>Tổng tiền: </strong>{totalPrice.toLocaleString()} VND</div>
                    <Button variant="success" onClick={handleConfirm} disabled={loading}>
                        {loading ? (
                            <>
                            <Spinner as={'span'} animation='border' size='sm' className='me-2'/>
                                Đang xữ lý
                            </>
                        ): (
                            'Xác nhận '
                        )}
                    </Button>
                  </Card.Footer>
                )}
              </Card>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      <FoodDetailBookingModal
        show={showDetail}
        onHide={() => setShowDetail(false)}
        food={selectedFood}
        onSubmit={addToCart}
      />
      
    </>
  );
};

export default OrderModal;
