import React from 'react';
import { Table } from 'antd';
import TimelineForm from './TimelineForm'; // Make sure to import the TimelineForm component

const columns = [
  {
    title: 'Full Name',
    width: 100,
    dataIndex: 'name',
    fixed: 'left',
    render: () => <TimelineForm />,
  },
  {
    title: 'Age',
    width: 100,
    dataIndex: 'age',
    render: () => <TimelineForm />,
  },
  {
    title: 'Column 1',
    dataIndex: 'address',
    fixed: 'left',
    render: () => <TimelineForm />,
  },
  {
    title: 'Column 2',
    dataIndex: 'address',
    render: () => <TimelineForm />,
  },
  {
    title: 'Column 3',
    dataIndex: 'address',
    render: () => <TimelineForm />,
  },
  {
    title: 'Column 4',
    dataIndex: 'address',
    render: () => <TimelineForm />,
  },
  {
    title: 'Column 5',
    dataIndex: 'address',
    render: () => <TimelineForm />,
  },
  {
    title: 'Column 6',
    dataIndex: 'address',
    render: () => <TimelineForm />,
  },
  {
    title: 'Column 7',
    dataIndex: 'address',
    render: () => <TimelineForm />,
  },
  {
    title: 'Column 8',
    dataIndex: 'address',
    render: () => <TimelineForm />,
  },
  {
    title: 'Action 1',
    fixed: 'right',
    width: 90,
    render: () => <TimelineForm />,
  },
  {
    title: 'Action 2',
    width: 90,
    render: () => <TimelineForm />,
  },
  {
    title: 'Action 3',
    fixed: 'right',
    width: 90,
    render: () => <TimelineForm />,
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney Park',
  },
];

const App = () => (
  <Table
    columns={columns}
    dataSource={data}
    scroll={{
      x: 1300,
    }}
    pagination={false}
    bordered
  />
);

export default App;
