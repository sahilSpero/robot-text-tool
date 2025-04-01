import React, { useEffect } from "react";

import { TextField, Button, InputAdornment, IconButton } from "@mui/material";
import { MailOutline, Language } from "@mui/icons-material";

import { useFormik } from "formik";
import * as Yup from "yup";

import VerifyForm from "./verifyForm";

import { blockedDomains } from "../../utils/blockedDomains";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Enter a valid business email"
    )
    .test("business-email", "Only business emails allowed", (value) => {
      return value && !blockedDomains.some((domain) => value.endsWith(domain));
    })
    .required("Email is required"),
  domains: Yup.array().of(
    Yup.string().test(
      "valid-domain",
      "Valid domain: https://abc.com",
      (value) => !value || value.includes(".")
    )
  ),
});

const Form = ({
  onSubmit,
  // registering,
  resetTrigger,
  registerEmail,
  newField,
  verifing,
  resending,
}) => {
  const formik = useFormik({
    initialValues: {
      email: "",
      domains: [""],
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values, resetForm);
    },
  });

  useEffect(() => {
    formik.resetForm();
  }, [resetTrigger]);

  const addDomain = () => {
    if (formik.values.domains.length < 5) {
      formik.setFieldValue("domains", [...formik.values.domains, ""]);
    }
  };

  const removeDomain = (index) => {
    formik.setFieldValue(
      "domains",
      formik.values.domains.filter((_, i) => i !== index)
    );
  };

  return (
    <>
      {!newField ? (
        <form
          onSubmit={formik.handleSubmit}
          style={{
            // padding: "20px",
            borderRadius: "8px",
            textAlign: "left",
          }}>
          <div style={{ marginBottom: "29px" }}>
            <label style={{ color: "#000", display: "block" }}>Email</label>
            <TextField
              type="email"
              name="email"
              placeholder="Enter your business email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MailOutline sx={{ color: "#ff6c55" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                height: "55px",
                backgroundColor: "#fff",
                borderRadius: "10px",
              }}
            />
            {formik.touched.email && formik.errors.email && (
              <div style={{ color: "red", marginTop: "5px" }}>
                {formik.errors.email}
              </div>
            )}
          </div>

          <div style={{ marginTop: "15px" }}>
            <label style={{ color: "#000", display: "block" }}>
              Enter Domain
            </label>
            {formik.values.domains.map((_, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}>
                  <TextField
                    type="text"
                    name={`domains[${index}]`}
                    placeholder={`https://example.com ${index + 1}`}
                    value={formik.values.domains[index]}
                    onChange={formik.handleChange}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Language sx={{ color: "#ff6c55" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      height: "55px",
                      backgroundColor: "#fff",
                      borderRadius: "10px"
                    }}
                  />
                  <Button
                    type="button"
                    onClick={
                      index === 0 ? addDomain : () => removeDomain(index)
                    }
                    sx={{
                      backgroundColor: "#f13624",
                      color: "#fff",
                      padding: "12px 0px",
                      borderRadius: "10px",
                      textTransform: "uppercase",
                      fontSize: "22px",
                    }}>
                    {index === 0 ? "+" : "-"}
                  </Button>
                </div>
                {formik.touched.domains && formik.errors.domains?.[index] && (
                  <div style={{ color: "red", marginTop: "5px" }}>
                    {formik.errors.domains[index]}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button
            type="submit"
            // disabled={registering}
            sx={{
              backgroundColor: "#f13624",
              color: "#fff",
              borderRadius: "10px",
              textTransform: "capitalize",
              marginTop: "15px",
              fontWeight: 600,
              fontSize: "18px",
              padding: "12px 0px",
              width: "100%",
            }}>
            Submit
            {/* {registering ? `Submitting...` : `Submit`} */}
          </Button>
        </form>
      ) : (
        <VerifyForm
          registerEmail={registerEmail}
          verifing={verifing}
          resending={resending}
        />
      )}
    </>
  );
};

export default Form;
