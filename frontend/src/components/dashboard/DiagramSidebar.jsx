import React from 'react';
import { useDrag } from 'react-dnd';

const ItemTypes = {
  NODE: 'node',
};

const DraggableNode = ({ type }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.NODE,
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}>
      {type}
    </div>
  );
};

const Sidebar = () => (
  <div>
    <h3>Nodes</h3>
    <DraggableNode type="Task" />
    <DraggableNode type="Asset" />
    <DraggableNode type="Scene" />
  </div>
);

export default Sidebar;
