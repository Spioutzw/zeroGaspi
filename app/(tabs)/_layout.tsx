import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo'
import { Tabs } from 'expo-router';
import {  useColorScheme } from 'react-native';
import { Auth, User, getAuth } from 'firebase/auth';
import Colors from '../../constants/Colors';
import { useEffect, useState } from 'react';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Database, getDatabase } from 'firebase/database';
import { firebaseConfig } from '../../firebase/firebase';

const app:FirebaseApp = initializeApp(firebaseConfig);
const auth:Auth = getAuth(app);
const db:Database = getDatabase(app);

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  color: string;
  name: string;
  library: 'Entypo' | 'FontAwesome'; // Ajoutez cette prop pour spécifier la bibliothèque d'icônes
}) {
  const { name, color, library } = props;

  if (library === 'Entypo') {
    return <Entypo name={name} size={28} style={{ marginBottom: -3 }} color={color} />;
  } else if (library === 'FontAwesome') {
    return <FontAwesome name={name} size={28} style={{ marginBottom: -3 }} color={color} />;
  } else {
    return null; // Gérer le cas où la bibliothèque n'est pas reconnue
  }
}

export default function TabLayout() {

  const colorScheme = useColorScheme();
  const [currentUser, setCurrentUser] = useState<User|null>(null);

  useEffect(() => {
    
    auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}>
        
        <Tabs.Screen
          name="home"
          options={{
            tabBarIcon: ({ color }) => (
              <TabBarIcon library='FontAwesome' name="home" color={color} />
            ),
            href: currentUser === null ? null :'/home'
          }}
        />
        <Tabs.Screen
          name="List"
          options={{
            tabBarIcon: ({ color }) => (
              <TabBarIcon library='FontAwesome' name="user" color={color} />
            ),
            href:currentUser === null ? null :'/List'
          }}
        />
        <Tabs.Screen
          name="FormRegister"
          options={{
            tabBarIcon: ({ color }) => (
              <TabBarIcon library='FontAwesome' name="user-plus" color={color} />
            ),
            href: currentUser === null ? 'FormRegister' : null,
            tabBarLabel: 'Inscriptions'
          }}
        />
        <Tabs.Screen
          name="Login"
          options={{
            tabBarIcon: ({ color }) => (
              <TabBarIcon library='Entypo' name="login" color={color} />
            ),
            href: currentUser === null ? 'Login' : null,
            tabBarLabel: 'Connexion'
          }}
          />
          <Tabs.Screen
          name="index"
          options={{
            href: null
          }}
          />
        

    </Tabs>
  );
}

export { auth,db}