import React, { useState } from "react";
import { uploadTemplate } from "../../services/api";
import { Wrapper } from "./UploadTemplate.styles";
import Button from "../Button";

const UploadTemplate = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile && selectedFile.type === "application/json") {
            setFile(selectedFile);
            setMessage("");
        } else {
            setMessage("Please select a valid JSON file.");
            setMessageType("error");
            setFile(null);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file first.");
            setMessageType("error");
            return;
        }

        setLoading(true);

        try {
            const fileContent = await file.text();
            const jsonData = JSON.parse(fileContent);

            const response = await uploadTemplate(jsonData);
            setMessage(response.message || "Template uploaded successfully!");
            setMessageType("success");

            onUploadSuccess();
        } catch (error) {
            setMessage("Failed to upload template.");
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Wrapper>
            <h2>Upload JSON Template</h2>
            <input type="file" accept=".json" onChange={handleFileChange} />
            <Button onClick={handleUpload} disabled={loading}>
                {loading ? "Uploading..." : "Upload"}
            </Button>
            {message && (
                <p style={{ color: messageType === "success" ? "green" : "red" }}>
                    {message}
                </p>
            )}
        </Wrapper>
    );
};

export default UploadTemplate;
