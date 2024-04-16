import React, { useState } from 'react';

interface UpdateCarFormProps {
    onUpdateCar: (name: string, color: string) => void;
}

const UpdateCarForm: React.FC<UpdateCarFormProps> = ({ onUpdateCar }) => {
  const [name, setName] = useState<string>('');
  const [color, setColor] = useState<string>('');

  const handleUpdateClick = () => {
    if (!name.trim() || !color.trim()) {
      // Display an error message or handle the empty values as needed
      return;
    }
    onUpdateCar(name, color);
    // Reset the form after updating
    setName('');
    setColor('');
  };

  return (
    <div>
      <label htmlFor="carName">
        Name:
        <input id="carName" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </label>
      <label htmlFor="carColor">
        Color:
        <input id="carColor" type="color" value={color} onChange={(e) => setColor(e.target.value)} required />
      </label>
      <button type="button" onClick={handleUpdateClick}>Update Car</button>
    </div>
  );
};

export default UpdateCarForm;
