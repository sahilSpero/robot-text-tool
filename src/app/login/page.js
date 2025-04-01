"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";

import * as authActions from "@/redux/auth/actions";

import Form from "./form";
import loginImg from "@/../public/assets/login-left-img.svg";

import { domain_from_url } from "@/utils";
import { Box } from "@mui/material";
import LoginContent from "@/components/loginContent/Index";

const Login = () => {
  const dispatch = useDispatch();
  const { registering, registerData, verifing, resending } = useSelector(
    (state) => state.auth
  );

  const [newField, setNewField] = useState(false);
  const [formResetTrigger, setFormResetTrigger] = useState(false);

  useEffect(() => {
    // setNewField(!!registerData);
    if (registerData) {
      setFormResetTrigger((prev) => !prev);
    }
  }, [registerData]);

  const handleSubmit = (values, resetForm) => {
    const domainData = values.domains
      .map((domain) => {
        const domainResult = domain_from_url(domain);
        if (domainResult.valid) {
          return { name: domainResult.result };
        }
        return null;
      })
      .filter(Boolean);

    const data = {
      email: values.email,
      domains: domainData,
    };
    dispatch(authActions.register(data));
    resetForm();
    localStorage.setItem("email", values.email);
    setNewField(true);
  };

  return (
    <>
    <div className="login-container">
      <Box className="login-container-inner">
        <div className="right-panel">
          <div className="right-panel-inner">
            <h2>
              <span>Robots file Monitoring</span>
            </h2>
            {!newField && (
              <p className="login-text">
                <span style={{ color: "#585858" }}>Please enter your</span>{" "}
                <span style={{ color: "#EE3524" }}>Business Email</span>{" "}
                <span style={{ color: "#585858" }}>and</span>{" "}
                <span style={{ color: "#EE3524" }}>Domains</span>
              </p>
            )}{" "}
            <div className="formDiv">
              <Form
                onSubmit={handleSubmit}
                registering={registering}
                resetTrigger={formResetTrigger}
                registerEmail={registerData}
                newField={newField}
                verifing={verifing}
                resending={resending}
              />
            </div>
          </div>
        </div>
        <div className="left-panel">
          <Image src={loginImg} alt={loginImg} className="loginImg" />
          <p className="text-overlay">
            ** Dont Risk Your Website Losing Traffic! Get Daily Notifications of
            any Unintended Robots file changes and receive FREE daily email
            notifications if any updates are detected. Stay informed with a FREE
            weekly email about whether a domain's robots.txt file has been
            modified or remains unchanged.
          </p>
        </div>
      </Box>
    </div>
    <LoginContent />
    </>
  );
};

export default Login;
