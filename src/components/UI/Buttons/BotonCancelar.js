import { Button } from '@mui/material'

const BotonCancelar = ({texto, onClick}, ancho = '100%') => {

    return (
        <Button
            type="button"
            variant="contained"
            onClick = {onClick}
            sx = {{
                marginTop: '20px',
                backgroundColor: '#F44336',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#D32F2F',
                },
                padding: '10px 20px',
                fontSize: '16px',
                fontWeight: 'bold',
                width: {ancho},
            }}
        >
            { texto }
        </Button>
    );

}

export default BotonCancelar;