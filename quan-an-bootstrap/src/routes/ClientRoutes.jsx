import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../component/Client/Page/Header';
import Footer from '../component/Client/Page/Footer';

import Home from '../component/Client/Page/Home';
import About from '../component/Client/Page/About';
import Menu from '../component/Client/Page/Menu';
import Specials from '../component/Client/Page/Specials';
import Event from '../component/Client/Page/Event';
import Gallery from '../component/Client/Page/Gallery';
import Testimonials from '../component/Client/Page/Testimonials';
import Contact from '../component/Client/Page/Contact';
import Booking from '../component/Client/Page/Booking';
import Chefs from '../component/Client/Page/Chefs';



const ClientRoutes = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/specials" element={<Specials />} />
                <Route path="/event" element={<Event />} />
                <Route path="/chefs" element={<Chefs />} />
             
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/testimonial" element={<Testimonials />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/booking" element={<Booking />} />
            </Routes>
            <Footer />
        </>
    );
};

export default ClientRoutes;
