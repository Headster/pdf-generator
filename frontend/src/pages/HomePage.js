import React, { useState, useEffect } from 'react';
import Form from '../components/Form';
import UploadTemplate from '../components/UploadTemplate';
import { getTemplates } from '../services/api';

const HomePage = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const templatesData = await getTemplates();
            setTemplates(templatesData);
        } catch (error) {
            console.error("Error fetching templates:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    return (
        <>
            <UploadTemplate onUploadSuccess={fetchTemplates} />

            <Form templates={templates} loading={loading} />
        </>
    );
};

export default HomePage;
