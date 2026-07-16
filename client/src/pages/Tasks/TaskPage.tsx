import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  TextField,
  MenuItem,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import {
  useTask,
  useUpdateTaskStatus,
  useDeleteTask,
  useAssignAssignee,
  useAssignReviewer,
  useUpdateTask,
} from '@hooks/queries/useTasks';
import { useProjectMembers } from '@hooks/queries/useProjects';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { StatusChip } from '@components/common/StatusChip';
import { ConfirmDeleteModal } from '@components/common/ConfirmDeleteModal';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface User {
  id: string;
  name: string;
  email: string;
}

interface Project {
  id: string;
  title: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  deadline?: string;
  projectId: string;
  project?: Project;
  creator?: User;
  assignee?: User;
  reviewer?: User;
}

interface Member {
  userId: string;
  user: User;
}

const statusOptions = ['todo', 'in_progress', 'review', 'done'];

export default function TaskPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: task, isLoading, refetch } = useTask(id!);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDeadline, setEditDeadline] = useState<Date | null>(null);

  const updateStatus = useUpdateTaskStatus();
  const deleteTask = useDeleteTask();
  const assignAssignee = useAssignAssignee();
  const assignReviewer = useAssignReviewer();
  const updateTask = useUpdateTask();

  const typedTask = task as Task | undefined;
  const { data: members } = useProjectMembers(typedTask?.projectId || '');

  if (isLoading) return <LoadingSpinner />;
  if (!typedTask) return <Typography>Task not found</Typography>;

  const handleStatusChange = async () => {
    if (newStatus) {
      await updateStatus.mutateAsync({ id: typedTask.id, status: newStatus });
      setNewStatus('');
      refetch();
    }
  };

  const handleDelete = async () => {
    await deleteTask.mutateAsync(typedTask.id);
    navigate(`/project/${typedTask.projectId}`);
  };

  const handleEditOpen = () => {
    setEditTitle(typedTask.title);
    setEditDescription(typedTask.description || '');
    setEditDeadline(typedTask.deadline ? new Date(typedTask.deadline) : null);
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    await updateTask.mutateAsync({
      id: typedTask.id,
      data: {
        title: editTitle,
        description: editDescription,
        deadline: editDeadline ? editDeadline.toISOString() : undefined,
      },
    });
    setEditModalOpen(false);
    refetch();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}
        >
          <Typography variant="h4">{typedTask.title}</Typography>
          <Box>
            <IconButton size="small" onClick={handleEditOpen}>
              <Edit />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => setDeleteModalOpen(true)}>
              <Delete />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          <StatusChip status={typedTask.status} />
          {typedTask.deadline && (
            <Chip
              label={`Deadline: ${new Date(typedTask.deadline).toLocaleDateString()}`}
              color={
                new Date(typedTask.deadline) < new Date() && typedTask.status !== 'done'
                  ? 'error'
                  : 'default'
              }
            />
          )}
          {typedTask.project && <Chip label={`Project: ${typedTask.project.title}`} />}
        </Box>

        <Typography variant="body1" sx={{ mb: 2 }}>
          {typedTask.description || 'No description'}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
          <Box>
            <Typography variant="subtitle2">Author</Typography>
            <Chip label={typedTask.creator?.name || 'Unknown'} />
          </Box>
          <Box>
            <Typography variant="subtitle2">Assignee</Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip label={typedTask.assignee?.name || 'Unassigned'} />
              <TextField
                select
                size="small"
                value=""
                onChange={(e) =>
                  assignAssignee.mutate(
                    { id: typedTask.id, assigneeId: e.target.value || null },
                    { onSuccess: () => refetch() }
                  )
                }
                placeholder="Assign"
                sx={{ width: 120 }}
              >
                <MenuItem value="">Unassigned</MenuItem>
                {(members as Member[] | undefined)?.map((m: Member) => (
                  <MenuItem key={m.userId} value={m.userId}>
                    {m.user.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
          <Box>
            <Typography variant="subtitle2">Reviewer</Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip label={typedTask.reviewer?.name || 'Unassigned'} />
              <TextField
                select
                size="small"
                value=""
                onChange={(e) =>
                  assignReviewer.mutate(
                    { id: typedTask.id, reviewerId: e.target.value || null },
                    { onSuccess: () => refetch() }
                  )
                }
                placeholder="Assign"
                sx={{ width: 120 }}
              >
                <MenuItem value="">Unassigned</MenuItem>
                {(members as Member[] | undefined)?.map((m: Member) => (
                  <MenuItem key={m.userId} value={m.userId}>
                    {m.user.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Typography>Change Status:</Typography>
          <TextField
            select
            size="small"
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            sx={{ width: 150 }}
          >
            {statusOptions.map((s) => (
              <MenuItem key={s} value={s}>
                {s.replace('_', ' ')}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" onClick={handleStatusChange} disabled={!newStatus}>
            Update
          </Button>
        </Box>
      </Paper>

      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              fullWidth
            />
            <TextField
              label="Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Deadline"
                value={editDeadline}
                onChange={(newValue) => setEditDeadline(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Task"
      />
    </Container>
  );
}
