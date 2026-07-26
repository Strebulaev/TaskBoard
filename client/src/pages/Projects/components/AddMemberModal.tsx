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
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
  Typography,
  Box,
} from '@mui/material';
import { useAddProjectMember } from '@hooks/queries/useProjects';
import { usersApi } from '@api/users';
import { useDebounce } from '@hooks/useDebounce';
import type { User } from '@/types/user';

interface AddMemberModalProps {
  open: boolean;
  onClose: () => void;
  projectId: string;
}

export function AddMemberModal({ open, onClose, projectId }: AddMemberModalProps) {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [role, setRole] = useState('member');
  const [isSearching, setIsSearching] = useState(false);

  const addMember = useAddProjectMember();
  const debouncedSearch = useDebounce(search, 300);

  const handleClose = useCallback(() => {
    setSearch('');
    setUsers([]);
    setSelectedUserId('');
    setRole('member');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open || debouncedSearch.length < 2) return;

    let cancelled = false;

    Promise.resolve().then(async () => {
      if (cancelled) return;
      setIsSearching(true);
      try {
        const results = await usersApi.search(debouncedSearch);
        if (!cancelled) {
          setUsers(results);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [open, debouncedSearch]);

  const handleAdd = useCallback(async () => {
    if (!selectedUserId) return;
    await addMember.mutateAsync({
      projectId,
      userId: selectedUserId,
      role,
    });
    handleClose();
  }, [addMember, projectId, selectedUserId, role, handleClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Member</DialogTitle>
      <DialogContent>
        <TextField
          label="Search by email or name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          autoFocus
          sx={{ mt: 1 }}
        />
        {isSearching && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        {!isSearching && users.length > 0 && (
          <List>
            {users.map((user) => (
              <ListItem
                key={user.id}
                button
                selected={selectedUserId === user.id}
                onClick={() => setSelectedUserId(user.id)}
              >
                <ListItemAvatar>
                  <Avatar>{user.name[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.name} secondary={user.email} />
              </ListItem>
            ))}
          </List>
        )}
        {!isSearching && debouncedSearch.length >= 2 && users.length === 0 && (
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            No users found
          </Typography>
        )}
        {selectedUserId && (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value)} label="Role">
              <MenuItem value="member">Member</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="owner">Owner</MenuItem>
            </Select>
          </FormControl>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          disabled={!selectedUserId || addMember.isPending}
        >
          {addMember.isPending ? 'Adding...' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
