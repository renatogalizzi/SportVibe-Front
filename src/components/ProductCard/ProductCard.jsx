import styles from './ProductCard.module.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from 'react';

function ProductCard({ productData }) {
    const [imgHover, setImgHover] = useState(false);
    const { id, title, price, description, category, images } = productData;
    const categoryName = category.name;
    let priceFormat = (price / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    function handleImgHover() {
        setImgHover(!imgHover);
    }

    return (
        <div className={styles.mainView}>
            <div className={styles.subMainView}>
                <div className={styles.imgContainer} id={imgHover && styles.imgHover} onMouseEnter={handleImgHover} onMouseLeave={handleImgHover}>
                    <img src={images[0]} alt="" />
                    {imgHover &&
                        <div className={styles.layout}>
                            <i className="bi bi-suit-heart-fill"></i>
                        </div>}
                </div>
                <div className={styles.downSideContainer}>
                    <div className={styles.titleContainer}>
                        <p>{title}</p>
                    </div>
                    <div className={styles.categoryNameContainer}>
                        <p>{categoryName}</p>
                    </div>
                    <div className={styles.priceContainer}>
                        <p>$ {priceFormat}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;