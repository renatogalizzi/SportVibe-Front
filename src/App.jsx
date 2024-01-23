import AdminDashBoard from "./components/AdminDashBoard/AdminDashBoard";
import { AuthContextProvider } from "./context/AuthContext";
import { UserAuth } from './context/AuthContext';
import {
  Home,
  UserProfile,
  CategoryBar,
  CarouselComponent,
  About,
  ShoppingCart,
  Login,
  NavBar,
  Carousel2,
  CarouselModel2,
  NotFound,
  Footer,
  UserForm,
  PaymentForm,
  Loading,
  PaymentStatus,
  Metrics
} from "./helpers/indexComponents";
import styles from './App.module.css';
import PrivacyPolitic from "./components/Footer/privacyPolitic/privacyPolitic";
import Conditions from "./components/Footer/conditions/conditions";
import Changes from "./components/Footer/changes/changes";
import Deliveries from "./components/Footer/deliveries/deliveries";
import Payments from "./components/Footer/payments/payments";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import { I18nextProvider } from 'react-i18next';
import i18n from './components/Translate/i18n';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import ProductDetail from "./components/ProductDetail/ProductDetail";
import CarouselModel from "./components/CarouselModel/CarouselModel";
import CarouselProducts from "./components/CarouselProducts/CarouselProducts";
import { useEffect, useRef, useState } from "react";
import getLocalStorageData from './utils/getLocalStorage';
import ProductUpdate from "./components/ProductUpdate/ProductUpdate";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "./helpers/config";
import { displayDropDownAction, getCurrentUserAction, quantityCartAction } from "./redux/actions";
import RecoveryPassword from "./components/RecoveryPassword/RecoveryPassword";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";
import GenderBox from './components/GenderBox/GenderBox';

const stripePromise = loadStripe('Henry2023?');


function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const elementoEspecifico = useRef(null);
  const displayDropDown = useSelector((state) => state.displayDropDown);
  // console.log(displayDropDown);
  const currentUserData = useSelector((state) => state.currentUserData);
  const currentAdminData = useSelector((state) => state.currentAdminData);
  // console.log(currentUserData, currentAdminData);
  const { user, logOut } = UserAuth() ?? {};
  const [cartDataInit, setCartDataInit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminLoguedUser, setAdminLoguedUser] = useState("");

  const initialStorageCart = async () => {
    try {
      setLoading(true);
      // Ejecuta el primer await
      const cartDataStorage = await getLocalStorageData("currentCart");
      const parseCartDataStorage = JSON.parse(cartDataStorage);
      // Si el primer await ha terminado, ejecuta el segundo await
      if (parseCartDataStorage) {
        let newTotalQuantity = 0;
        parseCartDataStorage?.cart.forEach(product => {
          newTotalQuantity += Number(product.quantity);
        });
        dispatch(quantityCartAction(newTotalQuantity));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error({ error: error.message });
    }
  };

  async function handleUserData() {
    try {
      const userDataLocalStorage = await getLocalStorageData('currentUser');
      const userData = JSON.parse(userDataLocalStorage);
      if (userData) {
        const { data } = await axios(`${API_URL}/user?email=${userData.user.email}&externalSignIn=${userData.user.externalSignIn}`);
        dispatch(getCurrentUserAction(data));
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  function handleNavigate() {
    if (!currentUserData && currentAdminData) {
      navigate('/dashboard');
    }
    else if (currentUserData && !currentAdminData) {
      navigate('/profile');
    }
  }

  const getAdminLocalStorage = async () => {
    const adminDataLocalStorage = await getLocalStorageData('adminUser');
    const adminData = JSON.parse(adminDataLocalStorage);
    if (adminData) {
      setAdminLoguedUser(adminData);
    }
  }

  const handleClickOutside = (event) => {
    /* if (elementoEspecifico.current && !elementoEspecifico.current.contains(event.target)) {
      dispatch(displayDropDownAction(false));
    } */
  };

  async function handleSignOut() {
    try {
      dispatch(displayDropDownAction(false));
      // solo usamos el logOut de Firebase si el usuario es externo(externalSignIn en true)
      if (currentUserData.externalSignIn && logOut) await logOut();
      // reseteamos la data a renderizar y el local storage y automáticamente eso nos redirige al home.
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentCart');
      dispatch(quantityCartAction(0));
      dispatch(getCurrentUserAction(null));
      dispatch(cartAction(null));
      // y nos aseguramos de irnos al home ya que hicimos un log out.
      navigate('/');
    } catch (error) {
      console.error(error.message);
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    getAdminLocalStorage(); // para saber si hay algun usuario administrador logueado y aplicar rutas protegidas a dashboard
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
    handleUserData(); // para saber si hay algún usuario logueado en este compu y tener de manera global la data del usuario. 
    initialStorageCart();
  }, [location.pathname]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => { document.removeEventListener('click', handleClickOutside) }
  }, [displayDropDown]);

  if (loading) {
    return <Loading />
  }
  else {
    return (
      <I18nextProvider i18n={i18n}>
        <Elements stripe={stripePromise}>
          <AuthContextProvider>
            <div className={styles.mainView}>
              {location.pathname !== "/dashboard" && location.pathname !== "/password-recover" &&
                <div className={styles.navBarContainer}>
                  <NavBar />
                  {displayDropDown &&
                    <div ref={elementoEspecifico} className={styles.dropDownContainer}>
                      <p className={styles.name}>Luca Bruzzone</p>
                      <div className={styles.lowSection}>
                        {currentAdminData &&
                          <div onClick={handleNavigate}>
                            <i onClick={handleNavigate} className="fa-solid fa-chart-line"></i>
                            <p onClick={handleNavigate}>Dashboard</p>
                          </div>}
                        {currentUserData &&
                          <div onClick={handleNavigate}>
                            <i onClick={handleNavigate} className="fa-regular fa-user"></i>
                            <p onClick={handleNavigate}>Mi perfil</p>
                          </div>}
                        <div onClick={handleSignOut}>
                          <i onClick={handleSignOut} className="fa-solid fa-arrow-right-from-bracket"></i>
                          <p onClick={handleSignOut}>Cerrar sesión</p>
                        </div>
                      </div>
                    </div>}
                </div>
              }
              {location.pathname === '/' &&
                <div className={styles.carouselContainer}>
                  <CarouselComponent text={['Descuentos de hasta 40%', 'No te lo pierdas!']} />
                </div>
              }
              {(location.pathname === '/' || location.pathname === '/search') &&
                <div className={styles.categoryBarContainer}>
                  <CategoryBar />
                </div>
              }
              {(location.pathname === '/') &&
                <div className={styles.carousel2Container}>
                  <Carousel2 />
                </div>
              }
              {(location.pathname === '/') &&
                <div className={styles.genderBoxContainer}>
                  <GenderBox />
                </div>
              }
              {location.pathname === '/' &&
                <div className={styles.CarouselModelContainer}>
                  <CarouselModel />
                </div>
              }
              {location.pathname === '/' &&
                <div className={styles.CarouselModelContainer}>
                  <CarouselModel2 />
                </div>
              }
              {location.pathname === '/' &&
                <div className={styles.CarouselProductsContainer}>
                  <CarouselProducts order='id' type='desc' title='Nuevos productos' />
                </div>
              }
              {location.pathname === '/' &&
                <div className={styles.CarouselProductsContainer}>
                  <CarouselProducts order='averageScore' type='desc' title='Productos mejor evaluados' />
                </div>
              }
              <Routes className={styles.routesContainer}>
                <Route path="/" element={<Home setLoading={setLoading} />}></Route>
                <Route path="/search" element={<Home />}></Route>
                <Route path="/dashboard" element={
                  <ProtectedRoutes user={adminLoguedUser} redirectTo="/dashboard">
                    <AdminDashBoard />
                  </ProtectedRoutes>} />
                <Route path="/about" element={<About />} />
                <Route path="/shoppingcart" element={<ShoppingCart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/detail/:id" element={<ProductDetail />} />
                <Route path="/userForm" element={<UserForm />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/privacy" element={<PrivacyPolitic />} />
                <Route path="/conditions" element={<Conditions />} />
                <Route path="/deliveries" element={<Deliveries />} />
                <Route path="/changes" element={<Changes />} />
                <Route path="/payment" element={<PaymentForm />} />
                <Route path="/payments" element={<Payments />} />
                <Route path="/payment-status" element={<PaymentStatus />} />
                <Route path="/password-recover" element={<RecoveryPassword />} />
              </Routes>
              {(location.pathname !== '/login' && location.pathname !== '/dashboard') &&
                <Footer />
              }
            </div>
          </AuthContextProvider>
        </Elements>
      </I18nextProvider>
    );
  }
}

export default App;
