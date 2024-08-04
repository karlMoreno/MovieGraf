import React, { useState } from 'react';

const NodeForm = ({ show, handleClose, handleSave }) => {
  const [nodeAttributes, setNodeAttributes] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNodeAttributes({ ...nodeAttributes, [name]: value });
  };

  const handleSubmit = () => {
    handleSave(nodeAttributes);
    handleClose();
  };

  return show ? (
    <div>
      <h3>Node Form</h3>
      <input name="label" placeholder="Label" onChange={handleChange} />
      <button onClick={handleSubmit}>Save</button>
      <button onClick={handleClose}>Close</button>
    </div>
  ) : null;
};

export default NodeForm;
