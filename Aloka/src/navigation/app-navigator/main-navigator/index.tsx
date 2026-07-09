// import { carelyRootRoute, communityRoute, mainRoute, rootRoute } from '@/constants/route_key';
// import { AppTabReview } from '@/navigation/app-navigator/tab-navigator-review';
// import { communityStack, mainStack } from '@/screens';
// import { StackNavigationOptions, createStackNavigator } from '@react-navigation/stack';
// import { AppTabCarely } from '../tab-navigator-carely';
// import { CarelyTab } from '../tab-carely';

// const Stack = createStackNavigator();

// const screenOptions: StackNavigationOptions = {
//   headerShown: false,
//   gestureEnabled: false,
// };

// const MainNavigator = ({ isReview }: any) => {
//   // console.log("🚀 ~ MainNavigator ~ isReview:", isReview);
//   return (
//     <Stack.Navigator initialRouteName={rootRoute} screenOptions={screenOptions}>
//       {/* {!isReview ? <Stack.Screen name={rootRoute} component={AppTab} /> : <Stack.Screen name={rootRoute} component={AppTabReview} />} */}
//       {!isReview ? <Stack.Screen name={rootRoute} component={AppTabCarely} /> : <Stack.Screen name={rootRoute} component={AppTabReview} />}
//       <Stack.Screen name={carelyRootRoute} component={CarelyTab} />
//       {Object.values(mainRoute).map(item => {
//         return (
//           <Stack.Screen
//             key={item}
//             name={item as keyof typeof mainStack}
//             component={mainStack[item as keyof typeof mainStack]}
//           />
//         );
//       })}
//       {Object.values(communityRoute).map(item => {
//         return (
//           <Stack.Screen
//             key={item}
//             name={item as keyof typeof communityStack}
//             component={communityStack[item as keyof typeof communityStack] as React.ComponentType}
//           />
//         );
//       })}
//     </Stack.Navigator>
//   );
// };

// export default MainNavigator;