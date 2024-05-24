import React from 'react';
import { useTheme } from "@mui/material/styles";
import { Table } from 'antd';
import TimelineForm from '../forms/TimelineForm'; // Adjust the import path as necessary
import './darkTable.css'; // Import the dark mode CSS

const columns = [
  {
    title: 'Shot 0',
    dataIndex: 'name',
    render: () => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <TimelineForm />
      </div>
    ),
  },
  {
    title: 'Shot 1',
    dataIndex: 'age',
    render: () => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <TimelineForm />
      </div>
    ),
  },
  {
    title: 'Shot 2',
    dataIndex: 'address',
    render: () => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <TimelineForm />
      </div>
    ),
  },
  {
    title: 'Shot 3',
    dataIndex: 'address',
    render: () => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <TimelineForm />
      </div>
    ),
  },
  {
    title: 'Shot 4',
    dataIndex: 'address',
    render: () => (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <TimelineForm />
      </div>
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
  return (
    <div className="App">
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: 800 }}
        pagination={false}
        bordered
      />
    </div>
  );
}

export default App;
