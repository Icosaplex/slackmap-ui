import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Stack,
} from '@mui/material';
import { check } from 'prettier';
import React, { useState } from 'react';

export interface LegendMenuItem {
  key: string;
  label: string;
  isSelected?: boolean;
  isDisabled?: boolean;
}
interface Props {
  menu: LegendMenuItem[];
  onItemsUpdated: (items: LegendMenuItem[]) => void;
  exclusiveSelection?: boolean;
}

export const MapLegend = (props: Props) => {
  const [items, setItems] = useState<LegendMenuItem[]>(props.menu);

  const onChange = (key: string, checked?: boolean) => {
    const newItems = [...items];
    if (props.exclusiveSelection && checked) {
      for (const item of newItems) {
        item.isSelected = false;
      }
    }
    for (const item of newItems) {
      item.isSelected = item.key === key ? checked : item.isSelected;
    }

    setItems(newItems);
    props.onItemsUpdated(newItems);
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        zIndex: 1,
        bottom: '2rem',
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
            fontSize: { xs: '0.7rem', lg: '1rem' },
          },
          '.MuiCheckbox-root': {
            padding: { xs: 0.5, lg: 1 },
          },
        }}
      >
        <FormGroup
          row
          sx={{
            pl: 1,
          }}
        >
          {items.map(option => (
            <FormControlLabel
              key={option.key}
              label={option.label}
              disabled={option.isDisabled}
              control={
                <Checkbox
                  size="small"
                  checked={option.isSelected}
                  onChange={e => {
                    onChange(option.key, e.target.checked);
                  }}
                />
              }
            />
          ))}
        </FormGroup>
      </Paper>
    </Box>
  );
};
