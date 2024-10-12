// services/productService.ts
import axios from 'axios';
import {Const} from '../../../constants/const_value';
import NetInfo from '@react-native-community/netinfo';
import Realm from 'realm';
import {realmObject} from '../../../routes/realm';
import uuid from 'react-native-uuid'; // Import UUID generator
import User from '../../login/models/user_model';

class ProductService {
  static async getProducts() {
    try {
      const networkState = await NetInfo.fetch();

      if (networkState.isConnected) {
        console.log('Network is available');
        // Fetch from API if the network is available
        const token = await Const.getTokenHeader();
        const response = await axios.get(`${Const.BASE_URL}api/m1/products`, {
          headers: token,
        });

        if (response.data.success) {
          console.log('success:', 'got products');
          const products = response.data.data;

          // Store products in Realm
          realmObject.write(() => {
            products.forEach((product: any) => {
              // realmObject.create(
              //   'Product',
              //   {
              //     name: product.name,
              //     code: product.code,
              //     product_code: product.product_code,
              //     product_cost: product.product_cost,
              //     product_price: product.product_price,
              //     images: product.images.imageUrls,
              //     in_stock: product.in_stock,
              //     assign_quantity: product.assign_quantity,
              //     sale_unit_name: product.sale_unit_name.name,
              //   },
              //   Realm.UpdateMode.Modified,
              // );

              product.images = product.images.imageUrls;
            });
          });

          return products;
        } else {
          throw new Error(response.data.message || 'Failed to fetch products');
        }
      } else {
        // No network, fetch from Realm
        console.log('Network Not is available');
        const offlineProducts = realmObject.objects('Product');
        if (offlineProducts.length > 0) {
          return offlineProducts.map(element => {
            element.sale_unit_name = {
              name: element.sale_unit_name,
            };
            return element;
          });
        } else {
          throw new Error('No network and no cached products available');
        }
      }
    } catch (error) {
      console.log('error:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Fetch products failed',
        );
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  }
  static async getProductsByDistributor(distributorId: string) {
    try {
      console.log('distributorId:', distributorId);
      const networkState = await NetInfo.fetch();

      if (networkState.isConnected) {
        console.log('Network is available');
        // Fetch from API if the network is available
        const token = await Const.getTokenHeader();
        const response = await axios.get(
          `${Const.BASE_URL}api/m1/distributor-products/${distributorId}`,
          {
            headers: token,
          },
        );

        if (response.data.data) {
          console.log('success:', 'got products');
          const products = response.data.data;

          // // Store products in Realm
          // realmObject.write(() => {
          //   products.forEach((product: any) => {
          //     realmObject.delete(realmObject.objects('Product'));
          //     realmObject.create(
          //       'Product',
          //       {
          //         name: product.name,
          //         code: product.code,
          //         product_code: product.product_code,
          //         product_cost: product.product_cost,
          //         product_price: product.product_price,
          //         images: product.images.imageUrls,
          //         in_stock: product.in_stock,
          //       },
          //       Realm.UpdateMode.Modified,
          //     );

          //     product.images = product.images.imageUrls;
          //   });
          // });
          products.forEach((product: any) => {
            product.images = product.images.imageUrls;
          });
          return products;
        } else {
          throw new Error(response.data.message || 'Failed to fetch products');
        }
      } else {
        // No network, fetch from Realm
        console.log('Network Not is available');
        const offlineProducts = realmObject.objects('Product');
        if (offlineProducts.length > 0) {
          return offlineProducts;
        } else {
          throw new Error('No network and no cached products available');
        }
      }
    } catch (error) {
      console.log('error:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Fetch products failed',
        );
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  }
  static async getCustomerProducts(id: string) {
    try {
      const networkState = await NetInfo.fetch();

      if (networkState.isConnected) {
        console.log('Network is available');
        // Fetch from API if the network is available
        const token = await Const.getTokenHeader();
        const response = await axios.get(
          `${Const.BASE_URL}api/m1/today-loaded-product-list/${id}`,
          {
            headers: token,
          },
        );

        if (response.data.success) {
          console.log('success:', 'got products');
          const products = response.data.data;

          // Store products in Realm
          realmObject.write(() => {
            realmObject.delete(realmObject.objects('Product'));
            products.forEach((product: any) => {
              try {
                realmObject.create(
                  'Product',
                  {
                    name: product.name,
                    code: product.code,
                    product_code: product.product_code,
                    product_cost: product.product_cost,
                    product_price: product.product_price,
                    images: product.images.imageUrls,
                    in_stock: product.in_stock,
                    assign_quantity: product.assign_quantity,
                    sale_unit_name: product.sale_unit_name.name,
                    product_unit_name: product.product_unit_name.name,
                    id: `${product.main_product_id}`,
                  },
                  Realm.UpdateMode.Modified,
                );
              } catch (error) {
                console.log('error:', error);
              }

              // product.images = product.images.imageUrls;
            });
          });
          products.forEach((product: any) => {
            product.images = product.images.imageUrls;
          });
          return products;
        } else {
          throw new Error(response.data.message || 'Failed to fetch products');
        }
      } else {
        // No network, fetch from Realm
        console.log('Network Not is available');
        const offlineProducts = realmObject.objects('Product');

        if (offlineProducts.length > 0) {
          return offlineProducts.map(element => {
            // Create a new object by spreading the properties of the original Realm object
            const newElement = {...element.toJSON()};
            newElement.main_product_id = element.id;

            // Modify the new object
            newElement.sale_unit_name = {
              name: element.sale_unit_name,
            };
            newElement.product_unit_name = {
              name: element.product_unit_name,
            };

            return newElement; // Return the modified copy
          });
        } else {
          throw new Error('No network and no cached products available');
        }
      }
    } catch (error) {
      console.log('error:', error);
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Fetch products failed',
        );
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  }

  static async createSale(saleData: any) {
    try {
      // Check network connectivity
      const netInfo = await NetInfo.fetch();

      // If no network, save the sale to Realm
      if (!netInfo.isConnected) {
        console.log('No network, saving sale locally to Realm.');
        await this.saveSaleToRealm(saleData);
        return {succes: true}; // Exit early as we cannot send data to the server
      }
      // If network is available, send the data to the server
      const token = await Const.getTokenHeader();

      const response = await axios.post(
        `${Const.BASE_URL}api/m1/sales`,
        saleData,
        {
          headers: token,
        },
      );

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Axios error:', error.response?.data?.message);
        throw new Error(
          error.response?.data?.message || 'Sale creation failed',
        );
      } else {
        console.log('Unexpected error:', error);
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  }

  // Save the sale data to Realm if offline
  static async saveSaleToRealm(saleData: any) {
    try {
      // Save the saleData into Realm
      realmObject.write(() => {
        realmObject.create('SaveSale', {
          customer_id: saleData.customer_id,
          date: saleData.date,
          discount: saleData.discount,
          grand_total: saleData.grand_total,
          is_sale_created: saleData.is_sale_created,
          note: saleData.note,
          paid_amount: saleData.paid_amount,
          payment_status: saleData.payment_status,
          payment_type: saleData.payment_type,
          received_amount: saleData.received_amount,
          sale_items: JSON.stringify(saleData.sale_items), // Store as a string
          shipping: saleData.shipping,
          status: saleData.status,
          tax_amount: saleData.tax_amount,
          tax_rate: saleData.tax_rate,
          warehouse_id: saleData?.warehouse_id ?? 1,
          image: saleData.image,
          salesman_id: saleData.salesman_id,
        });
      });

      console.log('Sale saved locally in Realm.');
    } catch (error) {
      console.log('Error saving sale to Realm:', error);
    }
  }

  // Sync the Realm data when network is available
  static async syncRealmSales() {
    try {
      // Check network connectivity
      const netInfo = await NetInfo.fetch();

      // If network is available, sync the data
      if (netInfo.isConnected) {
        // Fetch all saved sales from Realm
        const sales = realmObject.objects('SaveSale');

        // Sync each sale
        for (const sale of sales) {
          try {
            const saleData = {
              ...sale,
              sale_items: JSON.parse(sale.sale_items), // Convert string back to JSON
            };
            try {
              await this.createSale(saleData); // Attempt to send it to the server
            } catch (E) {}
            realmObject.write(() => {
              realmObject.delete(sale);
            });

            console.log('Sale synced and removed from Realm.');
          } catch (error) {
            console.log('Error syncing sale:', error);
          }
        }
      }
    } catch (error) {
      console.log('Error syncing Realm sales:', error);
    }
  }

  static async getProductCategories() {
    try {
      // Check network availability
      const networkState = await NetInfo.fetch();

      if (networkState.isConnected) {
        console.log('Network is available');
        // Fetch from API if the network is available
        const token = await Const.getTokenHeader();
        const response = await axios.get(
          `${Const.BASE_URL}api/m1/product-categories`,
          {
            headers: token,
          },
        );

        if (response.data.success) {
          const productCategories = response.data.data;

          // Store product categories in Realm
          realmObject.write(() => {
            productCategories.forEach((category: any) => {
              realmObject.create(
                'ProductCategory',
                {
                  id: category.id,
                  name: category.name,
                },
                Realm.UpdateMode.Modified,
              );
            });
          });
          return productCategories;
        } else {
          throw new Error(
            response.data.message || 'Failed to fetch product categories',
          );
        }
      } else {
        // No network, fetch from Realm
        console.log('Network is not available');
        const offlineCategories = realmObject.objects('ProductCategory');
        if (offlineCategories.length > 0) {
          return offlineCategories;
        } else {
          throw new Error(
            'No network and no cached product categories available',
          );
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Fetch product categories failed',
        );
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  }
  static async getGiftList() {
    try {
      // Check network state
      const networkState = await NetInfo.fetch();

      if (networkState.isConnected) {
        console.log('Network is available');
        const user = await User.getUser();
        // Fetch data from API
        const token = await Const.getTokenHeader();
        const response = await axios.get(
          `${Const.BASE_URL}api/m1/get-today-gift/${user?.id}`,
          {
            headers: token,
          },
        );

        if (response.data.success) {
          const gifts = response.data.data.map((gift: any) => {
            gift.giftdetails.quantity = gift.quantity;
            return gift.giftdetails;
          });

          // Store gifts in Realm
          realmObject.write(() => {
            gifts.forEach((gift: any) => {
              realmObject.create(
                'Gift',
                {
                  id: gift.id,
                  title: gift.title,
                  quantity: gift.quantity,
                  description: gift.discription, // Fixed in the schema but left as-is from the API
                  image: gift.image,
                  createdAt: gift.created_at,
                  updatedAt: gift.updated_at,
                  deletedAt: gift.deleted_at,
                },
                Realm.UpdateMode.Modified, // This will update existing records
              );
            });
          });

          return gifts; // Return API data
        } else {
          throw new Error(response.data.message || 'Failed to fetch gift list');
        }
      } else {
        // If no network, fetch from local Realm cache
        console.log('Network is not available');
        const offlineGifts = realmObject.objects('Gift');

        if (offlineGifts.length > 0) {
          console.log('Returning cached gift list');
          console.log(offlineGifts);
          // Return cached gifts
          return offlineGifts.map((gift: any) => ({
            id: gift.id,
            title: gift.title,
            quantity: gift.quantity,
            description: gift.description, // Corrected spelling
            image: gift.image,
            created_at: gift.createdAt,
            updated_at: gift.updatedAt,
            deleted_at: gift.deletedAt,
          }));
        } else {
          throw new Error('No network and no cached gift list available');
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Fetch gift list failed',
        );
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  }
  static async submitGift(giftData: any) {
    try {
      // Check network connectivity
      console.log(giftData);
      const netInfo = await NetInfo.fetch();

      // If no network, save gift data to Realm
      if (!netInfo.isConnected) {
        console.log('No network, saving gift data locally to Realm.');
        await this.saveGiftToRealm(giftData);
        return {success: 'true'}; // Exit early since there is no network
      }

      // If network is available, send the data to the server
      const token = await Const.getTokenHeaderWithFOrmType();
      const formData = new FormData();
      formData.append('sales_man_id', giftData.sales_man_id);
      formData.append('outlet_id', giftData.outlet_id);
      formData.append('gift_id', giftData.gift_id);
      formData.append('quantity', giftData.quantity);
      formData.append('discription', giftData.discription);
      formData.append('location', 'west'); // Default to an empty string if undefined
      formData.append('uploaded_date', giftData.uploaded_date); // Convert to a Date object

      if (giftData.image) {
        formData.append('image', {
          uri: giftData.image,
          type: 'image/jpg',
          name: 'image.jpg',
        });
      }

      const response = await axios.post(
        `${Const.BASE_URL}api/m1/submit-gift`,
        formData,
        {
          headers: token,
        },
      );
      if (response.data.success) {
        return true;
      } else {
        throw new Error(response.data.message || 'Failed to submit gift');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Gift submission failed:', error.response, error.message);
        throw new Error(
          error.response?.data?.message || 'Gift submission failed',
        );
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  }

  // Save gift data to Realm if offline
  static async saveGiftToRealm(giftData: any) {
    try {
      // Generate a unique ID for this gift
      const giftId = uuid.v4();

      // Save the giftData into Realm
      realmObject.write(() => {
        realmObject.create('SaveGift', {
          id: giftId, // Use the randomly generated UUID as the primary key
          sales_man_id: giftData.sales_man_id,
          outlet_id: giftData.outlet_id,
          gift_id: giftData.gift_id,
          quantity: giftData.quantity,
          discription: giftData.discription ?? '',
          location: giftData.location || '', // Default to an empty string if undefined
          image: giftData.image || '', // Default to an empty string if undefined
          uploaded_date: new Date(giftData.uploaded_date), // Convert to a Date object
        });
      });

      console.log('Gift data saved locally in Realm with ID:', giftId);
    } catch (error) {
      console.log('Error saving gift data to Realm:', error);
    }
  }
  static async getSalesReturn(outletId?: string) {
    try {
      // Check network state
      const networkState = await NetInfo.fetch();

      if (networkState.isConnected) {
        console.log('Network is available');
        const user = Const.user;
        // Fetch data from API
        const token = await Const.getTokenHeader();
        const response = await axios.get(
          `${Const.BASE_URL}api/m1/sales/salesman/${user?.id}`,
          {
            headers: token,
            params: {
              outlet: outletId,
            },
          },
        );

        if (response.data.data) {
          const sales = response.data.data;
          try {
            realmObject.write(() => {
              realmObject.delete(realmObject.objects('Sale'));
              sales.forEach((sale: any) => {
                realmObject.create('Sale', {
                  id: sale.id.toString(),
                  type: sale.type.toString(),
                  outletId: outletId?.toString() || null,
                  date: sale.attributes.date.toString(),
                  isReturn: sale.attributes.is_return.toString(),
                  customerId: sale.attributes.customer_id.toString(),
                  customerName: sale.attributes.customer_name.toString(),
                  warehouseId: sale.attributes.warehouse_id.toString(),
                  warehouseName: sale.attributes.warehouse_name.toString(),
                  taxRate: sale.attributes.tax_rate.toString(),
                  taxAmount: sale.attributes.tax_amount.toString(),
                  discount: sale.attributes.discount.toString(),
                  shipping: sale.attributes.shipping.toString(),
                  grandTotal: sale.attributes.grand_total.toString(),
                  receivedAmount:
                    sale.attributes.received_amount?.toString() || null,
                  paidAmount: sale.attributes.paid_amount.toString(),
                  dueAmount: sale.attributes.due_amount.toString(),
                  paymentType: sale.attributes.payment_type.toString(),
                  note: sale.attributes.note?.toString() || null,
                  status: sale.attributes.status.toString(),
                  paymentStatus: sale.attributes.payment_status.toString(),
                  referenceCode: sale.attributes.reference_code.toString(),
                  barcodeUrl: sale.attributes.barcode_url.toString(),
                  createdAt: sale.attributes.created_at.toString(),
                  saleItems: sale.attributes.sale_items.map((item: any) => ({
                    id: item.id.toString(),
                    saleId: item.sale_id.toString(),
                    productId: item.product_id.map((product: any) => ({
                      name: product.name,
                      code: product.code,
                      product_code: product.product_code,
                      product_cost: product.product_cost,
                      product_price: product.product_price,
                      images: product.images.imageUrls,
                      in_stock: product.in_stock,
                      mainProductId: product.main_product_id,
                      assign_quantity: product.assign_quantity,
                      sale_unit_name: product.sale_unit_name.name,
                      product_unit_name: product.product_unit_name.name,
                      id: `${product.main_product_id}`,
                    })),
                    productPrice: item.product_price.toString(),
                    netUnitPrice: item.net_unit_price.toString(),
                    taxType: item.tax_type.toString(),
                    taxValue: item.tax_value.toString(),
                    taxAmount: item.tax_amount.toString(),
                    discountType: item.discount_type.toString(),
                    discountValue: item.discount_value.toString(),
                    discountAmount: item.discount_amount.toString(),
                    quantity: item.quantity.toString(),
                    subTotal: item.sub_total.toString(),
                    createdAt: item.created_at.toString(),
                    updatedAt: item.updated_at.toString(),
                  })),
                });
              }, Realm.UpdateMode.Modified);
            });
          } catch (error) {
            console.error('Failed to write sales to Realm:', error);
          }
          console.log('writing');

          return sales; // Return the sales data from the API
        } else {
          throw new Error('Failed to fetch sales returns');
        }
      } else {
        // If no network, fetch from local Realm cache
        console.log('Network is not available');

        const offlineSales = outletId
          ? realmObject.objects('Sale')
          : realmObject.objects('Sale');

        if (offlineSales.length > 0) {
          // Return cached sales
          return offlineSales.map((sale: any) => ({
            id: sale.id,
            type: sale.type,
            attributes: {
              date: sale.date,
              is_return: sale.isReturn,
              customerI_id: sale.customerId,
              customer_name: sale.customerName,
              warehouse_id: sale.warehouseId,
              warehouse_name: sale.warehouseName,
              tax_rate: sale.taxRate,
              tax_amount: sale.taxAmount,
              discount: sale.discount,
              shipping: sale.shipping,
              grand_total: sale.grandTotal,
              received_amount: sale.receivedAmount,
              paid_amount: sale.paidAmount,
              due_amount: sale.dueAmount,
              payment_type: sale.paymentType,
              note: sale.note,
              status: sale.status,
              payment_ctatus: sale.paymentStatus,
              reference_code: sale.referenceCode,
              sale_items: sale.saleItems.map((item: any) => ({
                id: item.id,
                sale_id: item.saleId,
                product_id: item.productId.map((product: any) => ({
                  name: product.name,
                  code: product.code,
                  product_code: product.product_code,
                  product_cost: product.product_cost,
                  product_price: product.product_price,
                  images: product.images,
                  in_stock: product.in_stock,
                  main_product_id: product.mainProductId,
                })),
                product_price: item.productPrice,
                net_unit_price: item.netUnitPrice,
                tax_type: item.taxType,
                tax_value: item.taxValue,
                tax_amount: item.taxAmount,
                discount_type: item.discountType,
                discount_value: item.discountValue,
                discount_amount: item.discountAmount,
                quantity: item.quantity,
                subTotal: item.subTotal,
                created_at: item.createdAt,
                updated_at: item.updatedAt,
              })),
              barcode_url: sale.barcodeUrl,
              created_at: sale.createdAt,
            },
          }));
        } else {
          throw new Error('No network and no cached sales return available');
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Fetch sales returns failed',
        );
      } else {
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  }

  static async createReturnSale(saleData: any) {
    try {
      // Check network connectivity
      const netInfo = await NetInfo.fetch();

      // If no network, save the sale return to Realm
      if (!netInfo.isConnected) {
        console.log('No network, saving sale return locally to Realm.');
        await this.saveReturnSaleToRealm(saleData);
        return {success: true}; // Exit early since there is no network
      }

      // If network is available, send the data to the server
      const token = await Const.getTokenHeader();
      const response = await axios.post(
        `${Const.BASE_URL}api/m1/sales-return`,
        saleData,
        {
          headers: token,
        },
      );

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Axios error:', error.response?.data?.message);
        throw new Error(
          error.response?.data?.message || 'Sale return creation failed',
        );
      } else {
        console.log('Unexpected error:', error);
        throw new Error('An unexpected error occurred. Please try again.');
      }
    }
  }

  // Save the sale return data to Realm if offline
  static async saveReturnSaleToRealm(saleData: any) {
    try {
      // Generate a random UUID for this sale return
      const saleReturnId = uuid.v4(); // Generate unique UUID

      // Save the saleData into the existing Realm instance (realmObject)
      realmObject.write(() => {
        realmObject.create(
          'SaveSaleReturn', // Use the updated schema name
          {
            id: saleReturnId, // Use the randomly generated UUID
            sale_id: saleData.sale_id, // Original sale ID (not unique)
            customer_id: saleData.customer_id,
            date: saleData.date,
            discount: saleData.discount,
            grand_total: saleData.grand_total,
            is_sale_created: saleData.is_sale_created,
            note: saleData.note,
            paid_amount: saleData.paid_amount,
            payment_status: saleData.payment_status,
            payment_type: saleData.payment_type,
            received_amount: saleData.received_amount,
            sale_items: JSON.stringify(saleData.sale_items), // Store as a string
            shipping: saleData.shipping,
            status: saleData.status,
            tax_amount: saleData.tax_amount,
            tax_rate: saleData.tax_rate,
            warehouse_id: saleData?.warehouse_id ?? 1,
            image: saleData.image,
            salesman_id: saleData.salesman_id,
          },
          Realm.UpdateMode.Modified, // Update if the primary key (UUID) exists
        );
      });

      console.log(
        'Sale return saved locally in Realm with UUID:',
        saleReturnId,
      );
    } catch (error) {
      console.log('Error saving sale return to Realm:', error);
    }
  }

  // Sync the sale return data from Realm when network is available
  static async syncReturnSales() {
    try {
      // Check network connectivity
      const netInfo = await NetInfo.fetch();

      // If network is available, sync the data
      if (netInfo.isConnected) {
        // Fetch all saved sale returns from Realm
        const saleReturns = realmObject.objects('SaveSaleReturn');

        // Sync each sale return
        for (const saleReturn of saleReturns) {
          try {
            const saleData = {
              ...saleReturn,
              sale_return_items: JSON.parse(saleReturn.sale_return_items), // Convert string back to JSON
            };
            await this.createReturnSale(saleData); // Attempt to send it to the server

            // Remove the sale return from Realm after successful sync
            realmObject.write(() => {
              realmObject.delete(saleReturn);
            });

            console.log('Sale return synced and removed from Realm.');
          } catch (error) {
            console.log('Error syncing sale return:', error);
          }
        }
      }
    } catch (error) {
      console.log('Error syncing sale returns from Realm:', error);
    }
  }

  static async syncGift() {
    try {
      // Check network connectivity
      const netInfo = await NetInfo.fetch();

      // If no network, return early
      if (!netInfo.isConnected) {
        console.log('No network available, cannot sync gifts.');
        return;
      }

      // Fetch unsynced gifts from Realm
      const unsyncedGifts = realmObject.objects('SaveGift');

      if (unsyncedGifts.length === 0) {
        console.log('No unsynced gifts found.');
        return;
      }

      // Loop through unsynced gifts and try to sync them
      for (const gift of unsyncedGifts) {
        try {
          // Prepare gift data
          const giftData = {
            sales_man_id: gift.sales_man_id,
            outlet_id: gift.outlet_id,
            gift_id: gift.gift_id,
            quantity: gift.quantity,
            discription: gift.discription || '',
            location: gift.location || 'west',
            uploaded_date: gift.uploaded_date, // Se
            image: gift.image || null,
          };

          // Attempt to submit the gift using the existing submitGift function
          const result = await this.submitGift(giftData);

          // If successfully synced, remove the gift from Realm
          if (result === true) {
            realmObject.write(() => {
              const giftToDelete = realmObject.objectForPrimaryKey(
                'SaveGift',
                gift.id,
              );
              if (giftToDelete) {
                realmObject.delete(giftToDelete);
                console.log(
                  'Successfully synced and removed gift from Realm:',
                  gift.id,
                );
              }
            });
          } else {
            console.log('Failed to sync gift:', gift.id);
          }
        } catch (error) {
          console.log('Error syncing gift:', gift.id, error.message);
          // Keep the unsynced gift in Realm for future attempts
        }
      }
    } catch (error) {
      console.log('Error in syncGift:', error.message);
    }
  }
}

export default ProductService;
