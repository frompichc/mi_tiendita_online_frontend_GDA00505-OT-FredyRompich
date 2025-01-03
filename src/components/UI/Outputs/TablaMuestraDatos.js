import React from 'react';
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';

function TablaMuestraDatos({ headers, data }) {
  return (
    <TableContainer component={Paper} sx={{maxWidth: '90%', margin: '0 auto'}}>
      <MuiTable>
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell key={index} align="center"
                sx={{
                  backgroundColor: '#E3F2FD',
                  fontSize: '1.2rem', // Tamaño de texto más grande
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#1976D2',
                  borderBottom: '1px solid #E0E0E0'
                }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {Object.values(row).map((cell, idx) => (
                <TableCell key={idx} align="center"
                  sx={{
                    backgroundColor: '#FFFFFF',
                    color: '#333333',
                    borderBottom: '1px solid #E0E0E0'
                  }}
                >
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}

export default TablaMuestraDatos;


/*import React from 'react';

function TablaMuestraDatos({ headers, data }) {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} style={{ border: '1px solid #ddd', padding: '8px' }}>
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            {Object.values(row).map((cell, idx) => (
              <td key={idx} style={{ border: '1px solid #ddd', padding: '8px' }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TablaMuestraDatos;*/