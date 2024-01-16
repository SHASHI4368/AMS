import React from "react";
import "../styles/lecsignup.css";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "../api/students";
import axios from "axios";

const StudentSignUpForm = ({
  passCode,
  setPassCode,
  students,
  setStudents,
  stdEmail,
  setStdEmail,
}) => {
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [message, setMessage] = useState("");
  const history = useHistory();
  const [tempUsers, setTempUsers] = useState([]);

  const sendVerificationMail = async (email, code) => {
    sessionStorage.setItem("staffCode", JSON.stringify(code));
    sessionStorage.setItem("passCode", JSON.stringify(code));
    sessionStorage.setItem("stdEmail", JSON.stringify(stdEmail));
    try {
      const url = `http://localhost:8080/mail/student/verify`;
      const { data } = await axios.post(url, { email, code });
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const updateVerificationCode = async (Email, Verification_Code) => {
    try {
      const url = `http://localhost:8080/db/tempUser`;
      const { data } = await axios.put(url, { Email, Verification_Code });
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  }

  const addTempUser = async (Email, Verification_Code) => {
    try {
      const url = `http://localhost:8080/db/tempUser`;
      const { data } = await axios.post(url, { Email, Verification_Code });
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getAllStudents = async () => {
      try {
        const url = `http://localhost:8080/db/students`;
        const response = await axios.get(url);
        setStudents(response.data);
      } catch (err) {
        if (err.response) {
          console.log(err.response.data.message);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(err.message);
        }
      }
    };

    const getAllTempUsers = async () => {
      try {
        const url = `http://localhost:8080/db/tempUsers`;
        const response = await axios.get(url);
        setTempUsers(response.data);
      } catch (err) {
        if (err.response) {
          console.log(err.response.data.message);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(err.message);
        }
      }
    };
    getAllStudents();
    getAllTempUsers();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (stdEmail === "") {
      setMessage("Email is required");
      console.log(message);
    } else if (!stdEmail.includes("engug.ruh.ac.lk")) {
      setMessage("Please enter a valid email");
      console.log(message);
    } else {
      const code = `${Math.floor(Math.random() * 10)}${Math.floor(
        Math.random() * 10
      )}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`;
      setPassCode(code);
      const student = students.find((student) => student.Email === stdEmail);
      const tempUser = tempUsers.find(
        (tempUser) => tempUser.Email === stdEmail
      );
      if (!student && (!tempUser || !tempUser.Verified)) {
        sendVerificationMail(stdEmail, code);
        if (!tempUser) {
          addTempUser(stdEmail, code);
        }
        if(tempUser && !tempUser.Verified){
          updateVerificationCode(stdEmail, code);
        }
        sessionStorage.setItem("stdEmail", JSON.stringify(stdEmail));
        history.push("/login/student/verify");
      } else {
        setMessage("Email already exists");
      }
    }
  };

  return (
    <div className="std-signup-form">
      <form className="signup-form" onSubmit={(e) => e.preventDefault()}>
        <h2>SIGN UP</h2>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          className="email"
          placeholder="Faculty Email"
          value={stdEmail}
          onChange={(e) => {
            setStdEmail(e.target.value);
          }}
        />
        {message && (
          <p className="message" style={{ color: "red", fontSize: "15px" }}>
            {message}
          </p>
        )}
        <button type="submit" className="submit-btn" onClick={handleSubmit}>
          Continue
        </button>
      </form>
    </div>
  );
};

export default StudentSignUpForm;
