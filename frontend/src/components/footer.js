import ThemeProvider from '@mui/material/styles/ThemeProvider';

import theme from '../themes/theme';
import {Box, Typography, IconButton} from '@mui/material';

import GitHubIcon from '@mui/icons-material/GitHub';


const Footer = () => (
  <ThemeProvider theme={theme}>
    <Box
      textAlign={'center'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: 'fit-content',
        width: '100%',
      }}>
      <IconButton
        variant={'outlined'}
        href={'https://github.com/rxfa'}
      >
        <GitHubIcon />
      </IconButton>
      <Typography
        variant={'subtitle1'}
        component={'h2'}
        color={'secondary.text'}
      >
          Made by Rxfa
      </Typography>
    </Box>
  </ThemeProvider>
);

export default Footer;