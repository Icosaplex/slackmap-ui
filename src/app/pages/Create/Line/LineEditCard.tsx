import React, { HTMLInputTypeAttribute, ReactNode, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import { LoadingIndicator } from 'app/components/LoadingIndicator';
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
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
import { LineDetailsForm } from './types';
import LoadingButton from '@mui/lab/LoadingButton';
import { S3ImageList, S3PhotoMeta } from 'app/components/ImageList';

const lineTypes: { value: SlacklineType; label: string }[] = [
  {
    value: 'other',
    label: 'Other',
  },
  {
    value: 'highline',
    label: 'Highline',
  },
  {
    value: 'waterline',
    label: 'Waterline',
  },
];

export const restrictionSelectOptions: {
  value: SlacklineRestrictionLevel;
  label: string;
}[] = [
  {
    value: 'none',
    label: 'None',
  },
  {
    value: 'partial',
    label: 'Partially Restricted',
  },
  {
    value: 'full',
    label: 'Fully Restricted',
  },
];
interface Props {
  initialValues?: LineDetailsForm;
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
  const isCreateMode = !props.initialValues;

  const [images, setImages] = React.useState<S3PhotoMeta[]>(
    props.initialValues?.images ?? [],
  );

  const onPhotosChanged = (photos: S3PhotoMeta[]) => {
    setImages(photos);
  };

  // const validationSchema = z.object({});
  const formik = useFormik<LineDetailsForm>({
    initialValues: props.initialValues ?? {
      isMeasured: false,
      type: 'other',
      restrictionLevel: 'none',
    },
    // validationSchema: toFormikValidationSchema(validationSchema),
    // validateOnChange: true,
    onSubmit: values => {
      const allValues = { ...values, images: images };
      props.onSubmit(cleanValues(allValues));
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
            <EditingTextFieldHeader>Specs</EditingTextFieldHeader>

            <EditingTextField
              formik={formik}
              select
              field="type"
              label="Type"
              required
            >
              {lineTypes.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </EditingTextField>

            <EditingTextField
              formik={formik}
              field="length"
              label="Length (meters)"
              type="number"
            />

            <EditingTextField
              formik={formik}
              field="height"
              label="Height (meters)"
              type="number"
            />

            <FormControlLabel
              control={<Checkbox />}
              label="Is Laser Measured?"
              checked={formik.values.isMeasured}
              name="isMeasured"
              onChange={formik.handleChange}
            />

            <EditingTextFieldHeader>Details</EditingTextFieldHeader>

            <EditingTextField
              formik={formik}
              field={'name'}
              label={'Name of the line'}
            />
            <EditingTextField
              formik={formik}
              field={'description'}
              label={'Description'}
              multiline
            />
            <EditingTextField
              formik={formik}
              field={'anchorsInfo'}
              label={'Anchor Information'}
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

            <EditingTextFieldHeader subHeader="All the photos are publicly viewable. You can add max 3 photos and max file size allowed is 2 MB">
              Media
            </EditingTextFieldHeader>

            <S3ImageList
              userMode="edit"
              photos={props.initialValues?.images}
              onPhotosChanged={onPhotosChanged}
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

export const EditingTextFieldHeader = (props: {
  children: ReactNode;
  subHeader?: string;
}) => {
  const { children, subHeader } = props;

  return (
    <>
      <Typography variant="h5" sx={{ color: t => t.palette.primary.main }}>
        {children}
      </Typography>
      {subHeader && (
        <Typography
          variant="caption"
          sx={{ color: t => t.palette.text.primary }}
        >
          {subHeader}
        </Typography>
      )}
    </>
  );
};

interface EditingTextFieldProps extends StandardTextFieldProps {
  formik: any;
  field: keyof LineDetailsForm;
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
