import React, { HTMLInputTypeAttribute, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MapIcon from '@mui/icons-material/Map';
import { lineApi } from 'app/api/line-api';
import { LoadingIndicator } from 'app/components/LoadingIndicator';
import { format } from 'date-fns';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Menu,
  MenuItem,
  OutlinedTextFieldProps,
  Paper,
  Stack,
  StandardTextFieldProps,
  styled,
  Tab,
  Tabs,
  TextField,
  TextFieldProps,
  Theme,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import AddIcon from '@mui/icons-material/Add';
import { useFormik } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { LineDetailsForm } from './types';
import LoadingButton from '@mui/lab/LoadingButton';

const lineTypes: { value: SlacklineType; label: string }[] = [
  {
    value: 'highline',
    label: 'Highline',
  },
  {
    value: 'waterline',
    label: 'Waterline',
  },
  {
    value: 'other',
    label: 'Other',
  },
];
interface Props {
  initialValues?: LineDetailsForm;
  isInitialValuesLoading?: boolean;
  mapErrors?: string[];
  onSubmit: (values: LineDetailsForm) => void;
  disableSubmit?: boolean;
  isSubmitting?: boolean;
}

const cleanValues = (values: LineDetailsForm): LineDetailsForm => {
  return {
    ...values,
    length: values.length || undefined, // avoid empty string
    height: values.height || undefined,
  };
};

export const LineEditCard = (props: Props) => {
  const isCreateMode = !props.initialValues && !props.isInitialValuesLoading;

  // const validationSchema = z.object({});

  const formik = useFormik<LineDetailsForm>({
    initialValues: props.initialValues ?? {
      isMeasured: false,
      type: '',
    },
    // validationSchema: toFormikValidationSchema(validationSchema),
    // validateOnChange: true,
    onSubmit: values => {
      props.onSubmit(cleanValues(values));
    },
  });

  return (
    <Card
      sx={{
        boxShadow: 'none',
        border: 'none',
        height: '100%',
        width: '100%',
        overflow: 'scroll',
      }}
    >
      {props.isInitialValuesLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <CardHeader
            avatar={
              <Avatar sx={{ backgroundColor: t => t.palette.primary.main }}>
                <AddIcon />
              </Avatar>
            }
            title={
              <Typography variant="h5">
                {isCreateMode ? 'Create New Line' : 'Edit Line'}
              </Typography>
            }
          />
          <CardContent component={Stack} spacing={1} sx={{}}>
            <Stack spacing={1}>
              {props.mapErrors?.map(e => (
                <Alert key={e} severity="error">
                  {e}
                </Alert>
              ))}
            </Stack>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={1}>
                <Typography
                  variant="h5"
                  sx={{ color: t => t.palette.primary.main, mb: 1 }}
                >
                  Specs
                </Typography>

                <CustomTextField
                  formik={formik}
                  select
                  field="type"
                  label="Type"
                  required
                >
                  <MenuItem value={''}></MenuItem>
                  {lineTypes.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </CustomTextField>

                <CustomTextField
                  formik={formik}
                  field="length"
                  label="Length (meters)"
                  type="number"
                />

                <CustomTextField
                  formik={formik}
                  field="height"
                  label="Height (meters)"
                  type="number"
                />

                <FormControlLabel
                  control={<Checkbox />}
                  label="Is Measured?"
                  checked={formik.values.isMeasured}
                  name="isMeasured"
                  onChange={formik.handleChange}
                />

                <Typography
                  variant="h5"
                  sx={{ color: t => t.palette.primary.main, mb: 1 }}
                >
                  Details
                </Typography>

                <CustomTextField
                  formik={formik}
                  field={'name'}
                  label={'Name'}
                />
                <CustomTextField
                  formik={formik}
                  field={'description'}
                  label={'Description'}
                  multiline
                />
                <CustomTextField
                  formik={formik}
                  field={'anchorsInfo'}
                  label={'Anchor Information'}
                  multiline
                />
                <CustomTextField
                  formik={formik}
                  field={'accessInfo'}
                  label={'Access Information'}
                  multiline
                />
                <CustomTextField
                  formik={formik}
                  field={'contactInfo'}
                  label={'Contact Information'}
                  multiline
                />
                <CustomTextField
                  formik={formik}
                  field={'extraInfo'}
                  label={'Extra Information'}
                  multiline
                />

                <LoadingButton
                  color="primary"
                  variant="contained"
                  fullWidth
                  type="submit"
                  disabled={props.disableSubmit}
                  loading={props.isSubmitting}
                >
                  Submit
                </LoadingButton>
              </Stack>
            </form>
          </CardContent>
        </>
      )}
    </Card>
  );
};

interface CustomTextFieldProps extends StandardTextFieldProps {
  formik: any;
  field: keyof LineDetailsForm;
}

const CustomTextField = (props: CustomTextFieldProps) => {
  const { formik, field, ...rest } = props;

  return (
    <TextField
      fullWidth
      name={field}
      value={formik.values[field]}
      onChange={formik.handleChange}
      error={formik.touched[field] && Boolean(formik.errors[field])}
      helperText={formik.touched[field] && formik.errors[field]}
      autoComplete="off"
      {...rest}
    />
  );
};
