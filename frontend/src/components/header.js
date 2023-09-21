import { ThemeProvider } from "@emotion/react";

import theme from "../themes/theme";
import {Box, Button, Typography, IconButton, AppBar, Toolbar, Icon} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Header = () => (
    <ThemeProvider theme={theme}>
        <Box sx={{ }}>
            <AppBar>
                <Toolbar>
                    <IconButton size="large" edge="start" aria-label="menu" sx={{mr: 2 }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h5" component="div" sx={{flexGrow: 1 }}>Home</Typography>
                    <Button color="inherit">Logout</Button>
                </Toolbar>
            </AppBar>
        </Box>
    </ThemeProvider>
);

export default Header;