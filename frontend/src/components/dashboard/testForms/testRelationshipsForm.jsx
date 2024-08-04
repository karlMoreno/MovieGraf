import React, { useState } from 'react';

const RelationshipForm = ({ show, handleClose, handleSave }) => {
  const [linkAttributes, setLinkAttributes] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLinkAttributes({ ...linkAttributes, [name]: value });
  };

  const handleSubmit = () => {
    handleSave(linkAttributes);
    handleClose();
  };

  return show ? (
    <div>
      <h3>Relationship Form</h3>
      <input name="type" placeholder="Type" onChange={handleChange} />
      <button onClick={handleSubmit}>Save</button>
      <button onClick={handleClose}>Close</button>
    </div>
  ) : null;
};

export default RelationshipForm;
