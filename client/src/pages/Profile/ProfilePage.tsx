import { useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Avatar, Button, TextField, Paper } from '@mui/material';
import { Edit, Save, Cancel, Delete, PhotoCamera } from '@mui/icons-material';
import { useQueryClient } from '@tanstack/react-query';
import { useUser } from '@hooks/useUser';
import {
  useUser as useUserQuery,
  useUpdateUser,
  useUploadAvatar,
  useDeleteAvatar,
} from '@hooks/queries/useUsers';
import { LoadingSpinner } from '@components/common/LoadingSpinner';
import { useUserStore } from '@store/userStore';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  description?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const userId = id || '';
  const queryClient = useQueryClient();

  const { user: currentUser, isLoading: isUserLoading } = useUser();
  const {
    data: profile,
    isLoading: isProfileLoading,
    error,
  } = useUserQuery(userId) as {
    data: UserProfile | undefined;
    isLoading: boolean;
    error: unknown;
  };

  const { updateUser } = useUserStore();
  const updateUserMutation = useUpdateUser();
  const uploadAvatar = useUploadAvatar();
  const deleteAvatar = useDeleteAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const isOwnProfile = currentUser?.id === userId;

  if (isUserLoading || isProfileLoading) return <LoadingSpinner />;
  if (!userId) return <Typography>User ID not found</Typography>;
  if (error) return <Typography color="error">Error loading profile</Typography>;
  if (!profile) return <Typography>User not found</Typography>;

  const handleSave = async () => {
    if (!userId) return;
    await updateUserMutation.mutateAsync({ id: userId, data: { name, description } });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (profile) {
      setName(profile.name);
      setDescription(profile.description || '');
    }
    setIsEditing(false);
  };

  const handleEdit = () => {
    setName(profile.name);
    setDescription(profile.description || '');
    setIsEditing(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && userId) {
      await uploadAvatar.mutateAsync({ id: userId, file });
    }
  };

  const handleDeleteAvatar = async () => {
    if (userId && window.confirm('Delete avatar?')) {
      const updatedUser = await deleteAvatar.mutateAsync(userId);
      // Обновляем стор
      updateUser({ avatarUrl: undefined });
      // Обновляем React Query кеш
      queryClient.setQueryData(['users', userId], updatedUser);
    }
  };

  if (isEditing && isOwnProfile) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Avatar
            src={profile.avatarUrl ? `http://localhost:3000${profile.avatarUrl}` : undefined}
            sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Button
              variant="outlined"
              startIcon={<PhotoCamera />}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadAvatar.isPending}
            >
              Upload
            </Button>
            {profile.avatarUrl && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleDeleteAvatar}
                disabled={deleteAvatar.isPending}
              >
                Delete
              </Button>
            )}
          </Box>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
          />
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" startIcon={<Cancel />} onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSave}
              disabled={updateUserMutation.isPending}
            >
              Save
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
            src={profile.avatarUrl ? `http://localhost:3000${profile.avatarUrl}` : undefined}
            sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
          />
        </Box>
        <Typography variant="h5">{profile.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {profile.description || 'No description'}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Joined: {new Date(profile.createdAt).toLocaleDateString()}
        </Typography>
        {isOwnProfile && !isEditing && (
          <Button variant="outlined" startIcon={<Edit />} onClick={handleEdit} sx={{ mt: 2 }}>
            Edit Profile
          </Button>
        )}
      </Paper>
    </Container>
  );
}
