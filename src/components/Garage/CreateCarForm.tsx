import React, { useState } from 'react';
import { createCar } from '../../api/apiService.ts';

const CreateCarForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [color, setColor] = useState<string>('#000000');

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !color.trim()) {
      // Display an error message or handle the empty values as needed
      return;
    }
    await createCar(name, color);
    setName('');
    setColor('#000000');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="carName">
        Name:
        <input id="carName" type="text" value={name} onChange={handleNameChange} required />
      </label>
      <label htmlFor="carColor">
        Color:
        <input id="carColor" type="color" value={color} onChange={handleColorChange} required />
      </label>
      <button type="submit">Create Car</button>
    </form>
  );
};

export default CreateCarForm;
