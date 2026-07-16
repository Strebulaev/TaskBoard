import { Chip } from '@mui/material';
import type { ChipProps } from '@mui/material/Chip';

const statusColors: Record<string, ChipProps['color']> = {
  todo: 'default',
  in_progress: 'primary',
  review: 'warning',
  done: 'success',
  overdue: 'error',
};

const statusLabels: Record<string, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
  overdue: 'Overdue',
};

export function StatusChip({ status }: { status: string }) {
  return (
    <Chip
      label={statusLabels[status] || status}
      color={statusColors[status] || 'default'}
      size="small"
    />
  );
}
