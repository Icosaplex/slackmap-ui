import React, { HTMLInputTypeAttribute, ReactNode, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { LoadingIndicator } from 'app/components/LoadingIndicator';
import {
  Alert,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  StandardTextFieldProps,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useFormik } from 'formik';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { SpotDetailsForm } from './types';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  EditingTextFieldHeader,
  restrictionSelectOptions,
} from '../Line/LineEditCard';

interface Props {
  initialValues?: SpotDetailsForm;
  mapErrors?: string[];
  onSubmit: (values: SpotDetailsForm) => void;
  disableSubmit?: boolean;
  isSubmitting?: boolean;
}

const cleanValues = (values: SpotDetailsForm): SpotDetailsForm => {
  return {
    ...values, // Nothing needed
  };
};

export const SpotEditCard = (props: Props) => {
  const isCreateMode = !props.initialValues;

  // const validationSchema = z.object({});

  const formik = useFormik<SpotDetailsForm>({
    initialValues: props.initialValues ?? {
      restrictionLevel: 'none',
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
      <CardHeader
        avatar={
          <Avatar sx={{ backgroundColor: t => t.palette.primary.main }}>
            <AddIcon />
          </Avatar>
        }
        title={
          <>
            <Typography variant="h5">
              {isCreateMode ? 'Create New Spot' : 'Edit Spot'}
            </Typography>
          </>
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
            <EditingTextFieldHeader>Details</EditingTextFieldHeader>

            <EditingTextField
              formik={formik}
              field={'name'}
              label={'Name of the spot'}
            />
            <EditingTextField
              formik={formik}
              field={'description'}
              label={'Description'}
              multiline
            />
            <EditingTextField
              formik={formik}
              field={'accessInfo'}
              label={'Access Information'}
              multiline
            />
            <EditingTextField
              formik={formik}
              field={'contactInfo'}
              label={'Contact Information'}
              multiline
            />
            <EditingTextField
              formik={formik}
              field={'extraInfo'}
              label={'Extra Information'}
              multiline
            />

            <EditingTextFieldHeader
              subHeader='Access restriction warnings will be displayed to the viewers
                  on top of the page to prevent permission problems. "Partial"
                  restriction in just a warning and "Full" means it requires
                  permissions.'
            >
              Restriction
            </EditingTextFieldHeader>

            <EditingTextField
              formik={formik}
              select
              field="restrictionLevel"
              label="Restriction Level"
              required
            >
              <MenuItem value={''}></MenuItem>
              {restrictionSelectOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </EditingTextField>

            <EditingTextField
              formik={formik}
              field={'restrictionInfo'}
              label={'Restriction Details'}
              multiline
              placeholder="Don't forget to add your contact info for people to reach you"
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
    </Card>
  );
};

interface EditingTextFieldProps extends StandardTextFieldProps {
  formik: any;
  field: keyof SpotDetailsForm;
}
const EditingTextField = (props: EditingTextFieldProps) => {
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
