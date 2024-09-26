import axios from 'axios';

export const sendEmail = async (emailContent) => {
    try {
        const response = await axios.post('http://localhost:8080/sendMail', emailContent, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data; // Return the response data
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
