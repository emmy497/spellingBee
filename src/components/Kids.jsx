import React from "react";
import HexagonCard from "./HexagonCard";
import "../index.css"
import {Link} from "react-router-dom"
function Kids() {
  return (
    <>
 <Link to="/wordPractice">
 <button className="btn rounded px-4 py-2  bg-red-500 ">Resume game</button>
 </Link>
    </>
  );
}

export default Kids;
