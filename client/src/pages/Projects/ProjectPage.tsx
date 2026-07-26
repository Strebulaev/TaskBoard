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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useProject, useUpdateProject } from '@hooks/queries/useProjects';
import { useUser } from '@hooks/useUser';
import { useRemoveProjectMember, useUpdateProjectMemberRole } from '@hooks/queries/useProjects';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { StatusChip } from '@components/common/StatusChip';
import { TaskForm } from '@components/TaskForm';
import { AddMemberModal } from './components/AddMemberModal';
import { useState, useCallback } from 'react';
import type { Task } from '@/types/task';
import type { Project } from '@/types/project';

export default function ProjectPage() {
  const { id } = useParams();
  const [openTaskForm, setOpenTaskForm] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editRepoLink, setEditRepoLink] = useState('');
  const [addMemberOpen, setAddMemberOpen] = useState(false);

  const { data: projectData, isLoading, refetch } = useProject(id!);
  const { user: currentUser } = useUser();
  const updateProject = useUpdateProject();
  const removeMember = useRemoveProjectMember();
  const updateMemberRole = useUpdateProjectMemberRole();

  const currentUserMember = projectData?.members?.find((m) => m.userId === currentUser?.id);
  const project = projectData as Project | undefined;
  const isOwner = currentUserMember?.role === 'owner';
  const owner = project?.members?.find((m) => m.role === 'owner');

  const handleRemoveMember = useCallback(
    async (userId: string) => {
      await removeMember.mutateAsync({ projectId: id!, userId });
      refetch();
    },
    [removeMember, id, refetch]
  );

  const handleRoleChange = useCallback(
    async (userId: string, newRole: string) => {
      await updateMemberRole.mutateAsync({ projectId: id!, userId, role: newRole });
      refetch();
    },
    [updateMemberRole, id, refetch]
  );

  if (isLoading) return <LoadingSpinner />;
  if (!project) return <Typography>Project not found</Typography>;

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
          {isOwner && (
            <IconButton onClick={handleEditOpen}>
              <EditIcon />
            </IconButton>
          )}
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Members</Typography>
          {isOwner && (
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => setAddMemberOpen(true)}
            >
              Add Member
            </Button>
          )}
        </Box>
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
                    {member.user.email}
                  </Typography>
                </Box>
                {isOwner && member.role !== 'owner' ? (
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                      <InputLabel>Role</InputLabel>
                      <Select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.userId, e.target.value)}
                        label="Role"
                      >
                        <MenuItem value="member">Member</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    </FormControl>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemoveMember(member.userId)}
                      disabled={removeMember.isPending}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <Chip
                    label={member.role}
                    size="small"
                    color={member.role === 'owner' ? 'primary' : 'default'}
                  />
                )}
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
                      color={new Date(task.deadline) < new Date() ? 'error' : 'default'}
                    />
                  )}
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

      <AddMemberModal
        open={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        projectId={id!}
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
