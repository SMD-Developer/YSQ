import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
  status: number;
  language: string;
  language_name: string;
  image_url: string;
  unique_code: string;
  salesman: any;
  warehouse: any;
  currencies: any;
  area: any;
  country_name: any;
}

class User {
  private data: UserData;

  constructor(data: UserData) {
    this.data = data;
  }

  async save() {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  }

  static async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem('user');
      return userData ? new User(JSON.parse(userData).user) : null;
    } catch (error) {
      console.error('Failed to load user data:', error);
      return null;
    }
  }

  // Clear user data from local storage
  static async clear() {
    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  }

  // Getter methods for accessing user data
  get id() {
    return this.data.id;
  }

  get fullName() {
    return `${this.data.first_name} ${this.data.last_name}`;
  }

  get email() {
    return this.data.email;
  }

  get phone() {
    return this.data.phone;
  }

  get imageUrl() {
    return this.data.image_url;
  }
  get language() {
    return this.data.language_name;
  }
  get unique_code() {
    return this.data.unique_code;
  }
  get currency() {
    return this.data.currencies?.symbol;
  }
  get area() {
    return this.data.area.id;
  }
  get country() {
    return this.data.country_name;
  }
  get distributerId() {
    return this.data.salesman.distributor_id;
  }
  get wareHouseName() {
    // console.log(this.data.warehouse);
    return this.data.warehouse.name;
  }
  get wareHouseId() {
    // console.log(this.data.warehouse);
    return this.data.warehouse.id;
  }

  // Add more getter methods as needed
}

export default User;
