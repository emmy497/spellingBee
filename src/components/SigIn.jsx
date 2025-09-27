import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../utils/AuthContext";
import { jwtDecode } from "jwt-decode";
import { Link, useLocation, useNavigate } from "react-router-dom";


function SigIn() {
  const navigate = useNavigate();

  const { login } = useAuth();

   const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    axios
      .post("http://localhost:3000/api/auth/signIn", userData)
      .then((response) => {
        console.log("User signed in successfully:", response.data);
        const token = response.data.token;
        const decoded = jwtDecode(token);
        console.log(decoded)
        login(token);
        navigate("/kids", { replace: true });
        toast.success("Sign in successful!");
        // You can redirect or perform other actions here
      })
      .catch((error) => {
        if (error.response) {
          // Server responded with a status other than 2xx
          console.log(error);
          toast.error(error.response.data.error);
        } else if (error.request) {
          // Request was made but no response received
          toast.error("No response from server:", error.request);
        } else {
          // Something else went wrong
          toast.error("Error:", error.message);
        }
      });
  };

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  return (
    
 

    <div className="w-full h-[100vh]  lg:pt-10 flex justify-center items-center ">
      <form
      onSubmit={onSubmit}
        action=""
        className="md:w-[30%] relative  mx-auto  flex items-center  flex-col p-10  bg-[#fff] md:shadow-2xl md:rounded-xl"
      >
        <div className="flex flex-col pl-10 ">
          <input
            className="mb-6 focus:border-b-3 focus:border-[#5a5959] focus:outline-none border-b-1 border-grey focus:border-b-2 p-2 "
            type="email"
            value={email}
            id="email"
            placeholder="Email"
            onChange={onChange}
          />
          <input
            className="border-b-1 focus:border-b-3 focus:border-[#5a5959] focus:outline-none mb-6  p-2 "
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Password"
            id="password"
            onChange={onChange}
          />
        </div>

  

        <div className="  ">
          <div
           onClick={onSubmit}
          className="bg-yellow-500 text-[#fff] cursor-pointer mx-auto flex justify-center items-center w-[100px] md:w-[100px] h-[50px] rounded-md mx-auto">
            Login
          </div>
        </div>
        <div className="flex justify-center items-center mt-4 ">
          <Link to="/signUp">Sign up</Link>
        </div>
      </form>
    </div>

     
  );
}

export default SigIn;
