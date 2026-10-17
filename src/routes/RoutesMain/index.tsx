import { Route, Routes } from 'react-router-dom';
import {
  HomePage,
  LoginPage,
  RegisterPage,
  IdentificationByQrCode,
  Identification,
  ForgotPassword,
  IdentificationByPlate,
  VehicleDashboard,
  Historical,
} from '../../pages';

const RoutesMain = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/identification" element={<Identification />} />
      <Route path="/identification-by-qrcode" element={<IdentificationByQrCode />} />
      <Route path="/identification-by-plate" element={<IdentificationByPlate />} />
      <Route path="/vehicle-dashboard" element={<VehicleDashboard />} />
      <Route path="/historical" element={<Historical />} />
    </Routes>
  );
};

export default RoutesMain;