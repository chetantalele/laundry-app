import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Secrets from "./Secrets";
import ServiceProviderRegister from "./ServiceProviderRegister";
import ServiceProviderLogin from "./ServiceProviderLogin";
import Spssecrets from "./Spssecrets";
import ServiceProviderAddService from "./ServiceProviderAddService"; 
import ServiceProviderOrders from "./ServiceProviderOrders";
import OrderDetailsPage from './OrderDetailsPage';
import UserOrders from './UserOrders';
import UserOrderDetailsPage from './UserOrderDetailsPage';
import ServiceProvidersPage from './ServiceProvidersPage';
import ProviderServicesPage from './ProviderServicesPage';
import CheckoutPage from './CheckoutPage';
import OrderConfirmationPage from "./OrderConfirmationPage";
import Header from "./Header";
import Footer from "./Footer";
import PHeader from "./PHeader";
import About from "./About";
import AboutP from "./AboutP";
import UserForgotpass from "./UserForgotpass";
import ProviderForgotpass from "./ProviderForgotpass";
import Home from './Home.jsx';
import HomeService from "./HomeService.jsx";
import UpdateUser from './updateUser.jsx';



function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home/>}/>
          <Route path="/register" element={<Register />} />
          <Route path="/secrets" element={<Secrets />} />
          <Route path="/update-user" element={<UpdateUser />} />
          <Route path="/service-provider/register" element={<ServiceProviderRegister />} />
          <Route path="/service-provider/login" element={<ServiceProviderLogin />} />
          <Route path="/service-provider/secrets" element={<Spssecrets/>} />
          <Route path="/service-provider/home" element={<HomeService/>}/>
          <Route path="/service-provider/add-service" element={<ServiceProviderAddService />} />
          <Route path="/service-provider/orders" element={<ServiceProviderOrders />} />
          <Route path="/service-provider/order/:orderId" element={<OrderDetailsPage />} />
          <Route path="/providers" element={<ServiceProvidersPage />} />
          <Route path="/provider/:providerId/services" element={<ProviderServicesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmationPage />} />

          <Route path="/orders" element={<UserOrders />} />
          <Route path="/order/:orderId" element={<UserOrderDetailsPage />} />
          <Route path="/header" element={<Header />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/pheader" element={<PHeader />} />
          {/* <Route path="/homepage" element={<Home />} /> */}
          <Route path="/about" element={<About />} />
          <Route path="/aboutp" element={<AboutP />} />
          <Route path="/forgotpass" element={<UserForgotpass />} />
          <Route path="/spforgotpass" element={<ProviderForgotpass />} />
          

          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
