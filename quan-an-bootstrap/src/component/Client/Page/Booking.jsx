import React, { useState } from "react";
import { Button } from "react-bootstrap";
import TableSelectionModal from "../Modal/TableSelectionModal";

function Booking() {
  const [showModalChonBan, setShowModalChonBan] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [peopleCount, setPeopleCount] = useState("");

  const handleConfirmTable = (table) => {
    setSelectedTable(table);
    setShowModalChonBan(false);
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
        <form className="php-email-form">
          <div className="row gy-4">
            <div className="col-lg-4 col-md-6">
              <input type="text" name="name" className="form-control" placeholder="Your Name" required />
            </div>
            <div className="col-lg-4 col-md-6">
              <input type="email" name="email" className="form-control" placeholder="Your Email" required />
            </div>
            <div className="col-lg-4 col-md-6">
              <input type="text" name="phone" className="form-control" placeholder="Your Phone" required />
            </div>
            <div className="col-lg-4 col-md-6">
              <input type="date" name="date" className="form-control" required />
            </div>
            <div className="col-lg-4 col-md-6">
              <input type="time" name="time" className="form-control" required />
            </div>
            <div className="col-lg-4 col-md-6">
              <input
                type="number"
                name="people"
                className="form-control"
                placeholder="# of people"
                value={peopleCount}
                onChange={(e) => setPeopleCount(e.target.value)}
                required
              />
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
            <textarea className="form-control" name="message" rows={5} placeholder="Message" />
          </div>

          <div className="text-center mt-3">
            <div className="loading">Loading</div>
            <div className="error-message" />
            <div className="sent-message">
              Your booking request was sent. We will call back or send an Email to confirm your reservation. Thank you!
            </div>
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
    </>
  );
}

export default Booking;
