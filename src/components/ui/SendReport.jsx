import React, { useState } from 'react';
import { postDataBlob } from '../../services/api'

const SendPDF = (EntityName) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const sendEmail = async () => {
    setLoading(true);
    try {
      const response = await postDataBlob(`/send_pdf/send_pdf_email`, JSON.stringify({ entity_name: EntityName.EntityName }));

      if (response.data.success) {
        setStatus('Email sent successfully!');
      } else {
        setStatus('Failed to send email.');
      }
    } catch (error) {
      if (error.response) {
        console.error('Server response error:', error.response.data);
        console.error('Status code:', error.response.status);
      } else if (error.request) {
        console.error('Request was made but no response received:', error.request);
      } else {
        console.error('Error:', error.message);
      }
      setStatus('Error sending email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={sendEmail} disabled={loading}>
        {loading ? 'Sending...' : 'Send PDF via Email'}
      </button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default SendPDF;
