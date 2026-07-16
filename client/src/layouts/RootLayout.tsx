import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useThemeStore } from '@store/themeStore';
import { useUser } from '@hooks/useUser';
import { logout } from '@api/auth';

export function RootLayout() {
  const { theme, toggleTheme } = useThemeStore();
  const { user, isLoading } = useUser();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              TaskBoard
            </Link>
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none' }}>
              Dashboard
            </Link>
            <Link to="/tasks-list" style={{ color: 'inherit', textDecoration: 'none' }}>
              Tasks
            </Link>
            <Link to="/projects" style={{ color: 'inherit', textDecoration: 'none' }}>
              Projects
            </Link>
            <IconButton color="inherit" onClick={toggleTheme}>
              {theme === 'light' ? <Brightness4 /> : <Brightness7 />}
            </IconButton>
            {isLoading ? (
              <Typography variant="body2">Loading...</Typography>
            ) : user ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  src={user.avatarUrl}
                  alt={user.name}
                  sx={{ width: 32, height: 32, cursor: 'pointer' }}
                  onClick={handleMenuOpen}
                >
                  {user.name[0]}
                </Avatar>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem component={Link} to={`/profile-${user.id}`}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
