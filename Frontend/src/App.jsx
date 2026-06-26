import React from "react";
import { Routes, Route } from "react-router";
import { LoginScreen } from "./Screens/LoginScreen/LoginScreen";
import { HomeScreen } from "./Screens/HomeScreen/HomeScreen";
import { RegisterScreen } from "./Screens/RegisterScreen/RegisterScreen";
import { Navigate } from "react-router";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/" element={<LoginScreen />} />
      <Route path="/*" element={<Navigate to={"home"} />} />
    </Routes>
  );
};
export default App;
