import styles from "./Home.module.css";
import { useEffect, useState } from 'react';
import ProductCard from "../../components/ProductCard/ProductCard";
import FilterBar from "../FilterBar/FilterBar";
import Paginado from "../Paginado/Paginado";
import SearchResults from "../SearchResults/SearchResults";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { brandAction, categoryAction, filterCounterAction, genreFilterAction, getCurrentUserAction, getProducts, priceFilterAction, responsiveNavBar, searchActivity, sortAction, sportAction } from "../../redux/actions";
import axios from 'axios';
import { API_URL } from '../../helpers/config';
import getLocalStorageData from '../../utils/getLocalStorage';
import Loading from '../loading/Loading';



function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [loading, setLoading] = useState();
  const productRender = useSelector((state) => state.products);
  // productRender && console.log(productRender);
  let search_Activity = useSelector((state => state.search));
  const totalFilters = useSelector((state => state.totalFilters));
  const sort = useSelector((state => state.sort));
  const genre = useSelector((state => state.genre));
  const sport = useSelector((state => state.sport));
  const brand = useSelector((state => state.brand));
  const category = useSelector((state => state.category));
  const priceFilter = useSelector((state => state.priceFilter));
  const discount = useSelector((state => state.discount));

  async function handleUserData() {
    setLoading(true);
    try { // necesitamos usar el local storage de manera asíncrona para poder guardarlo en redux y poder renderizarlo en el nav bar u otras partes.
      const storageData = await getLocalStorageData('currentUser'); // la llamada al local storage lo hacemos con promesa para poder usar el await y esperar a que se cargue el local storage.
      const userData = storageData ? JSON.parse(storageData) : null;
      if (userData) {
        const { data } = await axios(`${API_URL}/user?email=${userData.user.email}&externalSignIn=${userData.user.externalSignIn}`);
        dispatch(getCurrentUserAction(data));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error.message);
    }
  }

  useEffect(() => {
    setLoading(true);
    if (location.pathname === '/search') {
      const sumFilters = [...totalFilters, category[0], sport[0], brand[0], priceFilter[0], priceFilter[1], sort[0], sort[1], genre[0], discount[0], { search: search_Activity }]
      dispatch(getProducts(sumFilters));
    } // ya que queremos que en la ruta Home no se apliquen los filtros del Search bar.
    else if (location.pathname !== '/search') {
      // el segundo valor en true del dispatch, es para indicar
      // que usaremos el backup del reducer para mantener el filtrado
      // madre de los filtros, así los items de la barra lateral de filtros no pierden su cantidad entre paréntesis.
      dispatch(getProducts(null, true));
      // reseteamos todos los filtros y ordenamientos
      dispatch(searchActivity(''));
      dispatch(getProducts());
      dispatch(genreFilterAction([{ gender: '' }]));
      dispatch(sportAction([{ sport: '' }]));
      dispatch(brandAction([{ brand: '' }]));
      dispatch(categoryAction([{ category: '' }]));
      dispatch(sortAction([{ sort: 'id' }, { typeSort: 'desc' }]));
      dispatch(priceFilterAction(['', '']));
      dispatch(filterCounterAction({}));
    }
    dispatch(responsiveNavBar(false));
    handleUserData(); // para saber si hay algún usuario logueado en este compu y renderizar su imagen en el navbar.
    /* if (!search_Activity) {
      navigate('/');
    } */
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [search_Activity]);

  return (
    <div className={styles.mainView}>
      {location.pathname !== '/search' && <hr />}
      {loading ?
        <Loading />
        :
        <div className={styles.subMainView}>
          {<div className={styles.FilterBarContainer}>
            <FilterBar />
          </div>}
          {productRender.data?.length > 0 ?
            <div className={styles.conteinerHome}>
              <div className={styles.results}>
                <p>Resultados: {productRender?.totalFilteredCount}</p>
              </div>
              <div className={styles.conteinerCards}>
                {productRender.data?.length > 0 && productRender.data.map((product, i) => {
                  return (
                    <div key={i} className={styles.cardComponentContainer}>
                      <ProductCard productData={product} />
                    </div>
                  )
                })}
              </div>
              <div className={styles.paginado}>
                <Paginado />
              </div>
            </div> :
            <div className={styles.searchNoResultsContainer}>
              <SearchResults />
            </div>
          }
        </div>
      }
    </div>
  );
}

export default Home;

