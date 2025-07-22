import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Button,
  CardActions,
  Tooltip,
  alpha,
  useTheme
} from '@mui/material';
import { 
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  MonetizationOn as MoneyIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

// Status mapping
const statusMap = {
  0: { label: 'Open', color: 'success', icon: '🟢' },
  1: { label: 'Accepted', color: 'primary', icon: '🟣' },
  2: { label: 'Completed', color: 'default', icon: '✅' },
  3: { label: 'Cancelled', color: 'error', icon: '❌' }
};

function EscrowCard({ escrow, pubkey }) {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Format the amount in SOL
  const formattedAmount = (Number(escrow.amount) / LAMPORTS_PER_SOL).toFixed(2);
  
  // Format the expiry time
  const expiryDate = new Date(Number(escrow.expiryTime) * 1000);
  const isExpired = expiryDate < new Date();
  const expiryFormatted = formatDistanceToNow(expiryDate, { addSuffix: true });
  
  // Truncate description if too long
  const truncatedDescription = escrow.description.length > 100 
    ? `${escrow.description.substring(0, 100)}...` 
    : escrow.description;
  
  // Handle view details click
  const handleViewDetails = () => {
    navigate(`/escrow/${pubkey.toString()}`);
  };
  
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.3)',
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 2.5,
          pb: 2,
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}>
          <Chip 
            label={statusMap[escrow.status].label} 
            color={statusMap[escrow.status].color} 
            size="small"
            icon={<Box component="span">{statusMap[escrow.status].icon}</Box>}
            sx={{ 
              fontWeight: 600,
              pl: 0.5
            }}
          />
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              fontWeight: 'bold',
              color: theme.palette.secondary.main
            }}
          >
            {formattedAmount} <small>SOL</small>
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 1.5,
          color: 'text.secondary'
        }}>
          <PersonIcon fontSize="small" sx={{ mr: 1, color: theme.palette.primary.light }} />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {escrow.creator.toString().slice(0, 4)}...{escrow.creator.toString().slice(-4)}
          </Typography>
        </Box>
        
        {escrow.taker && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 1.5,
            color: 'text.secondary'
          }}>
            <PersonIcon fontSize="small" sx={{ mr: 1, color: theme.palette.secondary.light }} />
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {escrow.taker.toString().slice(0, 4)}...{escrow.taker.toString().slice(-4)}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ 
          display: 'flex', 
          mb: 2,
          mt: 2.5
        }}>
          <DescriptionIcon 
            fontSize="small" 
            sx={{ 
              mr: 1, 
              mt: 0.3,
              color: theme.palette.primary.light 
            }} 
          />
          <Typography variant="body1" sx={{ lineHeight: 1.5 }}>
            {truncatedDescription}
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mt: 'auto',
          pt: 2,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`
        }}>
          <Tooltip title={expiryDate.toLocaleString()}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: isExpired ? theme.palette.error.main : 'text.secondary'
            }}>
              <TimeIcon fontSize="small" sx={{ mr: 1 }} />
              <Typography 
                variant="body2" 
                sx={{ fontWeight: 500 }}
              >
                {isExpired ? "Expired " : "Expires "} 
                {expiryFormatted}
              </Typography>
            </Box>
          </Tooltip>
        </Box>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          variant="contained" 
          color="primary" 
          fullWidth
          onClick={handleViewDetails}
          endIcon={<ArrowForwardIcon />}
          sx={{ 
            mt: 1,
            py: 1
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}

export default EscrowCard;