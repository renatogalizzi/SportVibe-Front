import { NavLink } from "react-bootstrap";
import logo from "../../Images/Logo.jpg";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../../helpers/config.js";
import "./RecoveryPassword.module.css";
import { useEffect } from "react";

const RecoveryPassword = () => {
  useEffect(() => {
    //Captura los parámetros de la URL
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");
    setNuevaClave({ ...nuevaClave, token });
  }, []);

  const [nuevaClave, setNuevaClave] = useState({
    token: "",
    newPassword: "",
  });
  
  const [confirmarClave, setConfirmarClave] = useState({
    password: "",
  });

  const handleChangeN = (e) => {
    setNuevaClave({ ...nuevaClave, newPassword: e.target.value });
  };
  const handleChangeC = (e) => {
    setConfirmarClave({ password: e.target.value });
  };

  const submit = async (event) => {
    event.preventDefault();
    if (nuevaClave.newPassword !== confirmarClave.password) {
      Swal.fire("Las contraseñas no coinciden");
    } else if (nuevaClave.newPassword.length < 6) {
      Swal.fire("La contraseña debe tener al menos 6 caracteres");
    } else {
      try {
        const { data } = await axios.post(
          `${API_URL}/password-update`,
          nuevaClave
        );
        const Toast = Swal.mixin({
          toast: true,
          position: "center",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        });
        Toast.fire({
          icon: "success",
          title:
            "Contraseña actualizada con exito, por favor ingrese nuevamente",
        });
      } catch (error) {
        Swal.fire({
          width: "20em",
          icon: "warning",
          title: "Error en actualizacion",
          text: "Dispone de 1 minuto para ingresar la nueva contraseña",
          footer: "Por favor intentelo nuevamente",
        });
      }
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="contenedorLogin">
        <div className="box">
          <div className="boxlogo">
            <NavLink to="/">
              <img className="logo" src={logo} alt="" />
            </NavLink>
          </div>
          <div className="label">
            <div className="text-wrapper3">Nueva contraseña</div>
          </div>
          <div className="boxInput">
            <input
              onChange={handleChangeN}
              value={nuevaClave.password}
              className="input"
              type="password"
              autoComplete="off"
            />
          </div>
          <div className="label">
            <div className="text-wrapper3">Confirmar contraseña</div>
          </div>
          <div className="boxInput">
            <input
              onChange={handleChangeC}
              value={confirmarClave.password}
              className="input"
              type="password"
              autoComplete="off"
            />
          </div>
          <hr />
          <div className="boxlin"></div>
          <div className="crear">
            <p className="text-wrapper4"></p>
            <button type="submit" className="botton2" value="submit">
              Enviar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default RecoveryPassword;
