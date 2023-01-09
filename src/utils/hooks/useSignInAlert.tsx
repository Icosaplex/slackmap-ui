import { selectIsUserSignedIn } from 'app/slices/app/selectors';
import { useConfirm } from 'material-ui-confirm';
import { useSelector } from 'react-redux';

export const useSignInAlert = () => {
  const isUserSignedIn = useSelector(selectIsUserSignedIn);
  const confirm = useConfirm();

  const verifyUserSignIn = async () => {
    if (isUserSignedIn) {
      return true;
    } else {
      await confirm({
        title: '⚠️ Please Sign In!',
        content:
          'This action requires an authenticated user. Please, use the ISA Account sign in on the homepage.',
        cancellationButtonProps: {
          sx: { display: 'none' },
        },
        dialogProps: {
          PaperProps: {
            sx: {
              color: 'inherit',
              border: '1px solid',
              borderColor: t => t.palette.error.main,
            },
          },
        },
      })
        .then(() => {
          /* ... */
        })
        .catch(() => {
          /* ... */
        });
    }
  };
  return verifyUserSignIn;
};
