import { Route, Routes } from "react-router-dom";
import LoginPage from "../../pages/login";
import ForgotPassword from "../../pages/forgot-password";
import Identification from "../../pages/identification";

const RoutesMain = () => {

    return (
        <Routes>
            
            <Route path="/" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/identification" element={<Identification />} />

        </Routes>
    );
};

export default RoutesMain;