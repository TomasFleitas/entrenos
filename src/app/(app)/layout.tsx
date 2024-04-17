import { AuthProvider } from '../provider/authContext';
import { UserPreference } from '../provider/userPreference';
import { Header } from './components/header';

export default function AppProtection({ children }: CommonReactProps) {
  return (
    <AuthProvider>
      <UserPreference>
        <Header />
        {children}
      </UserPreference>
    </AuthProvider>
  );
}
