import styled from "styled-components";

export const ButtonWrapper = styled.button`
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