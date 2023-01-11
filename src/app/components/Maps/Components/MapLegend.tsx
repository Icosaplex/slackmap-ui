import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Stack,
} from '@mui/material';
import { check } from 'prettier';
import React from 'react';

export interface LegendOptions {
  spots?: boolean;
  lines?: boolean;
  guides?: boolean;
  communities?: boolean;
}
interface Props {
  options: LegendOptions;
  onOptionsChange: (options: LegendOptions) => void;
}

export const MapLegend = (props: Props) => {
  const onChange = (key: string, checked?: boolean) => {
    props.onOptionsChange({
      ...props.options,
      [key]: checked,
    });
  };
  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: 1,
        bottom: { xs: '6rem', lg: '2rem' },
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          pointerEvents: 'initial',
          '.MuiTypography-body1': {
            fontSize: '0.8rem',
          },
        }}
      >
        <FormGroup
          row
          sx={{
            pl: 1,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={props.options.spots}
                onChange={e => {
                  onChange('spots', e.target.checked);
                }}
              />
            }
            label="Spots"
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={props.options.lines}
                onChange={e => {
                  onChange('lines', e.target.checked);
                }}
              />
            }
            label="Lines"
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={props.options.guides}
                onChange={e => {
                  onChange('guides', e.target.checked);
                }}
              />
            }
            label="Guides"
            disabled
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={props.options.communities}
                onChange={e => {
                  onChange('communities', e.target.checked);
                }}
              />
            }
            label="Communities"
            disabled
          />
        </FormGroup>
      </Paper>

      {/* </Stack> */}
    </Box>
  );
};
