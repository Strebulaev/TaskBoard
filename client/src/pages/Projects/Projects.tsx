import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  Chip,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useProjects, useDeleteProject } from '@hooks/queries/useProjects';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { CreateProjectModal } from './components/CreateProjectModal';
import { ConfirmDeleteModal } from '@components/common/ConfirmDeleteModal';

interface Member {
  userId: string;
  role: string;
  user: {
    id: string;
    name: string;
  };
}

interface Task {
  id: string;
  title: string;
  status: string;
}

interface Project {
  id: string;
  title: string;
  description?: string;
  members?: Member[];
  tasks?: Task[];
}

export default function Projects() {
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const { data: projects, isLoading } = useProjects();
  const deleteProject = useDeleteProject();

  const typedProjects = projects as Project[] | undefined;

  const handleDelete = () => {
    if (selectedProjectId) {
      deleteProject.mutate(selectedProjectId);
      setDeleteModalOpen(false);
      setSelectedProjectId(null);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Projects</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setCreateModalOpen(true)}>
          New Project
        </Button>
      </Box>

      <Grid container spacing={3}>
        {typedProjects?.map((project: Project) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" noWrap>
                  {project.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {project.description || 'No description'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip label={`${project.members?.length || 0} members`} size="small" />
                  <Chip label={`${project.tasks?.length || 0} tasks`} size="small" />
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={`/project/${project.id}`}>
                  Open
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => {
                    setSelectedProjectId(project.id);
                    setDeleteModalOpen(true);
                  }}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <CreateProjectModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} />

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Project"
      />
    </Container>
  );
}
