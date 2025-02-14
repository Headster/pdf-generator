import styled from "styled-components";

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

export const Select = styled.select`
    padding: 10px 6px;
    border-radius: 6px;
    border: 1px solid black;
    #9f9f9f
`;

export const ErrorMessage = styled.div`
    margin-top: 10px;
`;