import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
} from "@mui/material";

import { MailOutline, Lock } from "@mui/icons-material";

import { useFormik } from "formik";
import * as Yup from "yup";

import * as authActions from "@/redux/auth/actions";
import { useRouter } from "next/navigation";

const VerifyForm = ({ registerEmail, verifing, resending }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [timer, setTimer] = useState(300);
  const [timerExpired, setTimerExpired] = useState(false);
  const [resend, setResend] = useState(false);
  const [notification, setNotification] = useState({
    show: true,
    message: "Verification code has been sent to your email address",
    type: "success",
  });

  console.log(notification, "notification");

  useEffect(() => {
    const timer = setInterval(() => {
      setNotification((prev) => ({ ...prev, show: false }));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval;
    if (timer > 0 && !timerExpired) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      setTimerExpired(true);
    }
    return () => clearInterval(interval);
  }, [timer, timerExpired]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  const validationSchema = Yup.object({
    verificationCode: Yup.string()
      .required("Verification code is required")
      .matches(/^[0-9]{6}$/, "Code must be exactly 6 digits"),
  });

  const formik = useFormik({
    initialValues: {
      verificationCode: "",
    },
    validationSchema,
    onSubmit: (values) => {
      handleVerificationSubmit(values);
    },
  });

  const handleVerificationSubmit = (values) => {
    console.log("values");
    const data = {
      email: registerEmail,
      authCode: values.verificationCode.toString(),
    };
    dispatch(authActions.verifyCode(data, router));
  };

  const handleResend = () => {
    setResend(true);
    formik.setFieldValue("verificationCode", "");
    setTimer(300);
    setTimerExpired(false);
    const data = {
      email: registerEmail,
    };
    dispatch(authActions.resendCode(data));
    setTimeout(() => setResend(false), 100);
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: "auto",
        padding: 3,
      }}>
      <TextField
        label="Email"
        // value={registerEmail}
        value={localStorage.getItem("email")}
        disabled
        fullWidth
        sx={{ marginBottom: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MailOutline sx={{ color: "#ff6c55", backgroundColor: "#fff" }} />
            </InputAdornment>
          ),
        }}
      />

      {!timerExpired && !resend && (
        <>
          <TextField
            label="Verification Code"
            type="number"
            name="verificationCode"
            placeholder="Enter 6-digit code"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.verificationCode}
            fullWidth
            sx={{ marginBottom: 2, backgroundColor: "#fff" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "#ff6c55" }} />
                </InputAdornment>
              ),
            }}
          />
          {formik.touched.verificationCode &&
            formik.errors.verificationCode && (
              <Typography color="error" variant="body2">
                {formik.errors.verificationCode}
              </Typography>
            )}
        </>
      )}

      {!timerExpired && !resend && (
        <Button
          variant="contained"
          // disabled={verifing}
          color="error"
          fullWidth
          type="submit"
          sx={{
            marginTop: 2,
            padding: "14px",
            fontSize: "16px",
            fontWeight: "600",
          }}
          onClick={formik.handleSubmit}>
          Verify
          {/* {verifing ? `Verifing...` : `Verify`} */}
        </Button>
      )}

      {timerExpired && (
        <Typography color="error" sx={{ marginTop: 2, textAlign: "center" }}>
          Time expired! You can now request a new verification code.
        </Typography>
      )}

      {timerExpired && !resend && (
        <Button
          variant="contained"
          color="error"
          fullWidth
          // disabled={resending}
          onClick={handleResend}
          sx={{
            marginTop: 2,
            padding: "14px",
            fontSize: "16px",
            fontWeight: "600",
          }}>
          Resend Verification Code
          {/* {resending ? "Resending..." : "Resend Verification Code"} */}
        </Button>
      )}

      {timer > 0 && !timerExpired && !resend && (
        <Box
          sx={{
            marginTop: 2,
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}>
          <Typography variant="body2" fontWeight="bold">
            Time remaining: {formatTime(timer)}
          </Typography>
        </Box>
      )}
      {notification.show && (
        <Box
          sx={{
            backgroundColor: "#fff",
            color: "#4CAF50",
            padding: 2,
            borderRadius: 1,
            marginBottom: 2,
            textAlign: "center",
            position: "relative",
            animation: "fadeIn 0.3s ease-in",
            mt: 2,
          }}
        >
          <Typography>{notification.message}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default VerifyForm;
