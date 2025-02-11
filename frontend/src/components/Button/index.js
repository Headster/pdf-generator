import React from "react";
import { ButtonWrapper } from "./Button.styles";

const Button = ({ type = "button", disabled = false, loading = false, onClick, children }) => {
  return (
    <ButtonWrapper
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? "Loading..." : children}
    </ButtonWrapper>
  );
};

export default Button;
