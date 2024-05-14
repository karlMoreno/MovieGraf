import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';

// Sample data for tasks and their progress states
const sampleTasks = [
  ['Animation', 'Complete'],
  ['Compositing', 'InProgress'],
  ['Concept Art', 'NotStarted'],
  ['Lighting', 'InProgress'],
  ['Model3D', 'Complete'],
  ['Rendering', 'NotStarted'],
  ['Rigging', 'Complete'],
  ['Texturing', 'InProgress'],
  ['UVMapping', 'NotStarted'],
];

function createTaskData(id, task, progress) {
  return { id, task, progress };
}

const columns = [
  {
    width: 200,
    label: 'Task',
    dataKey: 'task',
  },
  {
    width: 150,
    label: 'Progress State',
    dataKey: 'progress',
  },
];

const rows = Array.from({ length: 200 }, (_, index) => {
  const randomSelection = sampleTasks[Math.floor(Math.random() * sampleTasks.length)];
  return createTaskData(index, ...randomSelection);
});

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead,
  TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
  TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};

function fixedHeaderContent() {
  return (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          variant="head"
          align={column.numeric || false ? 'right' : 'left'}
          style={{ width: column.width }}
          sx={{
            backgroundColor: 'background.paper',
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );
}

function rowContent(_index, row) {
  return (
    <React.Fragment>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align={column.numeric || false ? 'right' : 'left'}
        >
          {row[column.dataKey]}
        </TableCell>
      ))}
    </React.Fragment>
  );
}

export default function TasksTable() {
  return (
    <Paper style={{ height: 400, width: '100%' }}>
      <TableVirtuoso
        data={rows}
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
      />
    </Paper>
  );
}
