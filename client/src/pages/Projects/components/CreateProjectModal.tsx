import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import { useCreateProject } from '@hooks/queries/useProjects';

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ open, onClose }: CreateProjectModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [repoLink, setRepoLink] = useState('');
  const createProject = useCreateProject();

  const handleSubmit = async () => {
    await createProject.mutateAsync({ title, description, repoLink });
    onClose();
    setTitle('');
    setDescription('');
    setRepoLink('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Project</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          multiline
          rows={3}
        />
        <TextField
          fullWidth
          label="Repository Link"
          value={repoLink}
          onChange={(e) => setRepoLink(e.target.value)}
          margin="normal"
          placeholder="https://github.com/..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!title || createProject.isPending}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
