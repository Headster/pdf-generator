import React, { useState } from 'react';
import axios from 'axios';
import { Wrapper, FormContainer, FieldContainer, Label, Input, Button, ErrorMessage } from "./Form.styles";

const Form = () => {
    const [formData, setFormData] = useState({
        date: '',
        image: null,
        signature_name: '',
        student_name: '',
        subject: ''
    });

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('date', formData.date);
        data.append('image', formData.image);
        data.append('signature_name', formData.signature_name);
        data.append('student_name', formData.student_name);
        data.append('subject', formData.subject);

        try {
            const response = await axios.post('http://localhost:8000/pdf-generator', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Submission successful', response.data);
            setMessage('Form submitted successfully!');
            setMessageType('success');
        } catch (error) {
            console.error('Submission failed', error);
            setMessage('Something went wrong! Please try again.');
            setMessageType('error');
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
                
                <Button type="submit">Generate</Button>

                {message && (
                    <ErrorMessage style={{
                        color: messageType === 'success' ? 'green' : 'red',
                    }}>
                        {message}
                    </ErrorMessage>
                )}
            </FormContainer>
        </Wrapper>
    );
};

export default Form;
