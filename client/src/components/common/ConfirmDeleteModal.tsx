import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
}

export function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
}: ConfirmDeleteModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete {title}</DialogTitle>
      <DialogContent>
        <Typography>{message || `Are you sure you want to delete this ${title}?`}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
