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
                  fontSize: '1.2rem', 
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