import "bootstrap-icons/font/bootstrap-icons.css";
import Sidebar from "../Sidebar/Sidebar";
import { useState, useEffect } from "react";
import styles from "./AdminDashBoard.module.css";
import ProductForm from "../ProductForm/ProductForm";
import UserForm from "../UserForm/UserForm";
import ProductPrueba from "../ProductForm/ProductPrueba";
import ProductUpdate from "../ProductUpdate/ProductUpdate";

function AdminDashBoard() {
  const [selectedRow, setSelectedRow] = useState(null);
  const [sidebarRender, setSidebarRender] = useState("productos");
  const [visibleSidebar,setVisibleSidebar] = useState(true);
  

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function handleClose() {
    setSelectedRow(null);
  }

  return (
    <div className="d-flex">
      {visibleSidebar && <Sidebar setSidebarRender={setSidebarRender} />}
      <div className="bg-transparent w-100">
        {sidebarRender === "productos" ? (
          <div className={selectedRow ? styles.conteinerCardsHidden : styles.conteinerCards}>
          {<ProductPrueba setVisibleSidebar={setVisibleSidebar} visibleSidebar={visibleSidebar} setSelectedRow={setSelectedRow} />}
          </div>
        ) : null}
        {selectedRow && 
          <div className={sidebarRender === "nuevo" || sidebarRender === "usuarios" ? styles.conteinerCardsHidden : styles.render}>
            <ProductUpdate setSelectedRow={setSelectedRow} data={selectedRow}/>
            {/* <p onClick={handleClose}>✕</p> */}
          </div>}
        {sidebarRender === "nuevo" &&
        (
          <div>
            <ProductForm />
          </div>
        )}
        {sidebarRender === "usuarios" ? <UserForm /> : null}
      </div>
    </div>
  );
}

export default AdminDashBoard;

