import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Grid, 
  Chip, 
  Divider, 
  Alert,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { 
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  MonetizationOn as MoneyIcon
} from '@mui/icons-material';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { format } from 'date-fns';
import { useNescrow } from '../contexts/NescrowContext';

// Status mapping
const statusMap = {
  0: { label: 'Open', color: 'success' },
  1: { label: 'Accepted', color: 'primary' },
  2: { label: 'Completed', color: 'default' },
  3: { label: 'Cancelled', color: 'error' }
};

function EscrowDetails() {
  const { escrowId } = useParams();
  const navigate = useNavigate();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { client, refreshData } = useNescrow();
  
  const [escrow, setEscrow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  
  // Dialog states
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [selectedWinner, setSelectedWinner] = useState('');
  
  // Fetch escrow details
  useEffect(() => {
    const fetchEscrow = async () => {
      try {
        setLoading(true);
        setError('');
        
        if (!escrowId) {
          setError('Invalid escrow ID');
          return;
        }
        
        const escrowPubkey = new PublicKey(escrowId);
        const escrowData = await client.getEscrow(escrowPubkey);
        
        if (!escrowData) {
          setError('Escrow not found');
          return;
        }
        
        setEscrow({
          pubkey: escrowPubkey,
          account: escrowData
        });
      } catch (err) {
        console.error('Error fetching escrow:', err);
        setError('Failed to load escrow details');
      } finally {
        setLoading(false);
      }
    };
    
    if (client) {
      fetchEscrow();
    }
  }, [client, escrowId]);
  
  // Check if user is the creator
  const isCreator = escrow && publicKey && escrow.account.creator.equals(publicKey);
  
  // Check if user is the taker
  const isTaker = escrow && publicKey && escrow.account.taker && escrow.account.taker.equals(publicKey);
  
  // Check if escrow is expired
  const isExpired = escrow && (new Date(Number(escrow.account.expiryTime) * 1000) < new Date());
  
  // Handle accept escrow
  const handleAcceptEscrow = async () => {
    if (!publicKey || !escrow) return;
    
    try {
      setActionLoading(true);
      setError('');
      
      // Get user's balance
      const balance = await connection.getBalance(publicKey);
      const amountLamports = Number(escrow.account.amount);
      
      if (balance < amountLamports) {
        setError(`Insufficient balance. You have ${balance / LAMPORTS_PER_SOL} SOL but need ${amountLamports / LAMPORTS_PER_SOL} SOL`);
        return;
      }
      
      // Create the accept escrow transaction
      const transaction = await client.acceptEscrowTransaction(
        escrow.account.creator,
        escrow.account.counter,
        publicKey
      );
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      setActionSuccess('Wager accepted successfully!');
      refreshData();
      
      // Reload escrow data
      const updatedEscrow = await client.getEscrow(escrow.pubkey);
      setEscrow({
        pubkey: escrow.pubkey,
        account: updatedEscrow
      });
      
    } catch (err) {
      console.error('Error accepting escrow:', err);
      setError(err.message || 'Failed to accept wager. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Handle cancel escrow
  const handleCancelEscrow = async () => {
    if (!publicKey || !escrow || !isCreator) return;
    
    try {
      setActionLoading(true);
      setError('');
      
      // Create the cancel escrow transaction
      const transaction = await client.cancelEscrowTransaction(
        publicKey,
        escrow.account.counter
      );
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      setActionSuccess('Wager cancelled successfully!');
      refreshData();
      
      // Reload escrow data
      const updatedEscrow = await client.getEscrow(escrow.pubkey);
      setEscrow({
        pubkey: escrow.pubkey,
        account: updatedEscrow
      });
      
    } catch (err) {
      console.error('Error cancelling escrow:', err);
      setError(err.message || 'Failed to cancel wager. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Handle complete escrow
  const handleCompleteEscrow = async () => {
    if (!publicKey || !escrow || (!isCreator && !isTaker)) return;
    
    if (!selectedWinner) {
      setError('Please select a winner');
      return;
    }
    
    try {
      setActionLoading(true);
      setError('');
      
      const winnerPubkey = new PublicKey(selectedWinner);
      
      // Create the complete escrow transaction
      const transaction = await client.completeEscrowTransaction(
        escrow.account.creator,
        escrow.account.counter,
        publicKey,
        winnerPubkey
      );
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      setActionSuccess('Wager completed successfully!');
      setCompleteDialogOpen(false);
      refreshData();
      
      // Reload escrow data
      const updatedEscrow = await client.getEscrow(escrow.pubkey);
      setEscrow({
        pubkey: escrow.pubkey,
        account: updatedEscrow
      });
      
    } catch (err) {
      console.error('Error completing escrow:', err);
      setError(err.message || 'Failed to complete wager. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };
  
  // Handle extend escrow
  const handleExtendEscrow = async () => {
    if (!publicKey || !escrow || !isCreator) return;
    
    try {
      setActionLoading(true);
      setError('');
      
      // Extend by 24 hours from now
      const newExpiryTime = BigInt(Math.floor(Date.now() / 1000) + (24 * 60 * 60));
      
      // Create the extend escrow transaction
      const transaction = await client.extendEscrowTransaction(
        publicKey,
        escrow.account.counter,
        newExpiryTime
      );
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      setActionSuccess('Wager expiry extended successfully!');
      refreshData();
      
      // Reload escrow data
      const updatedEscrow = await client.getEscrow(escrow.pubkey);
      setEscrow({
        pubkey: escrow.pubkey,
        account: updatedEscrow
      });
      
    } catch (err) {
      console.error('Error extending escrow:', err);
      setError(err.message || 'Failed to extend wager expiry. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error && !escrow) {
    return (
      <Alert severity="error" sx={{ mb: 4 }}>
        {error}
      </Alert>
    );
  }
  
  if (!escrow) {
    return (
      <Alert severity="error" sx={{ mb: 4 }}>
        Escrow not found
      </Alert>
    );
  }
  
  const { account } = escrow;
  const formattedAmount = (Number(account.amount) / LAMPORTS_PER_SOL).toFixed(2);
  const expiryDate = new Date(Number(account.expiryTime) * 1000);
  
  return (
    <Box>
      {/* Status bar */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 4, 
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'background.paper'
        }}
      >
        <Box>
          <Typography variant="h5" component="h1">
            Wager Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ID: {escrow.pubkey.toString()}
          </Typography>
        </Box>
        <Chip 
          label={statusMap[account.status].label} 
          color={statusMap[account.status].color} 
          size="medium" 
        />
      </Paper>
      
      {actionSuccess && (
        <Alert severity="success" sx={{ mb: 4 }}>
          {actionSuccess}
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {isExpired && account.status === 0 && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          This wager has expired and can no longer be accepted.
        </Alert>
      )}
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DescriptionIcon color="primary" /> Description
              </Typography>
              <Typography variant="body1" paragraph>
                {account.description}
              </Typography>
              
              <Divider sx={{ my: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MoneyIcon color="primary" />
                    <Typography variant="subtitle1">Amount</Typography>
                  </Box>
                  <Typography variant="h4" color="primary" sx={{ mt: 1 }}>
                    {formattedAmount} SOL
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimeIcon color="primary" />
                    <Typography variant="subtitle1">Expiry Time</Typography>
                  </Box>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {format(expiryDate, 'PPP p')}
                  </Typography>
                  <Typography variant="body2" color={isExpired ? "error" : "text.secondary"}>
                    {isExpired ? "Expired" : "Valid"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon color="primary" /> Participants
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Creator</Typography>
                  <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                    {account.creator.toString()}
                  </Typography>
                  {isCreator && (
                    <Chip label="You" size="small" color="primary" sx={{ mt: 1 }} />
                  )}
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1">Taker</Typography>
                  {account.taker ? (
                    <>
                      <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                        {account.taker.toString()}
                      </Typography>
                      {isTaker && (
                        <Chip label="You" size="small" color="primary" sx={{ mt: 1 }} />
                      )}
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Not yet accepted
                    </Typography>
                  )}
                </Grid>
                
                {account.status === 2 && account.winner && (
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle1">Winner</Typography>
                    <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                      {account.winner.toString()}
                    </Typography>
                    {publicKey && account.winner.equals(publicKey) && (
                      <Chip label="You" size="small" color="success" sx={{ mt: 1 }} />
                    )}
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Accept button - show if open and not creator and not expired */}
                {account.status === 0 && !isCreator && !isExpired && publicKey && (
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    fullWidth
                    loading={actionLoading}
                    onClick={handleAcceptEscrow}
                  >
                    Accept Wager
                  </LoadingButton>
                )}
                
                {/* Cancel button - show if open and is creator */}
                {account.status === 0 && isCreator && (
                  <LoadingButton
                    variant="outlined"
                    color="error"
                    fullWidth
                    loading={actionLoading}
                    onClick={handleCancelEscrow}
                  >
                    Cancel Wager
                  </LoadingButton>
                )}
                
                {/* Complete button - show if accepted and is creator or taker */}
                {account.status === 1 && (isCreator || isTaker) && (
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    fullWidth
                    loading={actionLoading}
                    onClick={() => setCompleteDialogOpen(true)}
                  >
                    Complete Wager
                  </LoadingButton>
                )}
                
                {/* Extend button - show if open and is creator */}
                {account.status === 0 && isCreator && (
                  <LoadingButton
                    variant="outlined"
                    color="primary"
                    fullWidth
                    loading={actionLoading}
                    onClick={handleExtendEscrow}
                  >
                    Extend Expiry (24h)
                  </LoadingButton>
                )}
                
                {/* Back button */}
                <Button
                  variant="text"
                  onClick={() => navigate(-1)}
                  disabled={actionLoading}
                >
                  Go Back
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Complete Dialog */}
      <Dialog open={completeDialogOpen} onClose={() => setCompleteDialogOpen(false)}>
        <DialogTitle>Complete Wager</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select the winner of this wager. This action will transfer the funds to the winner and cannot be undone.
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Winner</InputLabel>
            <Select
              value={selectedWinner}
              label="Winner"
              onChange={(e) => setSelectedWinner(e.target.value)}
            >
              <MenuItem value={account.creator.toString()}>
                Creator {isCreator ? '(You)' : ''}
              </MenuItem>
              {account.taker && (
                <MenuItem value={account.taker.toString()}>
                  Taker {isTaker ? '(You)' : ''}
                </MenuItem>
              )}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCompleteDialogOpen(false)}>Cancel</Button>
          <LoadingButton 
            onClick={handleCompleteEscrow} 
            loading={actionLoading}
            variant="contained"
            disabled={!selectedWinner}
          >
            Complete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default EscrowDetails;