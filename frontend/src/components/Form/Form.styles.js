import styled from "styled-components";

export const Wrapper = styled.div`

`;

export const FormContainer = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 24px;
`;

export const FieldContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const Label = styled.label`
    font-weight: 500;
    margin-bottom: 2px;
    span {
        color: red;
    }
`;

export const Input = styled.input`
    padding: 10px 6px;
    border-radius: 6px;
    border: 1px solid black;
    #9f9f9f
`;

export const Button = styled.button`
    padding: 10px;
    border: none;
    border-radius: 6px;
    color: #fff;
    background: linear-gradient(180deg, #4B91F7 0%, #367AF6 100%);
    box-shadow: 0px 0.5px 1.5px rgba(54, 122, 246, 0.25), inset 0px 0.8px 0px -0.25px rgba(255, 255, 255, 0.2);
    cursor: pointer;
    font-size: 18px;
    &:hover {
        background: linear-gradient(180deg,rgb(128, 179, 255) 0%, #367AF6 100%);
    }
`;

export const ErrorMessage = styled.div`
    margin-top: 10px;
`;