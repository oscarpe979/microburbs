import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { TableSortLabel, Paper, Modal, Box } from '@mui/material';

// A simple Title component
function Title(props: React.PropsWithChildren) {
  return (
    <Typography component="h2" variant="h6" color="primary" gutterBottom sx={{ textAlign: 'center' }}>
      {props.children}
    </Typography>
  );
}

interface Row {
    address: {
        street: string;
    };
    price: number;
    property_type: string;
    attributes: {
        bedrooms: number;
        bathrooms: number;
        garage_spaces: number;
        land_size: string;
        description: string;
    };
    listing_date: string;
}

interface PropertiesTableProps {
    rows: Row[];
}

type Order = 'asc' | 'desc';

interface HeadCell {
  id: keyof Row | 'address.street' | 'attributes.bedrooms' | 'attributes.bathrooms' | 'attributes.garage_spaces' | 'attributes.land_size';
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: 'address.street', numeric: false, label: 'Address' },
  { id: 'price', numeric: true, label: 'Price' },
  { id: 'property_type', numeric: false, label: 'Property Type' },
  { id: 'attributes.bedrooms', numeric: true, label: 'Bedrooms' },
  { id: 'attributes.bathrooms', numeric: true, label: 'Bathrooms' },
  { id: 'attributes.garage_spaces', numeric: true, label: 'Garage Spaces' },
  { id: 'attributes.land_size', numeric: false, label: 'Land Size' },
  { id: 'listing_date', numeric: false, label: 'Listing Date' },
];

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: HeadCell['id']) => void;
  order: Order;
  orderBy: string;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler =
    (property: HeadCell['id']) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead sx={{ backgroundColor: 'rgba(255, 255, 255, 0.08)'}}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  height: '90%',
  overflow: 'auto',
};

function formatLandSize(landSize: string): string {
  if (landSize === null || landSize === undefined || landSize === 'None' || typeof landSize !== 'string') {
    return 'n/a';
  }
  const numericPart = parseFloat(landSize.replace(/[^0-9.]/g, ''));
  if (isNaN(numericPart)) {
    return landSize;
  }
  return `${Math.ceil(numericPart)} m²`;
}

export default function PropertiesTable({ rows }: PropertiesTableProps) {
  const theme = useTheme();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<HeadCell['id']>('price');
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<Row | null>(null);

  const handleOpen = (row: Row) => {
    setSelectedRow(row);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: HeadCell['id'],
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)),
    [order, orderBy, rows],
  );

  return (
    <Paper sx={{ p: 2, margin: 'auto', maxWidth: '100%', backgroundColor: theme.palette.background.paper }}>
      <Title>For Sales Properties</Title>
      <Table size="small" sx={{
        '& .MuiTableCell-root': {
          color: theme.palette.common.white,
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
      }}>
        <EnhancedTableHead
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
        />
        <TableBody>
          {visibleRows.map((row) => (
            <TableRow 
              key={row.address.street} 
              sx={{ 
                '&:last-child td, &:last-child th': { border: 0 },
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  cursor: 'pointer',
                },
              }}
              hover
              onClick={() => handleOpen(row)}
            >
              <TableCell>{row.address.street}</TableCell>
              <TableCell align="right">{`${row.price}`}</TableCell>
              <TableCell>{row.property_type}</TableCell>
              <TableCell align="right">{row.attributes.bedrooms ?? 'n/a'}</TableCell>
              <TableCell align="right">{row.attributes.bathrooms ?? 'n/a'}</TableCell>
              <TableCell align="right">{row.attributes.garage_spaces ?? 'n/a'}</TableCell>
              <TableCell>{formatLandSize(row.attributes.land_size)}</TableCell>
              <TableCell>{row.listing_date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Property Description
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {selectedRow?.attributes.description}
          </Typography>
        </Box>
      </Modal>
    </Paper>
  );
}