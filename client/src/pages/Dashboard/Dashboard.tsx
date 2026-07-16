import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { useProjects } from '@hooks/queries/useProjects';
import { useDashboardStats, useUpcomingTasks } from '@hooks/queries/useDashboard';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { StatusChip } from '@components/common/StatusChip';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { Project } from '@/types/project';
import type { Task } from '@/types/task';
import type { DashboardStats } from '@/types/dashboard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: stats, isLoading: statsLoading } = useDashboardStats(
    selectedProjectId === 'all' ? undefined : selectedProjectId
  );
  const { data: todayTasks } = useUpcomingTasks(
    selectedProjectId === 'all' ? undefined : selectedProjectId,
    1
  );
  const { data: tomorrowTasks } = useUpcomingTasks(
    selectedProjectId === 'all' ? undefined : selectedProjectId,
    2
  );

  const isLoading = projectsLoading || statsLoading;

  const handleProjectChange = (e: SelectChangeEvent) => {
    setSelectedProjectId(e.target.value);
  };

  if (isLoading) return <LoadingSpinner />;

  const typedStats = stats as DashboardStats | undefined;
  const typedTodayTasks = todayTasks as Task[] | undefined;
  const typedTomorrowTasks = tomorrowTasks as Task[] | undefined;

  const chartData = {
    labels: typedStats?.chartData?.map((d) => d.date) || [],
    datasets: [
      {
        label: 'All Tasks',
        data: typedStats?.chartData?.map((d) => d.all) || [],
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        fill: true,
      },
      {
        label: 'Done',
        data: typedStats?.chartData?.map((d) => d.done) || [],
        borderColor: '#2e7d32',
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        fill: true,
      },
      {
        label: 'Overdue',
        data: typedStats?.chartData?.map((d) => d.overdue) || [],
        borderColor: '#d32f2f',
        backgroundColor: 'rgba(211, 47, 47, 0.1)',
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Tasks Overview',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Tasks',
        },
      },
    },
  };

  const statusColors: Record<string, string> = {
    todo: '#9e9e9e',
    in_progress: '#1976d2',
    review: '#ed6c02',
    done: '#2e7d32',
    overdue: '#d32f2f',
  };

  const statusLabels: Record<string, string> = {
    todo: 'To Do',
    in_progress: 'In Progress',
    review: 'Review',
    done: 'Done',
    overdue: 'Overdue',
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Dashboard</Typography>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Project</InputLabel>
          <Select value={selectedProjectId} onChange={handleProjectChange} label="Project">
            <MenuItem value="all">All Projects</MenuItem>
            {projects?.map((p: Project) => (
              <MenuItem key={p.id} value={p.id}>
                {p.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Total Tasks
              </Typography>
              <Typography variant="h4">{typedStats?.total || 0}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {['todo', 'in_progress', 'review', 'done', 'overdue'].map((status) => (
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }} key={status}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {statusLabels[status] || status}
                </Typography>
                <Typography variant="h4" sx={{ color: statusColors[status] }}>
                  {typedStats?.statusCounts?.[status as keyof typeof typedStats.statusCounts] || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            {typedStats?.chartData && typedStats.chartData.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <Typography color="text.secondary">No data available</Typography>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Today
            </Typography>
            {!typedTodayTasks || typedTodayTasks.length === 0 ? (
              <Typography color="text.secondary">No tasks due today</Typography>
            ) : (
              <List dense>
                {typedTodayTasks.map((task: Task) => (
                  <ListItem
                    key={task.id}
                    component={Link}
                    to={`/task/${task.id}`}
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover': { bgcolor: 'action.hover' },
                      borderRadius: 1,
                    }}
                  >
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <StatusChip status={task.status} />
                          <Chip label={task.project?.title} size="small" />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Tomorrow
            </Typography>
            {!typedTomorrowTasks || typedTomorrowTasks.length === 0 ? (
              <Typography color="text.secondary">No tasks due tomorrow</Typography>
            ) : (
              <List dense>
                {typedTomorrowTasks.map((task: Task) => (
                  <ListItem
                    key={task.id}
                    component={Link}
                    to={`/task/${task.id}`}
                    sx={{
                      textDecoration: 'none',
                      color: 'inherit',
                      '&:hover': { bgcolor: 'action.hover' },
                      borderRadius: 1,
                    }}
                  >
                    <ListItemText
                      primary={task.title}
                      secondary={
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          <StatusChip status={task.status} />
                          <Chip label={task.project?.title} size="small" />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
