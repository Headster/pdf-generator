import React, { useState } from "react";
import { submitForm } from "../../services/api";
import {
    FormContainer,
    FieldContainer,
    Label,
    Input,
    Select,
    ErrorMessage,
} from "./Form.styles";
import Button from "../Button";

const FILE_SIZE_5MB = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

const Form = ({ templates, loading }) => {
    const [formData, setFormData] = useState({
        date: "",
        image: null,
        signature_name: "",
        student_name: "",
        subject: "",
        certificate_name: "",
        format: "pdf",
        template_id: "",
    });

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            const file = files[0];

            if (file) {
                if (!ALLOWED_TYPES.includes(file.type)) {
                    setMessage("Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP).");
                    setMessageType("error");
                    return;
                }

                if (file.size > FILE_SIZE_5MB) {
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
        if (submitting) return;
        setSubmitting(true);
        setMessage("");
        setMessageType("");

        try {
            const response = await submitForm(formData);
            console.log("Form submitted:", response);

            if (response?.file_url) {
                setMessage("Certificate generated successfully!");
                setMessageType("success");
                window.open(response.file_url, "_blank");
            } else {
                setMessage("PDF generation failed.");
                setMessageType("error");
            }
        } catch (error) {
            console.error("Submission failed", error);
            setMessage("Something went wrong! Please try again.");
            setMessageType("error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <FormContainer onSubmit={handleSubmit}>
                <h2>Generate Certificate</h2>
                <FieldContainer>
                    <Label>Select Template:<span>*</span></Label>
                    <Select
                        name="template_id"
                        value={formData.template_id}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        <option value="">Select Template</option>
                        {templates.map(template => (
                            <option key={template.id} value={template.id}>{template.name}</option>
                        ))}
                    </Select>
                </FieldContainer>
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

                <Button type="submit" disabled={submitting}>
                    {submitting ? "Generating..." : "Generate"}
                </Button>

                {message && (
                    <ErrorMessage style={{ color: messageType === "success" ? "green" : "red" }}>
                        {message}
                    </ErrorMessage>
                )}
            </FormContainer>
        </>
    );
};

export default Form;
