import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { getProducts } from '../../../redux/actions';

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();

  const handleSearch = () => {
    dispatch(getProducts(searchTerm));
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Product..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="button" onClick={handleSearch}>
        🔍
      </button>
    </div>
  );
}

export default SearchBar;
