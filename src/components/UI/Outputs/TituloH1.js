import { Typography } from '@mui/material';

const TituloH1 = ({titulo}) => {
    return (
        <Typography
            variant="h1"
            sx={{
                color: '#1976D2',
                fontSize: '2rem',
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

export default TituloH1;