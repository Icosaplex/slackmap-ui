import {
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Stack,
} from '@mui/material';
import React, { ChangeEventHandler, useEffect } from 'react';
import { imageUrlFromS3Key, showErrorNotification } from 'utils';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useDispatch } from 'react-redux';

export interface S3PhotoMeta {
  s3Key?: string;
  id?: string;
  content?: string;
  isCover?: boolean;
}

interface Props {
  userMode: 'edit' | 'view';
  photos?: S3PhotoMeta[];
  onPhotosChanged?: (photos: S3PhotoMeta[]) => void;
}

export const S3ImageList = (props: Props) => {
  const dispatch = useDispatch();

  const [images, setImages] = React.useState<S3PhotoMeta[]>(props.photos ?? []);

  const onImageChange: ChangeEventHandler<any> = e => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        if (file.size > 2 * 1000 * 1000) {
          dispatch(showErrorNotification(`Max file size is 2MB`));
          e.target.value = null;
          return;
        }
        const fileNameArray = file.name.split('.');
        const fileExtension = fileNameArray[fileNameArray.length - 1];
        const allowedFileTypes = ['jpg', 'png', 'jpeg'];

        if (!allowedFileTypes.includes(fileExtension)) {
          dispatch(showErrorNotification('Only jpg and png are allowed.'));
          e.target.value = null;
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) {
            setImages([
              ...images,
              {
                content: reader.result.toString(),
              },
            ]);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const deletePhotoClicked = (id: string) => {
    setImages(images.filter(i => i.id !== id));
  };

  const makeCoverPhotoClicked = (id: string) => {
    setImages(images.map(i => ({ ...i, isCover: i.id === id })));
  };

  useEffect(() => {
    props.onPhotosChanged?.(images);
  }, [images]);

  return (
    <ImageList variant="standard" cols={1} sx={{ width: '100%' }}>
      {images
        .filter(i => i.s3Key)
        .map(item => (
          <ImageListItem key={item.s3Key}>
            <img src={imageUrlFromS3Key(item.s3Key)} alt={''} loading="lazy" />
            {props.userMode === 'edit' && (
              <ImageListItemBar
                actionIcon={
                  <Stack direction={'row'} spacing={1}>
                    <Button
                      sx={{
                        color: 'white',
                        display: item.isCover ? 'none' : 'block',
                      }}
                      size="small"
                      onClick={() => makeCoverPhotoClicked(item.id!)}
                    >
                      Make Cover Photo
                    </Button>
                    <IconButton
                      sx={{ color: 'white' }}
                      onClick={() => deletePhotoClicked(item.id!)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                }
              />
            )}
          </ImageListItem>
        ))}
      {props.userMode === 'edit' && images.length < 3 && (
        <>
          <label htmlFor="upload-photo">
            <IconButton component="span">
              <AddPhotoAlternateIcon />
            </IconButton>
          </label>
          <input
            id="upload-photo"
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            onChange={onImageChange}
          />
        </>
      )}
    </ImageList>
  );
};
