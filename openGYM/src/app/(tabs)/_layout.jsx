import { Tabs } from 'expo-router'
import { AppTabBar } from '../../components/AppTabBar.jsx'

export default function TabLayout() {
  return <Tabs tabBar={props => <AppTabBar {...props} />} screenOptions={{ headerShown: false, lazy: true }}><Tabs.Screen name="index" /><Tabs.Screen name="plan" /><Tabs.Screen name="workout" /><Tabs.Screen name="stats" /><Tabs.Screen name="exercises" /></Tabs>
}
