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

import ManagerServices from '../../pages/manager-services';
import ManagerServiceDetails from '../../pages/manager-service-details';
import ManagerServiceApproved from '../../pages/manager-service-approved';
import ManagerServiceRejected from '../../pages/manager-service-rejected';

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

      {/* Jornada do Gerente */}
      <Route path="/manager/services" element={<ManagerServices />}
      />
      <Route path="/manager/services/:id" element={<ManagerServiceDetails />}
      />
      <Route path="/manager/service-approved" element={<ManagerServiceApproved />}
      />
      <Route path="/manager/service-rejected" element={<ManagerServiceRejected />}
      />
    </Routes>
  );
};

export default RoutesMain;
