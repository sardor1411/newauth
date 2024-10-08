import React, { useState, useEffect } from 'react';

const Jadval = ({ workerId, existingSchedule, onSaveSchedule }) => {
  const [schedule, setSchedule] = useState(
    Array.from({ length: 30 }, () => ({ present: false, note: '' }))
  );

  useEffect(() => {
    if (existingSchedule) {
      setSchedule(existingSchedule);
    }
  }, [existingSchedule]);

  const handleCheckboxChange = (index) => {
    const newSchedule = schedule.map((day, i) =>
      i === index ? { ...day, present: !day.present } : day
    );
    setSchedule(newSchedule);
  };

  const handleInputChange = (index, value) => {
    const newSchedule = schedule.map((day, i) =>
      i === index ? { ...day, note: value } : day
    );
    setSchedule(newSchedule);
  };

  const handleSave = () => {
    onSaveSchedule(workerId, schedule);
  };

  return (
    <div>
      <h1>Attendance Schedule</h1>
      <div>
        {schedule.map((day, index) => (
          <div key={index} className='flex items-center mb-2'>
            <label className='mr-2'>Day {index + 1}:</label>
            <input
              type="checkbox"
              checked={day.present}
              onChange={() => handleCheckboxChange(index)}
              className='mr-2'
            />
            <input
              type="text"
              value={day.note}
              onChange={(e) => handleInputChange(index, e.target.value)}
              placeholder='Note'
              className='p-2 border border-gray-300 rounded'
            />
          </div>
        ))}
      </div>
      <button
        className='mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600'
        onClick={handleSave}
      >
        Save Schedule
      </button>
    </div>
  );
};

export default Jadval;
