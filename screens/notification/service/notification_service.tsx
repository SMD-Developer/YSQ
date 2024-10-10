import axios from 'axios';
import {Const} from '../../../constants/const_value';
import NetInfo from '@react-native-community/netinfo';
import {realmObject} from '../../../routes/realm';
import User from '../../login/models/user_model';

const NotificationService = {
 
  async getNotifications(): Promise<any> {
    const networkState = await NetInfo.fetch();
    if (networkState.isConnected) {
      try {
        const user = await User.getUser();
        const getTokenHeader = await Const.getTokenHeader(); // Assume this fetches your token
        const response = await axios.get(
         `${Const.BASE_URL}api/m1/get-all-notifications/${user?.id}`,
          {
            headers: getTokenHeader,
          },
        );

        const outletsData = response.data.data; // Assuming your API response returns an array of outlets in data

        // Store data in Realm
        // realmObject.write(() => {x
        //   // Remove old entries if necessary (optional)
        //   const existingOutlets = realmObject.objects('Outlet');
        //   realmObject.delete(existingOutlets);

        //   // Insert new data
        //   outletsData.forEach((outlet: AddOutletModel) => {
        //     realmObject.create('Outlet', outlet, Realm.UpdateMode.Modified);
        //   });
        // });

        // Return the freshly fetched data
        return outletsData;
      } catch (error) {
        console.error('Error fetching outlets:', error);
        throw error;
      }
    } else {
      try {
        console.log('Fetching outlets from Realm');
        const outlets = realmObject.objects<AddOutletModel>('Outlet');

        // Convert Realm objects to a plain JavaScript array
        const outletsArray = outlets.map(outlet => ({
          id: outlet.id,
          name: outlet.name,
          email: outlet.email,
          phone: outlet.phone,
          country: outlet.country,
          city: outlet.city,
          address: outlet.address,
          latitude: outlet.latitude,
          longitude: outlet.longitude,
          credit_limit: outlet.credit_limit,
          area: outlet.area,
          userType: outlet.userType,
          channel: outlet.channel,
        }));

        // Return the local data
        return outletsArray;
      } catch (error) {
        console.error('Error fetching outlets from Realm:', error);
        throw error;
      }
    }
  }

};

export default NotificationService;
