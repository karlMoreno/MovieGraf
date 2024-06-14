import React, { useState } from 'react';
import { useTheme } from "@mui/material/styles";
import { Table, Collapse } from 'antd';
import TimelineForm from '../forms/TimelineForm'; // Adjust the import path as necessary
import './darkTable.css'; // Import the dark mode CSS
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const { Panel } = Collapse;

const initialColumns = [
  {
    title: 'Shot 0',
    dataIndex: 'name',
    render: () => (
      <Draggable draggableId="shot0" index={0}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Collapse>
              <Panel header="Shot 0" key="0">
                <TimelineForm />
                <p>Task 1</p>
                <p>Task 2</p>
                <p>Asset 1</p>
              </Panel>
            </Collapse>
          </div>
        )}
      </Draggable>
    ),
  },
  {
    title: 'Shot 1',
    dataIndex: 'age',
    render: () => (
      <Draggable draggableId="shot1" index={1}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Collapse>
              <Panel header="Shot 1" key="1">
                <TimelineForm />
                <p>Task 1</p>
                <p>Task 2</p>
                <p>Asset 1</p>
              </Panel>
            </Collapse>
          </div>
        )}
      </Draggable>
    ),
  },
  {
    title: 'Shot 2',
    dataIndex: 'address',
    render: () => (
      <Draggable draggableId="shot2" index={2}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Collapse>
              <Panel header="Shot 2" key="2">
                <TimelineForm />
                <p>Task 1</p>
                <p>Task 2</p>
                <p>Asset 1</p>
              </Panel>
            </Collapse>
          </div>
        )}
      </Draggable>
    ),
  },
  {
    title: 'Shot 3',
    dataIndex: 'address',
    render: () => (
      <Draggable draggableId="shot3" index={3}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Collapse>
              <Panel header="Shot 3" key="3">
                <TimelineForm />
                <p>Task 1</p>
                <p>Task 2</p>
                <p>Asset 1</p>
              </Panel>
            </Collapse>
          </div>
        )}
      </Draggable>
    ),
  },
  {
    title: 'Shot 4',
    dataIndex: 'address',
    render: () => (
      <Draggable draggableId="shot4" index={4}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Collapse>
              <Panel header="Shot 4" key="4">
                <TimelineForm />
                <p>Task 1</p>
                <p>Task 2</p>
                <p>Asset 1</p>
              </Panel>
            </Collapse>
          </div>
        )}
      </Draggable>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York Park',
  },
];

function App() {
  const theme = useTheme();
  const [columns, setColumns] = useState(initialColumns);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = Array.from(columns);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setColumns(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="timeline" direction="horizontal">
        {(provided) => (
          <div
            className="App"
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ display: 'flex' }}
          >
            {columns.map((column, index) => (
              <Draggable key={index} draggableId={`shot${index}`} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Collapse>
                      <Panel header={`Shot ${index}`} key={index}>
                        <TimelineForm />
                        <p>Task 1</p>
                        <p>Task 2</p>
                        <p>Asset 1</p>
                      </Panel>
                    </Collapse>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default App;
