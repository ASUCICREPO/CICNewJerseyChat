import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import { Divider } from '@mui/material';
import { useResponseLength } from '../contexts/ResponseLengthContext'; 

const Input = styled(MuiInput)`
  width: 60px; 
`;

export default function InputSlider() {
  const { responseLength, setResponseLength } = useResponseLength(); 

  const handleSliderChange = (event, newValue) => {
    setResponseLength(newValue);
  };

  const handleInputChange = (event) => {
    setResponseLength(event.target.value === '' ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (responseLength < 1) {
      setResponseLength(1);
    } else if (responseLength > 4096) {
      setResponseLength(4096);
    }
  };

  return (
    <>
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          <Typography id="input-slider" gutterBottom>
            Response length
          </Typography>
        </Grid>
        <Grid item>
          <Input
            value={responseLength}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              min: 1,
              max: 4096,
              type: 'number',
              'aria-labelledby': 'input-slider',
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <Slider
            value={typeof responseLength === 'number' ? responseLength : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            min={1}
            max={4096}  // Set the maximum value to 4096
          />
        </Grid>
      </Grid>
    </>
  );
}
