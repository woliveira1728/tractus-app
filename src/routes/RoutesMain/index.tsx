import { Route, Routes } from "react-router-dom";
import LoginPage from "../../pages/login";

const RoutesMain = () => {

    return (
        <Routes>
            
            <Route path="/" element={<LoginPage />} />

        </Routes>
    );
};

export default RoutesMain;