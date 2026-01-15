import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import * as Haptics from "expo-haptics";
import { Platform, View, Pressable, LayoutChangeEvent } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { useEffect, useState } from "react";

const TAB_ICON_SIZE = 24;
const ACTIVE_COLOR = "#0df20d";
const INACTIVE_COLOR = "#64748b";

function TabBar({ state, descriptors, navigation }: any) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const tabWidth = dimensions.width / state.routes.length;
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withSpring(state.index * tabWidth, {
      damping: 15,
      stiffness: 150,
    });
  }, [state.index, tabWidth]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const onTabLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    });
  };

  return (
    <View
      onLayout={onTabLayout}
      className="flex-row items-center justify-around bg-[#050816] border-t border-white/5 pb-5 pt-3"
      style={{
        paddingBottom: Platform.OS === 'ios' ? 28 : 10,
        height: Platform.OS === 'ios' ? 88 : 68,
      }}
    >
      {/* Animated Indicator */}
      {dimensions.width > 0 && (
        <Animated.View
          style={[
            animatedStyle,
            {
              position: "absolute",
              top: 0,
              left: 0,
              width: tabWidth,
              height: 2, // Top border indicator
              backgroundColor: ACTIVE_COLOR,
              shadowColor: ACTIVE_COLOR,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.8,
              shadowRadius: 10,
              elevation: 5,
            },
          ]}
        />
      )}

      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
            Haptics.selectionAsync();
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        // Determine icon name based on route and focus state
        let iconName: any = "home";
        if (route.name === "index") iconName = isFocused ? "home" : "home-outline";
        if (route.name === "workouts") iconName = isFocused ? "barbell" : "barbell-outline";
        if (route.name === "nutrition") iconName = isFocused ? "restaurant" : "restaurant-outline";
        if (route.name === "progress") iconName = isFocused ? "trending-up" : "trending-up-outline";
        if (route.name === "profile") iconName = isFocused ? "person" : "person-outline";

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View className={`items-center justify-center p-2 rounded-xl transition-all ${isFocused ? 'bg-white/5' : ''}`}>
              <Ionicons
                name={iconName}
                size={TAB_ICON_SIZE}
                color={isFocused ? ACTIVE_COLOR : INACTIVE_COLOR}
              />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="workouts" options={{ title: "Workouts" }} />
      <Tabs.Screen name="nutrition" options={{ title: "Nutrition" }} />
      <Tabs.Screen name="progress" options={{ title: "Progress" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
