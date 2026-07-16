import { useParams, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { useProject, useUpdateProject } from '@hooks/queries/useProjects';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { StatusChip } from '@components/common/StatusChip';
import { TaskForm } from '@components/TaskForm';
import { useState } from 'react';

interface Member {
  userId: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface Task {
  id: string;
  title: string;
  status: string;
  deadline?: string;
  assignee?: {
    name: string;
  };
}

interface Project {
  id: string;
  title: string;
  description?: string;
  repoLink?: string;
  members: Member[];
  tasks: Task[];
}

export default function ProjectPage() {
  const { id } = useParams();
  const [openTaskForm, setOpenTaskForm] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editRepoLink, setEditRepoLink] = useState('');

  const { data: project, isLoading, refetch } = useProject(id!);
  const updateProject = useUpdateProject();

  if (isLoading) return <LoadingSpinner />;
  if (!project) return <Typography>Project not found</Typography>;

  const typedProject = project as Project;
  const owner = typedProject.members?.find((m: Member) => m.role === 'owner');

  const handleEditOpen = () => {
    setEditTitle(typedProject.title);
    setEditDescription(typedProject.description || '');
    setEditRepoLink(typedProject.repoLink || '');
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    await updateProject.mutateAsync({
      id: typedProject.id,
      data: {
        title: editTitle,
        description: editDescription,
        repoLink: editRepoLink,
      },
    });
    setEditModalOpen(false);
    refetch();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">{typedProject.title}</Typography>
          <IconButton onClick={handleEditOpen}>
            <EditIcon />
          </IconButton>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {typedProject.description || 'No description'}
        </Typography>
        {typedProject.repoLink && (
          <Typography variant="body2">
            Repo:{' '}
            <a href={typedProject.repoLink} target="_blank" rel="noopener noreferrer">
              {typedProject.repoLink}
            </a>
          </Typography>
        )}
        <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label={`Owner: ${owner?.user?.name || 'Unknown'}`} color="primary" />
          <Chip label={`${typedProject.members?.length || 0} members`} />
          <Chip label={`${typedProject.tasks?.length || 0} tasks`} />
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Members</Typography>
        <List>
          {typedProject.members?.map((member: Member) => (
            <ListItem key={member.userId}>
              <ListItemAvatar>
                <Avatar>{member.user.name[0]}</Avatar>
              </ListItemAvatar>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignItems: 'center',
                }}
              >
                <Box>
                  <Typography variant="body1">{member.user.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.role}
                  </Typography>
                </Box>
                <Chip
                  label={member.role}
                  size="small"
                  color={member.role === 'owner' ? 'primary' : 'default'}
                />
              </Box>
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Tasks</Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setOpenTaskForm(true)}
          >
            New Task
          </Button>
        </Box>
        {typedProject.tasks?.length === 0 ? (
          <Typography color="text.secondary">No tasks yet</Typography>
        ) : (
          <List>
            {typedProject.tasks?.map((task: Task) => (
              <ListItem
                key={task.id}
                component={Link}
                to={`/task/${task.id}`}
                sx={{
                  textDecoration: 'none',
                  color: 'inherit',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: 0.5,
                }}
              >
                <Typography variant="body1">{task.title}</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                  <StatusChip status={task.status} />
                  {task.deadline && (
                    <Chip
                      component="span"
                      label={`Due: ${new Date(task.deadline).toLocaleDateString()}`}
                      size="small"
                      color={
                        new Date(task.deadline) < new Date() && task.status !== 'done'
                          ? 'error'
                          : 'default'
                      }
                      sx={{ display: 'inline-flex' }}
                    />
                  )}
                  <Chip
                    component="span"
                    label={`Assignee: ${task.assignee?.name || 'Unassigned'}`}
                    size="small"
                    sx={{ display: 'inline-flex' }}
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <TaskForm
        open={openTaskForm}
        onClose={() => setOpenTaskForm(false)}
        onSuccess={() => {
          refetch();
        }}
        projectId={id}
      />

      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Project</DialogTitle>
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
              rows={3}
              fullWidth
            />
            <TextField
              label="Repository Link"
              value={editRepoLink}
              onChange={(e) => setEditRepoLink(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
