import { SafeAreaView } from 'react-native';

export const Container = ({ children }: { children: React.ReactNode }) => {
  return <SafeAreaView className="flex flex-1 bg-neutral-50 p-6 mt-12">{children}</SafeAreaView>;
};
