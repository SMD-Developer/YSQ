/* eslint-disable no-catch-shadow */
/* eslint-disable @typescript-eslint/no-shadow */
// controllers/productController.ts
import {useState, useEffect} from 'react';
import ProductService from '../service/producr_service';
import {Product} from '../model/product_model';
import React from 'react';
import User from '../../login/models/user_model';

export const useProductController = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredOutlets, setFilteredOutlets] = useState<Product[]>(products);
  const [categories, setCategories] = useState<{id: string; name: string}[]>(
    [],
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filteredData = products.filter(outlet =>
        outlet.name.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredOutlets(filteredData);
    } else {
      setFilteredOutlets(products);
    }
  };
  const handleClick = (category: string | null) => {
    //console.log('selectedCategory', category);
    //console.log('products', products.length);
    if (category === null) {
      setFilteredOutlets(products);
    } else {
      var filetereddata=products.filter(product => product.product_category_name === category);
      //console.log('filetereddata', filetereddata.length);
      setFilteredOutlets(
        filetereddata
      );
    }

    //console.log('filteredOutlets', filteredOutlets.length);
    // if (searchQuery) {
    //   const filteredData = filteredOutlets.filter(outlet =>
    //     outlet.name.toLowerCase().includes(searchQuery.toLowerCase()),
    //   );
    //   setFilteredOutlets(filteredData);
    // } else {
    // }
  };

  useEffect(() => {
  

    fetchProductData();
  }, []);
  const fetchProductData = async () => {
    setLoading(true);
    try {
      var user = await User.getUser();
      const [fetchedProducts, categor] = await Promise.all([
        ProductService.getProductsByDistributor(user?.distributerId!),
        ProductService.getProductCategories(),
      ]);

      setProducts(fetchedProducts);
      setFilteredOutlets(fetchedProducts);
      setCategories(categor);
    } catch (error: any) {
      //console.log(error);
      const message =
        error.message || 'An unexpected error occurred. Please try again.';

      setSnackbarMessage(message);
      setVisible(true);
      setError(message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };
  const onDismissSnackBar = () => setVisible(false);
  return {
    products,
    loading,
    error,
    visible,
    snackbarMessage,
    onDismissSnackBar,
    filteredOutlets,
    handleSearch,
    searchQuery,
    categories,
    selectedCategory,
    setSelectedCategory,
    handleClick,
    fetchProductData,
  };
};
