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
import { GuideDetailsForm } from './types';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  EditingTextFieldHeader,
  restrictionSelectOptions,
} from '../Line/LineEditCard';
import { S3ImageList, S3PhotoMeta } from 'app/components/ImageList';

const guideTypes: { value: GuideType; label: string }[] = [
  {
    value: 'other',
    label: 'Other',
  },
  {
    value: 'parkingLot',
    label: 'Parking Lot',
  },
  {
    value: 'accessPath',
    label: 'Access Path',
  },
  {
    value: 'campingSpot',
    label: 'Camping Spot',
  },
  {
    value: 'riggingPath',
    label: 'Rigging Path',
  },
];

interface Props {
  initialValues?: GuideDetailsForm;
  mapErrors?: string[];
  onSubmit: (values: GuideDetailsForm) => void;
  disableSubmit?: boolean;
  isSubmitting?: boolean;
}

const cleanValues = (values: GuideDetailsForm): GuideDetailsForm => {
  return {
    ...values, // Nothing needed
  };
};

export const GuideEditCard = (props: Props) => {
  const isCreateMode = !props.initialValues;

  const [images, setImages] = React.useState<S3PhotoMeta[]>(
    props.initialValues?.images ?? [],
  );

  const onPhotosChanged = (photos: S3PhotoMeta[]) => {
    setImages(photos);
  };

  // const validationSchema = z.object({});
  const formik = useFormik<GuideDetailsForm>({
    initialValues: props.initialValues ?? {
      type: 'other',
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
          <>
            <Typography variant="h5">
              {isCreateMode ? 'Create New Guide' : 'Edit Guide'}
            </Typography>
          </>
        }
      />
      <CardContent component={Stack} spacing={1} sx={{}}>
        {isCreateMode && (
          <Typography variant="caption">
            Guides are used to provide extra visual information for the viewers.
            You can draw anything that can be helpful for the given area, such
            like parking lots, campings spots, hiking paths etc..
          </Typography>
        )}
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
              select
              field="type"
              label="Type"
              required
            >
              {guideTypes.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </EditingTextField>

            <EditingTextField
              formik={formik}
              field={'description'}
              label={'Description'}
              multiline
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

interface EditingTextFieldProps extends StandardTextFieldProps {
  formik: any;
  field: keyof GuideDetailsForm;
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
