import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList, ROUTES} from '../../routes/routes_name';
import {COLORS} from '../../constants/colors';
import MainAppBar from '../../components/custom_main_app_bar';
import CustomSnackbar from '../../components/custom_snackbar';
import {Const} from '../../constants/const_value';
import useNotificationController from './controller/notifications_controller';

type NotificationNavigationProp = StackNavigationProp<
  RootStackParamList,
  typeof ROUTES.Notification
>;

interface NotificationScreenProps {
  navigation: NotificationNavigationProp;
}

interface Notification {
  id: number;
  title: string;
  description: string;
  date: string;
  read: boolean;
}

const NotificationScreen: React.FC<NotificationScreenProps> = ({
  navigation,
}) => {
  const {notifications, loading} = useNotificationController();
  const [visible, setVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSnackbarDismiss = () => setVisible(false);

  const renderNotificationItem = ({item}: {item: Notification}) => (
    <TouchableOpacity style={styles.notificationItem} onPress={() => {}}>
      <View style={styles.notificationRow}>
        <Text style={styles.titleText}>{item.title}</Text>
        {!item.read && <View style={styles.unreadDot} />}
      </View>
      <Text style={styles.descriptionText}>{item.description}</Text>
      <Text style={styles.dateText}>{Const.getFormatedDate(item.date)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.safeArea}>
      <MainAppBar
        title={Const.languageData?.Notifications ?? 'Notifications'}
        showBackButton={true}
        isPrimary={false}
      />
      {loading ? (
        <ActivityIndicator
          size="large"
          color={COLORS.PRIMARY}
          style={styles.loadingIndicator}
        />
      ) : (
        <View style={styles.container}>
          <FlatList
            data={notifications}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={{color: 'black', textAlign: 'center'}}>
                  {Const.languageData?.No_any_notification_currently ??
                    'No any notification currently'}
                </Text>
              </View>
            }
            renderItem={renderNotificationItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.notificationList}
          />
        </View>
      )}
      <CustomSnackbar
        visible={visible}
        message={snackbarMessage}
        onDismiss={handleSnackbarDismiss}
        actionLabel={Const.languageData?.Close ?? 'Close'}
        bottomMargin={true}
        onActionPress={handleSnackbarDismiss}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  notificationList: {
    paddingBottom: 20,
    flexGrow: 1,
    height: '100%',
  },
  notificationItem: {
    backgroundColor: '#e9e9e9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.PRIMARY,
  },
  descriptionText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationScreen;
