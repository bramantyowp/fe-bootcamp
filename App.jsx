import React from 'react';
import Home from './src/screens/Home';
import Icon from 'react-native-vector-icons/Feather';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux/store';

import List from './src/screens/List';
import Akun from './src/screens/Akun';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import Detail from './src/screens/Detail';
import PaymentScreen from './src/screens/PaymentScreen'; // Import PaymentScreen here
import OrderDetailScreen from './src/screens/orderDetail';
import PaymentProofUpload from './src/screens/confirm';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Icon name={"home"} size={25} color={focused ? "#A43333" : "#B0B0B0"} />
          ),
        }}
        name="Home"
        component={Home}
      />
      <Tab.Screen
        options={{
          title: 'Daftar Mobil',
          tabBarIcon: ({ focused }) => (
            <Icon name={"list"} size={25} color={focused ? "#A43333" : "#B0B0B0"} />
          ),
        }}
        name="List"
        component={List}
      />
      <Tab.Screen
        options={{
          title: 'Akun',
          tabBarIcon: ({ focused }) => (
            <Icon name={"user"} size={25} color={focused ? "#A43333" : "#B0B0B0"} />
          ),
        }}
        name="Profile"
        component={Akun}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="HomeTabs"
              component={Tabs}
            />
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="SignIn"
              component={SignIn}
            />
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="SignUp"
              component={SignUp}
            />
            <Stack.Screen
              options={{
                headerShown: false,
              }}
              name="Detail"
              component={Detail}
            />
            <Stack.Screen
              options={{
                headerShown: true,
                title: 'Pembayaran',// Optional: Set a title for the PaymentScreen header
              }}
              name="Payment"
              component={PaymentScreen} // Add PaymentScreen here
            />
            <Stack.Screen
              options={{
                headerShown: true,
                title: 'Pembayaran' ,// Optional: Set a title for the PaymentScreen header
              }}
              name="OrderDetail"
              component={OrderDetailScreen} // Add PaymentScreen here
            />
            <Stack.Screen
              options={{
                headerShown: true,
                title: 'Confirm The Order' ,// Optional: Set a title for the PaymentScreen header
              }}
              name="Confirm"
              component={PaymentProofUpload} // Add PaymentScreen here
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
}

export default App;
