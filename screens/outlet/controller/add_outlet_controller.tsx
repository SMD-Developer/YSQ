import {useEffect, useRef, useState} from 'react';
import {AddOutletModel} from '../modle/add_outlet_model';
import OutletService from '../service/outlet_service';
import {Const} from '../../../constants/const_value';
import MapView, {Region} from 'react-native-maps';
import {ROUTES} from '../../../routes/routes_name';

const useAddOutletController = (editOutlet: AddOutletModel | null) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [isEdit, setisEdit] = useState<boolean>(false);
  const [areaList, setAreaList] = useState<any[]>([]);
  const [channelList, setChannelList] = useState<any[]>([]);
  const [userTypeList, setUserTypeList] = useState<any[]>([]);
  const [origin, setOrigin] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const mapRef = useRef<MapView>(null);

  const [outlet, setOutlet] = useState<AddOutletModel>({
    id: null,
    name: '',
    email: '',
    country: '',
    phone: '',
    city: '',
    address: '',
    postal_code: '',
    credit_limit: '',
    channel: '',
    latitude: '',
    longitude: '',
    area: '',
    userType: '',
    areaDetails: {},
    channelDetails: {},
    assigned_date: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const initializeLocation = async () => {
    try {
      const {latitude, longitude} = await Const.getCurrentLocation();
      setOriginLocation();
      setOutlet(prevOutlet => ({
        ...prevOutlet,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      }));
      if (mapRef.current) {
        const region: Region = {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        mapRef.current.animateToRegion(region, 1000);
      }
    } catch (error: any) {
      setSnackbarMessage('Failed to get current location.');
      setVisible(true);
    }
  };

  const fetchAreaList = async () => {
    try {
      const areas = await OutletService.getAreaList();
      setAreaList(areas); // Set the area list in state
    } catch (error: any) {
    } finally {
    }
  };
  const fetchChannelList = async () => {
    try {
      const areas = await OutletService.getChannelList();
      setChannelList(areas); // Set the area list in state
    } catch (error: any) {
    } finally {
    }
  };
  const fetchUserTypeList = async () => {
    try {
      const areas = await OutletService.getUserTypeList();
      setUserTypeList(areas); // Set the area list in state
    } catch (error: any) {
    } finally {
    }
  };
  const setOriginLocation = async () => {
    const {latitude, longitude} = await Const.getCurrentLocation();
    setOrigin({latitude, longitude});
  };
  useEffect(() => {

    if (editOutlet) {
      setisEdit(true);
    
      setOutlet({
        address: editOutlet.address,
        postal_code: editOutlet.postal_code,
        area: editOutlet.areaDetails.id,
        assigned_date: editOutlet.assigned_date,
        areaDetails: editOutlet.areaDetails,
        channel: editOutlet.channelDetails.id,
        channelDetails: editOutlet.channelDetails,
        city: editOutlet.city,
        country: editOutlet.country,
        credit_limit: editOutlet.credit_limit,
        email: editOutlet.email,
        id: editOutlet.id,
        latitude: editOutlet.latitude,
        longitude: editOutlet.longitude,
        name: editOutlet.name,
        phone: editOutlet.phone,
        userType: "",

      });
      setOriginLocation();
      if (mapRef.current && editOutlet.latitude && editOutlet.longitude) {
        const region: Region = {
          latitude: parseFloat(editOutlet.latitude ?? '0.0'),
          longitude: parseFloat(editOutlet.longitude ?? '0.0'),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        //console.log(region);
        mapRef.current.animateToRegion(region, 1000);
      } else {
        initializeLocation();
      }
    } else {
      initializeLocation();
      setOutlet({...outlet, area: Const.user?.area ?? '', country: Const.user?.country ?? ''});
    }


    fetchAreaList();
    fetchUserTypeList();
    fetchChannelList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editOutlet]);

  const onSave = async (navigation: any) => {
    const {
      name,
      email,
      country,
      phone,
      city,
      address,
      postal_code,
      area,
      userType,
      channel,
      credit_limit: creditLimit,
    } = outlet;
    if (
      !name ||
      !email ||
      !country ||
      !phone ||
      // !city ||
      !postal_code ||
      !address ||
      !creditLimit ||
      !area ||
      !channel
    ) {
      setSnackbarMessage('Please fill all fields.');
      setVisible(true);
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await OutletService.editOutlet(outlet);
        setSnackbarMessage('Outlet Updated successfully');
        setVisible(true);
      } else {
        await OutletService.addOutlet(outlet);
        setSnackbarMessage('Outlet Added successfully');
        setVisible(true);
        setOutlet({
          id: null,
          area: '',
          userType: '',
          name: '',
          email: '',
          country: '',
          phone: '',
          city: '',
          address: '',
          postal_code: '',
          credit_limit: '',
          channel: '',
          latitude: '',
          longitude: '',
          areaDetails: {},
          channelDetails: {},
          assigned_date: '',
        });
        navigation.replace(ROUTES.AddOutletSuccessScreen);
      }
    } catch (error: any) {
      const message =
        error.message || 'An unexpected error occurred. Please try again.';

      setSnackbarMessage(message);
      setVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarDismiss = () => {
    setVisible(false);
  };

  return {
    outlet,
    setOutlet,
    visible,
    snackbarMessage,
    handleSnackbarDismiss,
    onSave,
    loading,
    mapRef,
    origin,
    areaList,
    userTypeList,
    channelList,
  };
};

export default useAddOutletController;
