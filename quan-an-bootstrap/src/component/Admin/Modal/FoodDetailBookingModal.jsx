// File: components/FoodDetailModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const FoodDetailBookingModal = ({ show, onHide, food, onSubmit }) => {
  const [form, setForm] = useState({ quantity: 1, note: '' });

  useEffect(() => {
    if (show && food) {
      setForm({ quantity: 1, note: '' });
    }
  }, [show, food]);

  const handleSubmit = () => {
    if (form.quantity < 1) return;
    onSubmit(form);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Thêm món: {food?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Số lượng</Form.Label>
          <Form.Control
            type="number"
            min={1}
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: +e.target.value })}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Ghi chú</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Hủy</Button>
        <Button variant="primary" onClick={handleSubmit}>Thêm</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FoodDetailBookingModal;
