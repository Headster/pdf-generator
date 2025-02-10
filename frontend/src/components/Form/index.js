import React, { useState } from "react";
import axios from "axios";
import {
  Wrapper,
  FormContainer,
  FieldContainer,
  Label,
  Input,
  Select,
  Button,
  ErrorMessage,
} from "./Form.styles";

const Form = () => {
  const [formData, setFormData] = useState({
    date: "",
    image: null,
    signature_name: "",
    student_name: "",
    subject: "",
    certificate_name: "",
    format: "pdf",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];

      if (file) {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
          setMessage("Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP).");
          setMessageType("error");
          return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB Max size
          setMessage("File too large. Maximum size is 5MB.");
          setMessageType("error");
          return;
        }
      }

      setFormData({ ...formData, [name]: file });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      const response = await axios.post("http://localhost:8000/pdf-generator.php", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.error) {
        setMessage(response.data.error);
        setMessageType("error");
      } else {
        setMessage("Form submitted successfully!");
        setMessageType("success");
      }
    } catch (error) {
      console.error("Submission failed", error);
      setMessage("Something went wrong! Please try again.");
      setMessageType("error");
    }
  };

  return (
    <Wrapper>
      <FormContainer onSubmit={handleSubmit}>
        <FieldContainer>
          <Label>Date:<span>*</span></Label>
          <Input type="date" name="date" value={formData.date} onChange={handleChange} required />
        </FieldContainer>
        <FieldContainer>
          <Label>Image:<span>*</span></Label>
          <Input type="file" name="image" onChange={handleChange} required />
        </FieldContainer>
        <FieldContainer>
          <Label>Signature Name:<span>*</span></Label>
          <Input type="text" name="signature_name" value={formData.signature_name} onChange={handleChange} required />
        </FieldContainer>
        <FieldContainer>
          <Label>Student Name:<span>*</span></Label>
          <Input type="text" name="student_name" value={formData.student_name} onChange={handleChange} required />
        </FieldContainer>
        <FieldContainer>
          <Label>Subject:<span>*</span></Label>
          <Input type="text" name="subject" value={formData.subject} onChange={handleChange} required />
        </FieldContainer>
        <FieldContainer>
          <Label>Certificate Name:<span>*</span></Label>
          <Input type="text" name="certificate_name" value={formData.certificate_name} onChange={handleChange} required />
        </FieldContainer>
        <FieldContainer>
          <Label>Format:<span>*</span></Label>
          <Select name="format" value={formData.format} onChange={handleChange} required>
            <option value="pdf">PDF</option>
            <option value="html">HTML</option>
            <option value="xlsx">XLSX</option>
            <option value="zip">ZIP</option>
          </Select>
        </FieldContainer>


        <Button type="submit">Generate</Button>

        {message && (
          <ErrorMessage style={{ color: messageType === "success" ? "green" : "red" }}>
            {message}
          </ErrorMessage>
        )}
      </FormContainer>
    </Wrapper>
  );
};

export default Form;
