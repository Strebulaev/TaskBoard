import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  CardActionArea,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { TaskForm } from '@components/TaskForm';
import { useTaskStore } from '@store/taskStore';
import { useProjectStore } from '@store/projectStore';
import { format } from 'date-fns';

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
  project?: {
    id: string;
    title: string;
  };
  projectId: string;
}

export default function TasksList() {
  const navigate = useNavigate();
  const { tasks, isLoading, error, fetchTasks, fetchTasksByProject } = useTaskStore();
  const { projects, fetchProjects } = useProjectStore();
  const [openForm, setOpenForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task: Task) => {
      if (selectedProject && task.projectId !== selectedProject) return false;
      if (statusFilter && task.status !== statusFilter) return false;
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [tasks, selectedProject, statusFilter, searchQuery]);

  const handleFetchTasks = useCallback(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleFetchProjects = useCallback(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleFetchTasksByProject = useCallback(
    (projectId: string) => {
      fetchTasksByProject(projectId);
    },
    [fetchTasksByProject]
  );

  useEffect(() => {
    handleFetchTasks();
    handleFetchProjects();
  }, [handleFetchTasks, handleFetchProjects]);

  useEffect(() => {
    if (selectedProject) {
      handleFetchTasksByProject(selectedProject);
    } else {
      handleFetchTasks();
    }
  }, [selectedProject, handleFetchTasksByProject, handleFetchTasks]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'warning' | 'info' | 'success'> = {
      todo: 'default',
      in_progress: 'warning',
      review: 'info',
      done: 'success',
    };
    return colors[status] || 'default';
  };

  const handleCardClick = (taskId: string) => {
    navigate(`/task/${taskId}`);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Tasks</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenForm(true)}>
          New Task
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Project</InputLabel>
          <Select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            label="Project"
          >
            <MenuItem value="">All Projects</MenuItem>
            {projects.map((project: Project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Status"
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="todo">To Do</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="review">Review</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ minWidth: 200 }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {filteredTasks.length === 0 ? (
          <Grid size={12}>
            <Typography variant="body1" color="textSecondary" align="center">
              No tasks found
            </Typography>
          </Grid>
        ) : (
          filteredTasks.map((task: Task) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={task.id}>
              <Card>
                <CardActionArea onClick={() => handleCardClick(task.id)}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {task.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                      {task.description || 'No description'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip
                        label={task.status.replace('_', ' ')}
                        color={getStatusColor(task.status)}
                        size="small"
                      />
                      {task.deadline && (
                        <Chip
                          label={`Due: ${format(new Date(task.deadline), 'dd.MM.yyyy')}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                    <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                      Project: {task.project?.title || 'N/A'}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      <TaskForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSuccess={() => {
          if (selectedProject) {
            handleFetchTasksByProject(selectedProject);
          } else {
            handleFetchTasks();
          }
        }}
        projectId={selectedProject || undefined}
      />
    </Container>
  );
}
