import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import WordPractice from "./components/WordPractice";
import Transcribe from "./components/transcribe";
import PredictLearningPace from "./components/PredictLearningPace";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Parent from "./components/Parent";
import { AuthProvider } from "./utils/AuthContext";
import SigIn from "./components/SigIn";
import ProtectedRoute from "./components/ProtectedRoute";
import SignUp from "./components/SignUp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Kids from "./components/Kids";
import Word from "./components/Words";

function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/parent" element={<Parent />} />
               <Route path="/kids" element={<WordPractice />} />
            </Route>
           
            <Route path="/signIn" element={<SigIn />} />
            <Route path="signUp" element={<SignUp />} />
            <Route path="/word" element={<Word />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
      <ToastContainer />
      {/* <WordPractice /> */}
      {/* <PredictLearningPace/> */}
      {/* <Words/> */}
    </>
  );
}

export default App;
