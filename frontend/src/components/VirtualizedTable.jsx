import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';

const sample = [
  ['3D Model', 'Digital Asset', 150, 'High-poly character model', '2024-04-01'],
  ['Texture Pack', 'Digital Asset', 50, '4K texture maps', '2024-03-15'],
  ['Animation Clip', 'Digital Asset', 75, 'Walk cycle animation', '2024-02-20'],
  ['Software License', 'Software', 500, 'Maya 2024', '2024-01-10'],
  ['Rendering Engine', 'Software', 1000, 'Arnold Renderer', '2024-05-05'],
];

function createData(id, name, category, size, description, acquisitionDate) {
  return { id, name, category, size, description, acquisitionDate };
}

const columns = [
  {
    width: 200,
    label: 'Asset Name',
    dataKey: 'name',
  },
  {
    width: 150,
    label: 'Category',
    dataKey: 'category',
  },
  {
    width: 150,
    label: 'size\u00A0(mb)',
    dataKey: 'size',
    numeric: true,
  },
  {
    width: 200,
    label: 'Description',
    dataKey: 'description',
  },
  {
    width: 150,
    label: 'Acquisition Date',
    dataKey: 'acquisitionDate',
  },
];

const rows = Array.from({ length: 200 }, (_, index) => {
  const randomSelection = sample[Math.floor(Math.random() * sample.length)];
  return createData(index, ...randomSelection);
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

export default function VirtualizedTable() {
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
