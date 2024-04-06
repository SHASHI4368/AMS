import React, { useEffect } from "react";
import Logo from "../resources/LogoNew1.png";
import "../styles/header.css";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import DropdownButton from "./helpers/DropdownButton";

const Header = ({ socket }) => {
  const [userType, setUserType] = useState(
    JSON.parse(sessionStorage.getItem("userType")) || "Student"
  );

  useEffect(() => {
    if (sessionStorage.getItem("userType") === null) {
      sessionStorage.setItem("userType", JSON.stringify("Student"));
    }
    if (sessionStorage.getItem("authorized") === null) {
      sessionStorage.setItem("authorized", JSON.stringify(false));
    }
    console.log(JSON.parse(sessionStorage.getItem("authorized")));
  }, []);

  const history = useHistory();

  const navigateHome = () => {
    history.push("/");
  };

  const handleLogin = (option) => {
    if (option === "Student") {
      sessionStorage.setItem("userType", JSON.stringify("Student"));
      history.push("/login/student");
    } else {
      sessionStorage.setItem("userType", JSON.stringify("Staff"));
      history.push("/login/staff");
    }
  };

  const handleStdLogout = async () => {
    try {
      const url = `http://localhost:8080/db/student/logout`;
      const response = await axios.get(url, {
        withCredentials: true,
      });
      socket.disconnect();
      const accessToken = response.data.accessToken;
      return accessToken;
    } catch (err) {
      console.log(err);
    }
  };

  const handleStaffLogout = async () => {
    try {
      const url = `http://localhost:8080/db/staff/logout`;
      const response = await axios.get(url, {
        withCredentials: true,
      });
      socket.disconnect();
      const accessToken = response.data.accessToken;
      return accessToken;
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogoutButton = () => {
    if (userType === "Staff") {
      handleStaffLogout();
      sessionStorage.setItem("authorized", JSON.stringify(false));
      sessionStorage.setItem("selectedStaffEmail", JSON.stringify(""));
      history.push("/login/staff");
    } else if (userType === "Student") {
      handleStdLogout();
      sessionStorage.setItem("authorized", JSON.stringify(false));
      sessionStorage.setItem("regNumber", JSON.stringify(""));
      history.push("/login/student");
    }
  };

  const handleDepartmentSelect = (option) => {
    sessionStorage.setItem("department", JSON.stringify(option));
    history.push("/student/department");
  };

  const handleStaffCalendar = () => {
    history.push("/staff/calendar");
    window.location.reload();
  };

  const handleAppointments = () => {
    history.push("/staff/appointments");
  };

  const handleStudentHomeButton = () => {
    history.push("/student/home");
  };

  const handleStaffHomeButton = () => {
    history.push("/staff/home");
  };

  return (
    <div className="header">
      <img className="logo" alt="Logo" src={Logo} onClick={navigateHome} />
      {JSON.parse(sessionStorage.getItem("authorized")) === true &&
        JSON.parse(sessionStorage.getItem("userType")) === "Student" && (
          <div className="buttons">
            <button className="loginbtn" onClick={handleStudentHomeButton}>
              HOME
            </button>
            <DropdownButton
              dropdownName="DEPARTMENT"
              options={["DCEE", "DEIE", "DMME", "MENA", "Computer"]}
              handleOptionSelect={handleDepartmentSelect}
            />
            {/* <button className="loginbtn" id="appointments">
              APPOINTMENTS
            </button> */}
            <button
              className="loginbtn"
              id="logout-button"
              onClick={handleLogoutButton}
            >
              LOGOUT
            </button>
          </div>
        )}
      {JSON.parse(sessionStorage.getItem("authorized")) === true &&
        JSON.parse(sessionStorage.getItem("userType")) === "Staff" && (
          <div className="buttons">
            <button className="loginbtn" onClick={handleStaffHomeButton}>
              HOME
            </button>
            <button
              className="loginbtn"
              id="appointments"
              onClick={handleAppointments}
            >
              APPOINTMENTS
            </button>
            <button
              className="loginbtn"
              id="appointments"
              onClick={handleStaffCalendar}
            >
              CALENDAR
            </button>
            <button
              className="loginbtn"
              id="logout-button"
              onClick={handleLogoutButton}
            >
              LOGOUT
            </button>
          </div>
        )}
      {JSON.parse(sessionStorage.getItem("authorized")) === false && (
        <div className="buttons">
          <DropdownButton
            dropdownName="LOGIN"
            options={["Student", "Staff"]}
            handleOptionSelect={handleLogin}
            id="loginbtn"
          />
        </div>
      )}
    </div>
  );
};

export default Header;
