import { Button } from '@mui/material'

const BotonAceptar = ({texto, ancho = '100%', type = 'submit', onClick}) => {

    return (
        <Button
            type={type}
            variant="contained"
            onClick={onClick}
            sx = {{
                marginTop: '20px',
                backgroundColor: '#1976D2',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#1565C0',
                },
                padding: '10px 20px',
                fontSize: '16px',
                fontWeight: 'bold',
                width: ancho,
            }}
        >
            { texto }
        </Button>
    );

}

export default BotonAceptar;