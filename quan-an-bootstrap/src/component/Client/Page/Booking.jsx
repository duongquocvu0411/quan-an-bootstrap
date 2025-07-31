import React, { useState } from "react";
import { Button } from "react-bootstrap";
import TableSelectionModal from "../Modal/TableSelectionModal";
import { toast, ToastContainer } from "react-toastify";
import { createBooking } from "../../../be/Client/Booking/create_booking.api";


function Booking() {
  const [showModalChonBan, setShowModalChonBan] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [peopleCount, setPeopleCount] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: "",
  });

  const handleConfirmTable = (table) => {
    setSelectedTable(table);
    setShowModalChonBan(false);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTable) {
      toast.error("Vui lòng chọn bàn!");
      return;
    }

    const bookingTime = `${formData.date}T${formData.time}`; // ISO format

    const bookingPayload = {
      tableId: selectedTable.id,
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      bookingTime,
      guestCount: parseInt(peopleCount),
      note: formData.message,
    };

    try {
      const res = await createBooking(bookingPayload);
      if (res.isSuccess) {
        toast.success("Đặt bàn thành công!");
          setFormData({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        message: "",
      });
     setPeopleCount("");
    setSelectedTable(null);
      } else {
        toast.error(res.message || "Đặt bàn thất bại.");
      }
    } catch (err) {
      toast.error("Đã xảy ra lỗi khi đặt bàn.");
    }
  };

  return (
    <>
      <section id="book-a-table" className="book-a-table section">
        <br /><br /><br /><br /><br /><br /><br />
        <div className="container section-title" data-aos="fade-up">
          <h2>RESERVATION</h2>
          <p>Book a Table</p>
        </div>

        <div className="container" data-aos="fade-up" data-aos-delay={100}>
          <form className="php-email-form" onSubmit={handleSubmit}>
            <div className="row gy-4">
              <div className="col-lg-4 col-md-6">
                <input type="text" name="name" className="form-control" placeholder="Your Name" required onChange={handleInputChange} />
              </div>
              <div className="col-lg-4 col-md-6">
                <input type="email" name="email" className="form-control" placeholder="Your Email" required onChange={handleInputChange} />
              </div>
              <div className="col-lg-4 col-md-6">
                <input type="text" name="phone" className="form-control" placeholder="Your Phone" required onChange={handleInputChange} />
              </div>
              <div className="col-lg-4 col-md-6">
                <input type="date" name="date" className="form-control" required onChange={handleInputChange} />
              </div>
              <div className="col-lg-4 col-md-6">
                <input type="time" name="time" className="form-control" required onChange={handleInputChange} />
              </div>
              <div className="col-lg-4 col-md-6">
                <input type="number" name="people" className="form-control" placeholder="# of people"
                  value={peopleCount}
                  onChange={(e) => setPeopleCount(e.target.value)}
                  required />
              </div>
              <div className="col-lg-4 col-md-6">
                <Button
                  variant="warning"
                  className="w-100"
                  onClick={() => setShowModalChonBan(true)}
                  disabled={!peopleCount}
                >
                  {selectedTable ? `Đã chọn bàn ${selectedTable.tableNumber}` : "Chọn bàn"}
                </Button>
              </div>
            </div>

            <div className="form-group mt-3">
              <textarea className="form-control" name="message" rows={5} placeholder="Message" onChange={handleInputChange} />
            </div>

            <div className="text-center mt-3">
              <button type="submit">Book a Table</button>
            </div>
          </form>
        </div>

        <TableSelectionModal
          show={showModalChonBan}
          onHide={() => setShowModalChonBan(false)}
          onConfirm={handleConfirmTable}
          peopleCount={parseInt(peopleCount)}
        />
      </section>
      <ToastContainer/>
    </>
  );
}

export default Booking;
