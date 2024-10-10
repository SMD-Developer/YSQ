// import React, {useState} from 'react';
// import {View, StyleSheet, SafeAreaView, TouchableOpacity, FlatList, Text} from 'react-native';
// import {Icon} from 'react-native-paper';
// import {COLORS} from '../../constants/colors';
// import {RootStackParamList, ROUTES} from '../../routes/routes_name';
// import {StackNavigationProp} from '@react-navigation/stack';
// import MainAppBar from '../../components/custom_main_app_bar';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import CustomTextField from '../../components/custom_text_field';
// import { Const } from '../../constants/const_value';

// type SaleHistoryScreenNavigationProp = StackNavigationProp<
//   RootStackParamList,
//   typeof ROUTES.CashHistory
// >;

// interface SaleHistoryScreenProps {
//   navigation: SaleHistoryScreenNavigationProp;
// }
// const CashHistoryScreen: React.FC<SaleHistoryScreenProps> = ({navigation}) => {
//   // const renderSaleItem = ({item}: {item: Sale}) => {
//   //   var payment = paymentOptions.filter(
//   //     element =>
//   //       element.id.toString() === item.attributes.payment_type.toString(),
//   //   );
//   //   var paymentMethod = payment.length > 0 ? payment[0].name : '-';
//   //   return (
//   //     <TouchableOpacity
//   //       style={styles.tableRow}
//   //       onPress={() =>
//   //         navigation.navigate(ROUTES.SaleDetailScreen, {sale: item,screenType:route.params.screenType??1})
//   //       }>
//   //       <View style={styles.outletInfo}>
//   //         <Text style={styles.heading}>#{item.id}</Text>
//   //         <Text style={styles.outletName}>
//   //           {Const.getFormatedDate(item.attributes.created_at)}
//   //         </Text>
//   //         <Text style={styles.heading}>Outlet Name</Text>
//   //         <Text style={styles.outletName}>{item.attributes.customer_name}</Text>

//   //         {/* Heading for Payment Method */}
//   //         {route.params.screenType !== 3 && (
//   //           <View>
//   //             <Text style={styles.heading}>Payment Method</Text>
//   //             <Text style={styles.paymentMethod}>{paymentMethod}</Text>
//   //           </View>
//   //         )}
//   //       </View>
//   //       <View>
//   //         <Text
//   //           style={styles.amount}>{`Rp ${item.attributes.grand_total}`}</Text>
//   //         <Icon source="store" size={40} color={COLORS.PRIMARY} />
//   //         {/* <Image
//   //         source={
//   //           row.imageUri
//   //             ? {uri: row.imageUri}
//   //             : require('../../assets/chair.png')
//   //         }
//   //         style={styles.outletImage}
//   //       /> */}
//   //       </View>
//   //     </TouchableOpacity>
//   //   );
//   // };
//   const [date, setDate] = useState<Date>(new Date());
//   const [searchQuery, setSearchQuery] = useState<string>('');
//   const [showDate, setShowDatePicker] = useState<boolean>(false);
//   const handleDateChange = (event: any, selectedDate?: Date) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       setDate(selectedDate);
//     }
//   };
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(
//     'All',
//   );

//   return (
//     <SafeAreaView style={styles.container}>
//       <MainAppBar title={Const.languageData?.Cash_History ??'Cash History'} isPrimary={false} />
//       {
//         <View>
//           <View
//             style={{
//               flexDirection: 'row',
//             }}>
//             <CustomTextField
//               // eslint-disable-next-line react-native/no-inline-styles
//               style={{paddingHorizontal: 15, flex: 1}}
//               value={searchQuery}
//               placeholder={Const.languageData?.Search_Cash ??'Search Cash'}
//               onChangeText={(text: string) => {}}
//             />
//             <TouchableOpacity
//               style={{marginRight: 15, marginTop: 10}}
//               onPress={() => setShowDatePicker(true)}>
//               <Icon source="filter-outline" size={30} color={COLORS.PRIMARY} />
//             </TouchableOpacity>
//           </View>

//           {showDate && (
//             <DateTimePicker
//               value={date}
//               accentColor={COLORS.PRIMARY}
//               textColor={COLORS.PRIMARY}
//               mode="date"
//               display="default"
//               onChange={handleDateChange}
//             />
//           )}

//           <View style={{flexDirection: 'row'}}>
//             <FlatList
//               style={{marginLeft: 20, height: 30}}
//               data={[
//                 {id: 'All', name: 'All'},
//                 {id: 'Opening', name: 'Opening'},
//                 {id: 'Closing', name: 'Closing'},
//               ]}
//               horizontal
//               showsHorizontalScrollIndicator={false}
//               keyExtractor={item => item.id.toString()}
//               renderItem={({item}) => (
//                 <TouchableOpacity
//                   style={[
//                     styles.categoryChip,
//                     (selectedCategory === item.name ||
//                       (item.name === 'All' && selectedCategory === null)) &&
//                       styles.selectedCategoryChip,
//                   ]}
//                   onPress={() => {
//                     setSelectedCategory(item.name);
//                     if (item.name === 'All') {
//                       // setFilterData(data);
//                     } else {
//                       // setFilterData(
//                       //   data.filter(
//                       //     record =>
//                       //       record.type.toLowerCase() === item.name.toLowerCase(),
//                       //   ),
//                       // );
//                     }
//                   }}>
//                   <Text
//                     style={[
//                       styles.categoryText,
//                       (selectedCategory === item.name ||
//                         (item.name === 'All' && selectedCategory === null)) &&
//                         styles.selectedCategoryText,
//                     ]}>
//                     {item.name.toString()}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             />
//           </View>
//           {/* <FlatList
//             data={filteredData}
//             renderItem={renderSaleItem}
//             keyExtractor={item => item.id.toString()}
//             contentContainerStyle={styles.listContainer}
//           /> */}
//         </View>
//       }
//     </SafeAreaView>
//   );
// };

// export default CashHistoryScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFF',
//   },
//   tableContainer: {
//     paddingBottom: 20,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//   },
//   tableRow: {
//     flexDirection: 'row',
//     backgroundColor: '#F5F5F5',
//     marginHorizontal: 15,
//     marginVertical: 10,
//     elevation: 3,
//     paddingVertical: 10,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//   },
//   outletInfo: {
//     flex: 1,
//   },
//   outletImage: {
//     width: 50,
//     height: 50,
//     borderRadius: 8,
//     marginLeft: 10,
//   },
//   heading: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#555',
//     marginTop: 4,
//   },
//   outletName: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 8,
//   },
//   paymentMethod: {
//     fontSize: 16,
//     color: '#333',
//     marginTop: 4,
//   },
//   amount: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: 'grey',
//     marginTop: 4,
//     marginBottom: 15,
//   },
//   tableHeaderText: {
//     fontWeight: 'bold',
//     textAlign: 'left',
//     color: 'black',
//     fontSize: 16,
//   },
//   tabLabel: {
//     fontSize: 14,
//     textAlign: 'center',
//   },
//   appBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 15,
//     backgroundColor: '#FFF',
//     textAlign: 'center',
//     marginBottom: 20,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     paddingBottom: 10,
//   },
//   appBarTitle: {
//     color: 'grey',
//     fontSize: 23,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     justifyContent: 'center',
//   },
//   listContainer: {
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     paddingBottom: 130,
//     flexGrow: 1,
//   },
//   saleItem: {
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     padding: 15,
//     marginVertical: 10,
//     borderWidth: 1,
//     borderColor: COLORS.PRIMARY, // Blue border
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 1},
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   goodImage: {
//     width: '100%',
//     height: 150,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   productList: {
//     marginBottom: 10,
//   },
//   productItem: {
//     flexDirection: 'row',
//     marginBottom: 10,
//   },
//   productImage: {
//     width: 60,
//     height: 60,
//     borderRadius: 10,
//     marginRight: 15,
//   },
//   productInfo: {
//     flex: 1,
//   },
//   productName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   productDetails: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   productQuantity: {
//     fontSize: 14,
//     color: COLORS.PRIMARY,
//   },
//   productPrice: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: COLORS.PRIMARY,
//   },
//   promotion: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: COLORS.PRIMARY,
//     marginBottom: 10,
//   },
//   comment: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 5,
//   },
//   paymentType: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 10,
//   },
//   categoriesContainer: {
//     height: 30,
//     marginBottom: 20,
//   },
//   categoryChip: {
//     marginBottom: 0,
//     height: 30,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 15,
//     marginRight: 10,
//   },
//   selectedCategoryChip: {
//     backgroundColor: COLORS.PRIMARY,
//     height: 30,
//   },
//   categoryText: {
//     color: '#000',
//     fontSize: 14,
//   },
//   selectedCategoryText: {
//     color: '#fff',
//   },
// });
