import { Footer } from '../components/footer';
import { AuthProvider } from '../provider/authContext';
import { UserPreference } from '../provider/userPreference';
import { UserSessionProvider } from '../provider/userSession';
import { Header } from './components/header';
import { ConfigProvider } from 'antd';

export default function AppProtection({ children }: CommonReactProps) {
  return (
    <AuthProvider>
      <UserPreference>
        <ConfigProvider>
          <UserSessionProvider>
            <Header />
            {children}
            <Footer />
          </UserSessionProvider>
        </ConfigProvider>
      </UserPreference>
    </AuthProvider>
  );
}
