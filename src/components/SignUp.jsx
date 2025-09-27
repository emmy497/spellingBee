import React, { useState } from "react";
import { Link, useLocation, useNavigate,Navigate } from "react-router-dom";
import axios from "axios";

function SignUp() {
    const [showPassword , setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const { username, email, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      username,
      email,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signUp",
        userData
      );
      console.log("User signed up successfully:", response.data);
      navigate("/signIn", { replace: true }); // Redirect to signIn page after successful signup
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error("Signup error:", error.response.data);
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response from server:", error.request);
      } else {
        // Something else went wrong
        console.error("Error:", error.message);
      }
    }
  };

  // const onSubmit = async (e) => {
  //   e.preventDefault();
  //   const userData = {
  //     username,
  //     email,
  //     password,
  //   };
  //   try {
  //     const response = await axios.post(
  //       "http://localhost:3000/signUp",
  //       userData
  //     );
  //     console.log("User signed up successfully:", response.data);
  //     // Redirect to login page or home page after successful signup

  //     return <Navigate to="/login" replace />;
  //   } catch (error) {
  //     if (error.response) {
  //       // Server responded with a status other than 2xx
  //       console.error("Signup error:", error.response.data);
  //     } else if (error.request) {
  //       // Request was made but no response received
  //       console.error("No response from server:", error.request);
  //     } else {
  //       // Something else went wrong
  //       console.error("Error:", error.message);
  //     }
  //   }
  // }

  return (
       <div className="w-full h-[100vh]  lg:pt-10 flex justify-center items-center flex-col ">
         <h1 className="text-3xl font-bold mb-8">Sign Up</h1>
          <form
          onSubmit={onSubmit}
            action=""
            className=
            "md:w-[30%] relative  mx-auto  flex items-center  flex-col p-10  bg-[#fff] md:shadow-2xl md:rounded-xl"
          >

              <div className="flex flex-col pl-10 ">
              <input
                className="mb-6 focus:border-b-3 focus:border-[#5a5959] focus:outline-none border-b-1 border-grey focus:border-b-2 p-2 "
                type="username"
                value={username}
                id="username"
                placeholder="username"
                onChange={onChange}
              />

         
            </div>
    
      
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
                Sign Up
              </div>
            </div>
            <div className="flex justify-center items-center mt-4 ">
              <Link to="/signIn">Sign In</Link>
            </div>
          </form>
        </div>
    // <div className="flex flex-col items-center justify-center h-screen">
     
    //   <form className="flex flex-col gap-4 w-80">
    //     <input
    //       id="username"
    //       type="text"
    //       placeholder="Username"
    //       value={username}
    //       className="p-2 border rounded"
    //       onChange={onChange}
    //     />
    //     <input
    //       id="email"
    //       type="email"
    //       placeholder="Email"
    //       value={email}
    //       className="p-2 border rounded"
    //       onChange={onChange}
    //     />
    //     <input
    //       id="password"
    //       type="password"
    //       placeholder="Password"
    //       value={password}
    //       className="p-2 border rounded"
    //       onChange={onChange}
    //     />
    //     <button
    //       type="submit"
    //       onClick={onSubmit}
    //       className="cursor-pointer bg-yellow-500 font-semibold p-2 rounded hover:bg-yellow-600 transition-colors"
    //     >
    //       Sign Up
    //     </button>
    //   </form>
    // </div>
  );
}

export default SignUp;
