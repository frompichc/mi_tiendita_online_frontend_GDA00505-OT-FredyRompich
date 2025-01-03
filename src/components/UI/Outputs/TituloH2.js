import { Typography } from '@mui/material';

const TituloH2 = ({titulo}) => {
    return (
        <Typography
            variant="h2"
            sx={{
                color: '#1976D2',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                textAlign: 'center',
                mt: 3,
                mb: 1
            }}
        >
            {titulo}
        </Typography>
      );

}

export default TituloH2;