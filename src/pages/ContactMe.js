import React, { useState } from 'react';
import axios from 'axios';
import './ContactMe.css';

const ContactMe = () => {
  const [formData, setFormData] = useState({
    subject: '',
    email: '',
    content: '',
  });

  const [messageStatus, setMessageStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/messages', formData);
      setMessageStatus('Message sent successfully!');
      setFormData({
        subject: '',
        email: '',
        content: '',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setMessageStatus('Failed to send message.');
    }
  };

  return (
    <div className="contact-container">
      <h1>Contact Me</h1>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Subject:
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Message:
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
          ></textarea>
        </label>
        <button type="submit">Send</button>
      </form>
      {messageStatus && <p>{messageStatus}</p>}
    </div>
  );
};

export default ContactMe;
