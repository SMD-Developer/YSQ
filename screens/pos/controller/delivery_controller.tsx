import {useEffect, useState} from 'react';
import ProductService from '../service/producr_service';
import {Product} from '../model/product_model';
import {Sale} from '../model/sales_mode';
import User from '../../login/models/user_model';
import {Const} from '../../../constants/const_value';

export const useDeliveryController = (
  screenType: number, // screenType parameter to control which API to call
  outletId?: string,
  channelID?: any,
) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: string; name: string}[]>(
    [],
  );
  const [gifts, setGifts] = useState<any[]>([]); // New state to store gifts
  const [loading, setLoading] = useState<boolean>(true);
  const [salesLoading, setSalesLoading] = useState<boolean>(false);
  const [giftLoading, setGiftLoading] = useState<boolean>(false);
  const [returnLoading, setReturnLoading] = useState<boolean>(false);
  const [showSnackBar, setShowSnackBar] = useState<boolean>(false);
  const [errorMessage, setError] = useState<string | null>(null);
  const [salesReturns, setSalesReturns] = useState<Sale[]>([]);

  const fetchProductsAndCategories = async () => {
    console.log('Fetching products and categories for outlet:', outletId, channelID);
    try {
      var user = await User.getUser();
      const [products, categor] = await Promise.all([
        ProductService.getCustomerProducts(user?.id?.toString() ?? '5'),
        ProductService.getProductCategories(),
      ]);
      //console.log('Products:', products);
      //console.log('Categories:', categor);
      setProducts(products);
      setCategories(categor);
    } catch (err) {
      setError('An error occurred while fetching products and categories');
    } finally {
      setLoading(false);
    }
  };

  const fetchGifts = async () => {
    try {
      setLoading(true);
      const gifts = await ProductService.getGiftList(); // Call the new API for gifts
      setGifts(gifts);
    } catch (err) {
      setError('An error occurred while fetching gifts');
    } finally {
      setLoading(false);
    }
  };

  const createSale = async (saleData: any) => {
    try {
      const saleResponse = await ProductService.createSale(saleData);
      //console.log('Sale response:', saleResponse);
      setSalesLoading(false);
      return saleResponse;
    } catch (err) {
      setError(
        Const.languageData?.Failed_to_place_order ?? 'Failed to place order',
      );
      setShowSnackBar(true);
      // Rethrow error to handle it in the UI if needed
    } finally {
      setSalesLoading(false);
    }
  };
  const createReturnSale = async (saleData: any) => {
    try {
      setReturnLoading(true);
      //console.log('Creating sale with data:', saleData);
      const saleResponse = await ProductService.createReturnSale(saleData);
      return saleResponse;
    } catch (err: any) {
      setError(err.toString());
      setShowSnackBar(true);
    } finally {
      setReturnLoading(false);
    }
  };

  const submitGift = async (saleData: any) => {
    try {
      setGiftLoading(true);
      const saleResponse = await ProductService.submitGift(saleData);
      if (saleResponse) {
        setError('Gift Submitted');
        setShowSnackBar(true);
      }

      return saleResponse;
    } catch (err) {
      setError('Failed to create sale');
      setShowSnackBar(true);
    } finally {
      setGiftLoading(false);
    }
  };
  const fetchSalesReturns = async () => {
    try {
      setLoading(true);
      const salesReturns = await ProductService.getSalesReturn(outletId);
      console.log('from fetch sale'); // Call the new API for sales returns
      console.log(salesReturns);
      setSalesReturns(salesReturns);
    } catch (err) {
      setError('An error occurred while fetching sales returns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (screenType === 1) {
      fetchProductsAndCategories();
    } else if (screenType === 3) {
      fetchGifts();
    } else if (screenType === 2) {
      fetchSalesReturns();
    }
  }, [screenType, outletId, channelID]); // Add screenType to dependencies

  return {
    products,
    categories,
    gifts, // Expose gifts state
    loading,
    errorMessage,
    createSale,
    showSnackBar,
    setShowSnackBar,
    submitGift,
    giftLoading,
    setError,
    salesReturns,
    setSalesLoading,
    salesLoading,
    createReturnSale,
    returnLoading,
  };
};
