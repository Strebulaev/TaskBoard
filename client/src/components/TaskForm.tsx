import { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Alert,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useProjectStore } from '@store/projectStore';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  projectId?: string;
}

interface Project {
  id: string;
  title: string;
  members: Array<{
    userId: string;
    user: {
      id: string;
      name: string;
    };
  }>;
}

interface Member {
  userId: string;
  user: {
    id: string;
    name: string;
  };
}

export function TaskForm({ open, onClose, onSuccess, projectId }: TaskFormProps) {
  const { projects, fetchProjects } = useProjectStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || '');
  const [assigneeId, setAssigneeId] = useState('');
  const [reviewerId, setReviewerId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFetchProjects = useCallback(async () => {
    await fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (open) {
      handleFetchProjects();
    }
  }, [open, handleFetchProjects]);

  const resetForm = useCallback(() => {
    setTitle('');
    setDescription('');
    setStatus('todo');
    setDeadline(null);
    setAssigneeId('');
    setReviewerId('');
    setError('');
    setSelectedProjectId(projectId || '');
  }, [projectId]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title,
          description,
          status,
          deadline: deadline ? deadline.toISOString() : undefined,
          projectId: selectedProjectId,
          assigneeId: assigneeId || undefined,
          reviewerId: reviewerId || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create task');
      }

      onSuccess();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const currentProject = projects.find((p: Project) => p.id === selectedProjectId);
  const members = currentProject?.members || [];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New Task</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>Project</InputLabel>
              <Select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                label="Project"
              >
                {projects.map((project: Project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
                <MenuItem value="todo">To Do</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="review">Review</MenuItem>
                <MenuItem value="done">Done</MenuItem>
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Deadline"
                value={deadline}
                onChange={(newValue) => setDeadline(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
            <FormControl fullWidth>
              <InputLabel>Assignee</InputLabel>
              <Select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                label="Assignee"
              >
                <MenuItem value="">None</MenuItem>
                {members.map((member: Member) => (
                  <MenuItem key={member.userId} value={member.userId}>
                    {member.user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Reviewer</InputLabel>
              <Select
                value={reviewerId}
                onChange={(e) => setReviewerId(e.target.value)}
                label="Reviewer"
              >
                <MenuItem value="">None</MenuItem>
                {members.map((member: Member) => (
                  <MenuItem key={member.userId} value={member.userId}>
                    {member.user.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {error && <Alert severity="error">{error}</Alert>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Creating...' : 'Create Task'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
