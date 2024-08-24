import React, { useState } from 'react';

const ScheduleForm = ({ onSubmit }) => {
  const [frequency, setFrequency] = useState('daily');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ frequency });
  };

  return (
    <form 
      style={{
        display: 'flex',
        backgroundColor: '#f7f7f7',
        padding: '20px',
        margin: '20px 0',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
      }} 
      onSubmit={handleSubmit}
    >
      <div style={{ width: '100%' }}>
        <select 
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            boxShadow: 'inset 0px 2px 4px rgba(0, 0, 0, 0.05)',
            backgroundColor: '#fff',
            appearance: 'none',
          }} 
          value={frequency} 
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <button 
        type="submit"
        style={{
          padding: '12px 20px',
          fontSize: '16px',
          color: '#fff',
          backgroundColor: '#007bff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
      >
        Schedule
      </button>
    </form>
  );
};

export default ScheduleForm;