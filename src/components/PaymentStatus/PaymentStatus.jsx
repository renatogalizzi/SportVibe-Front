import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import styles from "./PaymentStatus.module.css";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { cartAction, getCurrentUserAction, quantityCartAction } from '../../redux/actions';

const PaymentStatus = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get("orderId");
  const message = queryParams.get("status");

  let content;
  const trimmedMessage = message.trim().toUpperCase();

  if (trimmedMessage === "COMPLETED") {
    content = (
      <>
        <h2>Gracias por elegir SportVibe</h2>
        <div className={styles.paymentDetails}>
          <h3>Detalles del Pago</h3>
          <p>ID del Pago: {orderId}</p>
          <p>Estado: COMPLETED</p>
        </div>
        <div className={styles.purchaseDetails}>
          <h3>Detalles de la Compra</h3>
          <p>Producto: Artículos deportivos en SportVibe</p>
          <p>Impuesto de compra (incluido): $0.00</p>
        </div>
        <p>Te enviaremos un correo electrónico con la confirmación y detalles adicionales.</p>
      </>
    );
  } else {

    content = (
      <div>
        <h2>Estado de pago no reconocido</h2>
        <p>El estado del pago ({message}) no se reconoce.</p>
      </div>
    );
  }

  function resetCart() {
    localStorage.removeItem('currentCart');
    dispatch(quantityCartAction(0));
    dispatch(cartAction(null));
  }

  useEffect(() => {
    resetCart();
  }, []);

  return (
    <div className={styles.container}>
      {content}

      <Link to="/" className={`btn btn-primary ${styles.btn}`}>
        Ir al Sitio
      </Link>
    </div>
  );
};

PaymentStatus.propTypes = {
  orderId: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

export default PaymentStatus;