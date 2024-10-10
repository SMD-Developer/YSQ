export class LanguageModel {
  ysq: string;
  Email: string;
  Password: string;
  Login: string;
  Forgot_Password: string;
  Email_is_required: string;
  Password_is_required: string;
  Invalid_email_or_password: string;
  Dashboard: string;
  Products: string;

  Sales: string;
  Returns: string;
  Gifts: string;
  Profile: string;
  Logout: string;
  Opening_Cash: string;
  Closing_Cash: string;
  Promotions: string;
  All_Promotions: string;
  Chekin_at_outlet_hint: string;
  Opening: string;
  Closing: string;
  View_all: string;
  Today: string;
  Yesterday: string;
  All: string;
  Routes: string;
  Completed: string;
  Mileage_Start_Record: string;
  Mileage_End_Record: string;
  Mileage_History: string;
  Cancel: string;
  Ok: string;
  Save: string;
  Submit: string;
  POS: string;
  Checkin: string;
  Confirm: string;
  Comments: string;
  Payment: string;
  Payment_methods: string;
  Choose_payment_method: string;
  Cash: string;
  Cheque: string;
  Credit_limit: string;
  Print_Receipt: string;
  Back_to_home: string;
  Select_products: string;
  Select_gifts: string;
  Language: string;
  Select_Language: string;
  Next: string;
  Country: string;
  Select_Country: string;

  // New Fields
  Record: string;
  Record_History: string;
  Mileage: string;
  Type: string;
  Record_Start_Mileage: string;
  Record_End_Mileage: string;
  Enter_Start_Mileage: string;
  Enter_End_Mileage: string;
  Vehicle_Image_With_Number_Plate: string;
  Mileage_Image_Showing_Current_Record: string;
  Tap_to_upload: string;
  End_current_route: string;

  Category: string;
  Phone: string;
  City: string;
  Address: string;
  Select_Location: string;
  Todays_Routes: string;
  Todays_Sale: string;
  Total_Sale: string;
  Todays_Cash_Received: string;
  Notifications: string;
  Start: string;
  End: string;
  Product_Selection: string;
  No_Product_Selected: string;
  No_Promotion_Selected: string;
  Apply_Promotion: string;
  Upload_Goods_Photo: string;
  Enter_comment_or_review: string;
  No_payment_method_selected: string;
  Deliver: string;
  Delivery_Successful: string;
  Return: string;
  Return_Successful: string;
  No_gift_selected: string;
  Gift_Delivered: string;
  Upload_Gifts_Photo: string;
  Choose_language: string;
  Change_language: string;
  Checkin_to_outlet: string;
  Valid_till: string;
  Account_information: string;
  Name: string;
  Product_Details: string;
  Description: string;
  Quantity: string;
  Price: string;
  Product_Image: string;
  Enter_email_address: string;
  Enter_phone_number: string;
  Enter_address: string;
  Enter_city: string;
  Enter_country: string;
  Enter_credit_limit: string;
  Sales_History: string;
  Return_History: string;
  Gift_History: string;
  Confirmation: string;
  Want_to_start_trip: string;
  Arrival: string;
  Minutes: string;
  End_Trip: string;
  Route_completed: string;
  Start_mileage: string;
  End_Mileage: string;
  Succefully_reached_outlet_location: string;
  Fill_all_fields_and_upload_images: string;
  Home: string;
  KM: string;
  Trips: string;
  Cash_History: string;

  Customer_name: string;
  Select_Filter: string;
  Last_7_Days: string;
  Last_30_Days: string;
  This_Month: string;
  Search_customer: string;
  Last_Month: string;
  Custom: string;
  No_comments: string;
  Returned_items: string;
  Return_ID: string;
  Cash_ID: string;
  Amount: string;
  Gift_ID: string;
  Warehouse_Name: string;
  Warehouse: string;
  Upcoming: string;
  No_data_available: string;
  Search_your_location: string;
  Enter_customer_name: string;
  No_any_notification_currently: string;
  Failed_to_place_order: string;
  Please_upload_product_photo: string;
  Quantity_less_equal_to_stock: string;


  Search_Cash: string;
  Search_Mileage: string;
  Search_Sales: string;
  Payment_Method: string;
  ID: string;
  Date: string;
  Total_Amount: string;
  Discount: string;
  Final_Amount: string;
  Sold_Items: string;
  Reference_code: string;
  Sale_Details: string;
  Search_Product: string;
  SKU_Code: string;
  Latitude: string;
  Longitude: string;
  Search_Return: string;
  Search_Gifts: string;
  Success: string;
  Submitted: string;
  Record_submitted_description: string;
  Go_Back: string;
  Delivery: string;
  Close: string;
  Please_select_atleast_one_product: string;
  Selected_Products: string;
  Total: string;
  Available_coupons: string;
  Apply: string;
  Applied: string;
  Remove_coupon: string;
  Back: string;
  Upload_photo: string;
  Uploaded_photo: string;
  Gift_Details: string;
  Items_Photo: string;
  Add_comments: string;
  Finish: string;
  Please_select_payment_method: string;
  Select: string;
  Date_Time: string;
  Coupon_Applied: string;
  Order_ID: string;
  Choose_Order_ID: string;
  Please_select_any_order_id: string;
  Select_a_Gift: string;
  Please_select_atleast_one_gift: string;
  Gift_Successful: string;
  Remove: string;
  Return_Details: string;

  // Customer-related fields
  Customer: string;
  Customers: string;
  Add_Customer: string;
  Edit_Customer: string;
  Customer_Details: string;
  Customer__Type: string;
  Choose_Customer_Type: string;
  Area: string;
  Choose_Area: string;
  Channel_Type: string;
  Choose_Channel_Type: string;
  Salesman_ID: string;
  Avl_Stock: string;
  Product_Type: string;

  constructor(data: Partial<LanguageModel>) {
    this.ysq = data.ysq || 'YSQ';
    this.Uploaded_photo = data.Uploaded_photo || 'Uploaded Photo';
    this.Category = data.Category || 'Category';
    this.Chekin_at_outlet_hint =
      data.Chekin_at_outlet_hint ||
      'Click on the above button to Checkin at the outlet and sell products.';
    this.Email = data.Email || 'Email';
    this.Password = data.Password || 'Password';
    this.Return_Details = data.Return_Details || 'Return_Details';
    this.Login = data.Login || 'Login';
    this.Forgot_Password = data.Forgot_Password || 'Forgot Password?';
    this.Email_is_required = data.Email_is_required || 'Email is required';
    this.Password_is_required =
      data.Password_is_required || 'Password is required';
    this.Invalid_email_or_password =
      data.Invalid_email_or_password || 'Invalid email or password';
    this.Dashboard = data.Dashboard || 'Dashboard';
    this.Products = data.Products || 'Products';
    this.Sales = data.Sales || 'Sales';
    this.Returns = data.Returns || 'Returns';
    this.Gift_Details = data.Gift_Details || 'Gift_Details';
    this.Gifts = data.Gifts || 'Gifts';
    this.Profile = data.Profile || 'Profile';
    this.Logout = data.Logout || 'Logout';
    this.Opening_Cash = data.Opening_Cash || 'Opening Cash';
    this.Closing_Cash = data.Closing_Cash || 'Closing Cash';
    this.Promotions = data.Promotions || 'Promotions';
    this.All_Promotions = data.All_Promotions || 'All Promotions';
    this.View_all = data.View_all || 'View all';
    this.Today = data.Today || 'Today';
    this.Yesterday = data.Yesterday || 'Yesterday';
    this.All = data.All || 'All';
    this.Opening = data.Opening || 'Opening';
    this.Closing = data.Closing || 'Closing';
    this.Routes = data.Routes || 'Routes';
    this.Completed = data.Completed || 'Completed';
    this.Mileage_Start_Record =
      data.Mileage_Start_Record || 'Mileage Start Record';
    this.Mileage_End_Record = data.Mileage_End_Record || 'Mileage End Record';
    this.Mileage_History = data.Mileage_History || 'Mileage History';
    this.Cancel = data.Cancel || 'Cancel';
    this.Ok = data.Ok || 'Ok';
    this.Save = data.Save || 'Save';
    this.Submit = data.Submit || 'Submit';
    this.POS = data.POS || 'POS';
    this.Checkin = data.Checkin || 'Checkin';
    this.Confirm = data.Confirm || 'Confirm';
    this.Comments = data.Comments || 'Comments';
    this.Payment = data.Payment || 'Payment';
    this.Payment_methods = data.Payment_methods || 'Payment methods';
    this.Choose_payment_method =
      data.Choose_payment_method || 'Choose payment method';
    this.Cash = data.Cash || 'Cash';
    this.Cheque = data.Cheque || 'Cheque';
    this.Credit_limit = data.Credit_limit || 'Credit limit';
    this.Print_Receipt = data.Print_Receipt || 'Print Receipt';
    this.Back_to_home = data.Back_to_home || 'Back to home';
    this.Select_products = data.Select_products || 'Select products';
    this.Select_gifts = data.Select_gifts || 'Select gifts';
    this.Language = data.Language || 'Language';
    this.Select_Language = data.Select_Language || 'Select Language';
    this.Next = data.Next || 'Next';
    this.Country = data.Country || 'Country';
    this.Select_Country = data.Select_Country || 'Select Country';

    // New Fields
    this.Record = data.Record || 'Record';
    this.Record_History = data.Record_History || 'Record History';
    this.Mileage = data.Mileage || 'Mileage';
    this.Type = data.Type || 'Type';
    this.Record_Start_Mileage =
      data.Record_Start_Mileage || 'Record Start Mileage';
    this.Record_End_Mileage = data.Record_End_Mileage || 'Record End Mileage';
    this.Enter_Start_Mileage =
      data.Enter_Start_Mileage || 'Enter Start Mileage';
    this.Enter_End_Mileage = data.Enter_End_Mileage || 'Enter End Mileage';
    this.Vehicle_Image_With_Number_Plate =
      data.Vehicle_Image_With_Number_Plate ||
      'Vehicle Image (With Number Plate)';
    this.Mileage_Image_Showing_Current_Record =
      data.Mileage_Image_Showing_Current_Record ||
      'Mileage Image (Showing Current Record)';
    this.Tap_to_upload = data.Tap_to_upload || 'Tap to upload';
    this.End_current_route = data.End_current_route || 'End current route';
    this.Phone = data.Phone || 'Phone';
    this.City = data.City || 'City';
    this.Address = data.Address || 'Address';
    this.Select_Location = data.Select_Location || 'Select Location';
    this.Todays_Routes = data.Todays_Routes || "Today's Routes";
    this.Todays_Sale = data.Todays_Sale || "Today's Sale";
    this.Total_Sale = data.Total_Sale || 'Total Sale';
    this.Todays_Cash_Received =
      data.Todays_Cash_Received || "Today's Cash Received";
    this.Notifications = data.Notifications || 'Notifications';
    this.Start = data.Start || 'Start';
    this.End = data.End || 'End';
    this.Product_Selection = data.Product_Selection || 'Product Selection';
    this.No_Product_Selected =
      data.No_Product_Selected || 'No Product Selected';
    this.No_Promotion_Selected =
      data.No_Promotion_Selected || 'No Promotion Selected';
    this.Apply_Promotion = data.Apply_Promotion || 'Apply Promotion';
    this.Upload_Goods_Photo = data.Upload_Goods_Photo || 'Upload Goods Photo';
    this.Enter_comment_or_review =
      data.Enter_comment_or_review || 'Enter comment or review';
    this.No_payment_method_selected =
      data.No_payment_method_selected || 'No payment method selected';
    this.Deliver = data.Deliver || 'Deliver';
    this.Delivery_Successful =
      data.Delivery_Successful || 'Delivery Successful';
    this.Return = data.Return || 'Return';
    this.Return_Successful = data.Return_Successful || 'Return Successful';
    this.No_gift_selected = data.No_gift_selected || 'No gift selected';
    this.Gift_Delivered = data.Gift_Delivered || 'Gift Delivered';
    this.Upload_Gifts_Photo = data.Upload_Gifts_Photo || 'Upload Gifts Photo';
    this.Choose_language = data.Choose_language || 'Choose language';
    this.Change_language = data.Change_language || 'Change language';
    this.Checkin_to_outlet = data.Checkin_to_outlet || 'Check-in to outlet';
    this.Valid_till = data.Valid_till || 'Valid till';
    this.Account_information =
      data.Account_information || 'Account information';
    this.Name = data.Name || 'Name';
    this.Product_Details = data.Product_Details || 'Product Details';
    this.Description = data.Description || 'Description';
    this.Quantity = data.Quantity || 'Quantity';
    this.Price = data.Price || 'Price';
    this.Product_Image = data.Product_Image || 'Product Image';
    this.Enter_email_address =
      data.Enter_email_address || 'Enter email address';
    this.Enter_phone_number = data.Enter_phone_number || 'Enter phone number';
    this.Enter_address = data.Enter_address || 'Enter address';
    this.Enter_city = data.Enter_city || 'Enter city';
    this.Enter_country = data.Enter_country || 'Enter country';
    this.Enter_credit_limit = data.Enter_credit_limit || 'Enter credit limit';
    this.Sales_History = data.Sales_History || 'Sales History';
    this.Return_History = data.Return_History || 'Return History';
    this.Gift_History = data.Gift_History || 'Gift History';
    this.Confirmation = data.Confirmation || 'Confirmation';
    this.Want_to_start_trip = data.Want_to_start_trip || 'Want to start trip?';
    this.Arrival = data.Arrival || 'Arrival';
    this.Minutes = data.Minutes || 'Minutes';
    this.End_Trip = data.End_Trip || 'End Trip';
    this.Route_completed = data.Route_completed || 'Route completed';
    this.Start_mileage = data.Start_mileage || 'Start mileage';
    this.End_Mileage = data.End_Mileage || 'End Mileage';
    this.Succefully_reached_outlet_location =
      data.Succefully_reached_outlet_location ||
      'Successfully reached outlet location';
    this.Fill_all_fields_and_upload_images =
      data.Fill_all_fields_and_upload_images ||
      'Fill all fields and upload images';
    this.Home = data.Home || 'Home';
    this.KM = data.KM || 'KM';
    this.Trips = data.Trips || 'Trips';
    this.Search_Cash = data.Search_Cash || 'Search Cash';
    this.Search_customer = data.Search_customer || 'Search_customer';
    this.Search_Mileage = data.Search_Mileage || 'Search Mileage';
    this.Search_Sales = data.Search_Sales || 'Search Sales';
    this.Payment_Method = data.Payment_Method || 'Payment Method';

    this.Customer_name = data.Customer_name || 'Customer Name';
    this.Last_7_Days = data.Last_7_Days || 'Last 7 Days';
    this.Select_Filter = data.Select_Filter || 'Select Filter';
    this.Last_30_Days = data.Last_30_Days || 'Last 30 Days';
    this.This_Month = data.This_Month || 'This Month';
    this.Last_Month = data.Last_Month || 'Last Month';
    this.Custom = data.Custom || 'Custom';
    this.No_comments = data.No_comments || 'No comments';
    this.Returned_items = data.Returned_items || 'Returned Items';
    this.Return_ID = data.Return_ID || 'Return ID';
    this.Cash_ID = data.Cash_ID || 'Cash ID';
    this.Amount = data.Amount || 'Amount';
    this.Gift_ID = data.Gift_ID || 'Gift ID';
    this.Warehouse_Name = data.Warehouse_Name || 'Warehouse Name';
    this.Warehouse = data.Warehouse || 'Warehouse';
    this.Upcoming = data.Upcoming || 'Upcoming';
    this.No_data_available = data.No_data_available || 'No data available';
    this.Search_your_location =
      data.Search_your_location || 'Search your location';
    this.Enter_customer_name =
      data.Enter_customer_name || 'Enter customer name';
    this.No_any_notification_currently =
      data.No_any_notification_currently || 'No any notification currently';
    this.Failed_to_place_order =
      data.Failed_to_place_order || 'Failed to place order';
    this.Please_upload_product_photo =
      data.Please_upload_product_photo || 'Please upload product photo';
    this.Quantity_less_equal_to_stock =
      data.Quantity_less_equal_to_stock || 'Quantity should be less than or equal to available stock';

    this.ID = data.ID || 'ID';
    this.Date = data.Date || 'Date';
    this.Total_Amount = data.Total_Amount || 'Total Amount';
    this.Discount = data.Discount || 'Discount';
    this.Final_Amount = data.Final_Amount || 'Final Amount';
    this.Sold_Items = data.Sold_Items || 'Sold Items';
    this.Reference_code = data.Reference_code || 'Reference code';
    this.Sale_Details = data.Sale_Details || 'Sale Details';
    this.Search_Product = data.Search_Product || 'Search Product';
    this.SKU_Code = data.SKU_Code || 'SKU Code';
    this.Latitude = data.Latitude || 'Latitude';
    this.Longitude = data.Longitude || 'Longitude';
    this.Search_Return = data.Search_Return || 'Search Return';
    this.Search_Gifts = data.Search_Gifts || 'Search Gifts';
    this.Success = data.Success || 'Success';
    this.Submitted = data.Submitted || 'Submitted';
    this.Record_submitted_description =
      data.Record_submitted_description || 'Record submitted successfully.';
    this.Go_Back = data.Go_Back || 'Go Back';
    this.Delivery = data.Delivery || 'Delivery';
    this.Close = data.Close || 'Close';
    this.Please_select_atleast_one_product =
      data.Please_select_atleast_one_product ||
      'Please select at least one product';
    this.Selected_Products = data.Selected_Products || 'Selected Products';
    this.Total = data.Total || 'Total';
    this.Available_coupons = data.Available_coupons || 'Available coupons';
    this.Apply = data.Apply || 'Apply';
    this.Applied = data.Applied || 'Applied';
    this.Remove_coupon = data.Remove_coupon || 'Remove coupon';
    this.Back = data.Back || 'Back';
    this.Upload_photo = data.Upload_photo || 'Upload photo';
    this.Items_Photo = data.Items_Photo || 'Items Photo';
    this.Add_comments = data.Add_comments || 'Add comments';
    this.Finish = data.Finish || 'Finish';
    this.Please_select_payment_method =
      data.Please_select_payment_method || 'Please select payment method';
    this.Select = data.Select || 'Select';
    this.Date_Time = data.Date_Time || 'Date & Time';
    this.Coupon_Applied = data.Coupon_Applied || 'Coupon Applied';
    this.Order_ID = data.Order_ID || 'Order ID';
    this.Choose_Order_ID = data.Choose_Order_ID || 'Choose Order ID';
    this.Please_select_any_order_id =
      data.Please_select_any_order_id || 'Please select any order id';
    this.Select_a_Gift = data.Select_a_Gift || 'Select a Gift';
    this.Please_select_atleast_one_gift =
      data.Please_select_atleast_one_gift || 'Please select at least one gift';
    this.Gift_Successful = data.Gift_Successful || 'Gift Successful';
    this.Remove = data.Remove || 'Remove';
    this.Cash_History = data.Cash_History || 'Cash_History';
    this.Product_Selection = data.Product_Selection || 'Product Selection';
    this.Chekin_at_outlet_hint =
      data.Chekin_at_outlet_hint ||
      'Click on the above button to Checkin at the outlet and sell products.';
    this.Notifications = data.Notifications || 'Notifications';
    this.Total_Sale = data.Total_Sale || 'Total Sale';
    this.Total = data.Total || 'Total';
    this.Items_Photo = data.Items_Photo || 'Items Photo';

    // Customer-related fields
    this.Customer = data.Customer || 'Customer';
    this.Customers = data.Customers || 'Customers';
    this.Add_Customer = data.Add_Customer || 'Add Customer';
    this.Edit_Customer = data.Edit_Customer || 'Edit Customer';
    this.Customer_Details = data.Customer_Details || 'Customer Details';
    this.Customer__Type = data.Customer__Type || 'Customer Type';
    this.Choose_Customer_Type =
      data.Choose_Customer_Type || 'Choose Customer Type';
    this.Area = data.Area || 'Area';
    this.Choose_Area = data.Choose_Area || 'Choose Area';
    this.Channel_Type = data.Channel_Type || 'Channel Type';
    this.Choose_Channel_Type =
      data.Choose_Channel_Type || 'Choose Channel Type';
    this.Salesman_ID = data.Salesman_ID || 'Salesman ID';
    this.Avl_Stock = data.Avl_Stock || 'Avl. Stock';
    this.Product_Type = data.Product_Type || 'Product Type';
  }
}
