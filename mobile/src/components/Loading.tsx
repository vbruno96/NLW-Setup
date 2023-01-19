import { ActivityIndicator, View } from "react-native";

export function Loading() {
  return (
    <View style={{
      flex: 1,
      backgroundColor: '#09090A',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <ActivityIndicator color="#7C3AED" size='large' />
    </View>
  )
}