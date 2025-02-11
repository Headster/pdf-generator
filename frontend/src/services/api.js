import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

export const getTemplates = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/get-templates.php`);
        return response.data?.response || [];
    } catch (error) {
        console.error("Error fetching templates:", error);
        throw error;
    }
};

export const submitForm = async (formData) => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
    });

    try {
        const response = await axios.post(`${API_BASE_URL}/pdf-generator.php`, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        console.error("Error submitting form:", error);
        throw error;
    }
};

export const uploadTemplate = async (jsonData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/upload-template.php`, jsonData, {
            headers: { "Content-Type": "application/json" },
        });

        return response.data;
    } catch (error) {
        console.error("Error uploading template:", error);
        throw error;
    }
};
