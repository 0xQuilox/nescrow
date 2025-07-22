import React, { useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  ConnectionProvider, 
  WalletProvider 
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  BackpackWalletAdapter,
  CoinbaseWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';

// Import components
import Layout from './components/Layout';
import Home from './pages/Home';
import CreateEscrow from './pages/CreateEscrow';
import MyEscrows from './pages/MyEscrows';
import EscrowDetails from './pages/EscrowDetails';
import OpenEscrows from './pages/OpenEscrows';

// Import wallet adapter CSS
import '@solana/wallet-adapter-react-ui/styles.css';

// Create theme with gold and purple colors
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9c27b0', // Deep purple
      light: '#bb86fc',
      dark: '#6a0080',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffc107', // Gold
      light: '#ffecb3',
      dark: '#c79100',
      contrastText: '#000000',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    divider: 'rgba(255, 193, 7, 0.12)',
    error: {
      main: '#f44336',
    },
    success: {
      main: '#4caf50',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      'Roboto',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
          boxShadow: '0 4px 14px 0 rgba(156, 39, 176, 0.2)',
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #9c27b0 30%, #bb86fc 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #6a0080 30%, #9c27b0 90%)',
          },
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #ffc107 30%, #ffecb3 90%)',
          color: '#000000',
          '&:hover': {
            background: 'linear-gradient(45deg, #c79100 30%, #ffc107 90%)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
        outlinedPrimary: {
          borderColor: '#9c27b0',
          '&:hover': {
            borderColor: '#bb86fc',
          },
        },
        outlinedSecondary: {
          borderColor: '#ffc107',
          '&:hover': {
            borderColor: '#ffecb3',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(156, 39, 176, 0.1)',
          background: 'linear-gradient(145deg, #1e1e1e 0%, #2a2a2a 100%)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: 'linear-gradient(90deg, #9c27b0, #ffc107)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(30, 30, 30, 0.8)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
        colorPrimary: {
          background: 'linear-gradient(45deg, #9c27b0 30%, #bb86fc 90%)',
        },
        colorSecondary: {
          background: 'linear-gradient(45deg, #ffc107 30%, #ffecb3 90%)',
          color: '#000000',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&.Mui-focused fieldset': {
              borderColor: '#9c27b0',
              borderWidth: 2,
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          minWidth: 100,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: 3,
          background: 'linear-gradient(90deg, #9c27b0, #ffc107)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 193, 7, 0.12)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

function App() {
  // Set up Solana network and wallet
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new BackpackWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    []
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<CreateEscrow />} />
                <Route path="/my-escrows" element={<MyEscrows />} />
                <Route path="/open-escrows" element={<OpenEscrows />} />
                <Route path="/escrow/:escrowId" element={<EscrowDetails />} />
              </Routes>
            </Layout>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
}

export default App;