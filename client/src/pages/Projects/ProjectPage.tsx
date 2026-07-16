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
import type { Task } from '@/types/task';
import type { Project } from '@/types/project';

export default function ProjectPage() {
  const { id } = useParams();
  const [openTaskForm, setOpenTaskForm] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editRepoLink, setEditRepoLink] = useState('');

  const { data: projectData, isLoading, refetch } = useProject(id!);
  const updateProject = useUpdateProject();

  if (isLoading) return <LoadingSpinner />;
  if (!projectData) return <Typography>Project not found</Typography>;

  const project = projectData as unknown as Project;

  const owner = project.members?.find((m) => m.role === 'owner');

  const handleEditOpen = () => {
    setEditTitle(project.title);
    setEditDescription(project.description || '');
    setEditRepoLink(project.repoLink || '');
    setEditModalOpen(true);
  };

  const handleEditSave = async () => {
    await updateProject.mutateAsync({
      id: project.id,
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
          <Typography variant="h4">{project.title}</Typography>
          <IconButton onClick={handleEditOpen}>
            <EditIcon />
          </IconButton>
        </Box>
        <Typography variant="body1" color="text.secondary">
          {project.description || 'No description'}
        </Typography>
        {project.repoLink && (
          <Typography variant="body2">
            Repo:{' '}
            <a href={project.repoLink} target="_blank" rel="noopener noreferrer">
              {project.repoLink}
            </a>
          </Typography>
        )}
        <Box sx={{ mt: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label={`Owner: ${owner?.user?.name || 'Unknown'}`} color="primary" />
          <Chip label={`${project.members?.length || 0} members`} />
          <Chip label={`${project.tasks?.length || 0} tasks`} />
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Members</Typography>
        <List>
          {project.members?.map((member) => (
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
        {!project.tasks || project.tasks.length === 0 ? (
          <Typography color="text.secondary">No tasks yet</Typography>
        ) : (
          <List>
            {project.tasks.map((task: Task) => (
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
