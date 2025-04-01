import React from "react";
import { TextField, Button, Box, FormHelperText } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import AddIcon from '@mui/icons-material/Add';

import { domain_from_url } from "@/utils";

const Domain = ({ adding, handleDomainSubmit }) => {
  const formik = useFormik({
    initialValues: {
      domainName: "",
    },
    validationSchema: Yup.object({
      domainName: Yup.string()
        .trim()
        .required("Domain name is required")
        .test("isValidDomain", "Invalid domain format", (value) => {
          const { valid } = domain_from_url(value);
          return valid;
        }),
    }),
    onSubmit: (values, { resetForm }) => {
      const { result } = domain_from_url(values.domainName);
      handleDomainSubmit(result);
      resetForm();
    },
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{
        display: "flex",
        gap: 2,
        alignItems: "flex-start",
        width: "80%",
      }}>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "80px",
        }}>
        <TextField
          sx={{
            borderRadius: "10px !important",
            background: "#fff !important",
          }}
          variant="outlined"
          fullWidth
          label="Add Domain"
          id="domainName"
          name="domainName"
          placeholder="https://example.com"
          value={formik.values.domainName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.domainName && Boolean(formik.errors.domainName)}
        />
        <FormHelperText
          error
          sx={{
            minHeight: "20px",
            visibility:
              formik.touched.domainName && formik.errors.domainName
                ? "visible"
                : "hidden",
          }}>
          {formik.errors.domainName || " "}
        </FormHelperText>
      </Box>

      <Button
        disabled={adding}
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: "#f13624",
          color: "#fff",
          border: "2px solid #f13624",
          "&:hover": {
            backgroundColor: "#fff",
            color: "#f13624",
            border: `2px solid ${adding ? "#b0b0b0" : "#f13624"}`,
          },
          "&:focus": {
            outline: "none",
          },
          height: "52px",
          minWidth: "120px",
          fontWeight: 600,
          textTransform: "capitalize",
          letterSpacing: "1px",
          fontSize: "16px",
        }}>
        <AddIcon sx={{mr: "2px"}} /> Add 
        {/* {adding ? "Submitting..." : "Submit"} */}
      </Button>
    </Box>
  );
};

export default Domain;
