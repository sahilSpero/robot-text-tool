"use client"
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import * as toastActions from "@/redux/toast/actions";
import "react-toastify/dist/ReactToastify.css";

const ToastMessage = () => {
  const dispatch = useDispatch();
  const { open, type, msg } = useSelector((state) => state.toast);

  useEffect(() => {
    if (open && type && msg) {
      toast[type](msg, {
        className: `toast-${type}`,
        progressStyle: {
          background:
            type === "success"
              ? "#4A9E5C"
              : type === "error"
              ? "#E80606"
              : type === "warning"
              ? "#FFA500"
              : "#4A9E5C",
        },
      });

      dispatch(toastActions.resetToast());
    }
  }, [open, type, msg, dispatch]);

  return (
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
  );
};

export default ToastMessage;
