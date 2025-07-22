import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent,
  Grid,
  InputAdornment,
  Alert,
  Slider,
  FormHelperText,
  CircularProgress
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, Keypair } from '@solana/web3.js';
import { useNescrow } from '../contexts/NescrowContext';

function CreateEscrow() {
  const navigate = useNavigate();
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const { client, refreshData } = useNescrow();
  
  const [amount, setAmount] = useState(0.1);
  const [description, setDescription] = useState('');
  const [expiryHours, setExpiryHours] = useState(24);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Calculate expiry time in seconds since epoch
  const calculateExpiryTime = () => {
    const now = Math.floor(Date.now() / 1000);
    return now + (expiryHours * 60 * 60);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!publicKey) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }
    
    if (!description) {
      setError('Please provide a description');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // Get user's balance
      const balance = await connection.getBalance(publicKey);
      const amountLamports = amount * LAMPORTS_PER_SOL;
      
      if (balance < amountLamports) {
        setError(`Insufficient balance. You have ${balance / LAMPORTS_PER_SOL} SOL but need ${amount} SOL`);
        return;
      }
      
      // Create the escrow transaction
      const expiryTime = calculateExpiryTime();
      const counter = BigInt(Math.floor(Math.random() * 1000000)); // Simple counter for demo
      
      const instruction = client.createEscrow({
        feePayer: publicKey,
        creator: publicKey,
        counter,
        amount: BigInt(Math.floor(amountLamports)),
        description,
        expiryTime: BigInt(expiryTime)
      });
      
      // Create and send transaction
      const transaction = await client.createEscrowTransaction(
        publicKey,
        counter,
        BigInt(Math.floor(amountLamports)),
        description,
        BigInt(expiryTime)
      );
      
      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, 'confirmed');
      
      setSuccess(true);
      refreshData();
      
      // Navigate to my escrows after a short delay
      setTimeout(() => {
        navigate('/my-escrows');
      }, 2000);
      
    } catch (err) {
      console.error('Error creating escrow:', err);
      setError(err.message || 'Failed to create escrow. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Create a Wager
      </Typography>
      
      <Typography variant="body1" paragraph color="text.secondary">
        Create a new wager by specifying the amount, description, and expiry time.
      </Typography>
      
      {!publicKey && (
        <Alert severity="info" sx={{ mb: 4 }}>
          Please connect your wallet to create a wager.
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          Wager created successfully! Redirecting to My Wagers...
        </Alert>
      )}
      
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Amount (SOL)"
                  type="number"
                  fullWidth
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">◎</InputAdornment>,
                    inputProps: { min: 0.001, step: 0.001 }
                  }}
                  disabled={loading || success}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  fullWidth
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the terms of the wager..."
                  disabled={loading || success}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography gutterBottom>
                  Expiry Time: {expiryHours} hours
                </Typography>
                <Slider
                  value={expiryHours}
                  onChange={(e, newValue) => setExpiryHours(newValue)}
                  min={1}
                  max={168} // 1 week
                  step={1}
                  marks={[
                    { value: 1, label: '1h' },
                    { value: 24, label: '1d' },
                    { value: 72, label: '3d' },
                    { value: 168, label: '1w' }
                  ]}
                  disabled={loading || success}
                />
                <FormHelperText>
                  The wager will expire if not accepted within this time period.
                </FormHelperText>
              </Grid>
              
              <Grid item xs={12}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  loading={loading}
                  disabled={!publicKey || success}
                >
                  Create Wager
                </LoadingButton>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      
      <Box sx={{ textAlign: 'center' }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate(-1)}
          disabled={loading}
        >
          Go Back
        </Button>
      </Box>
    </Box>
  );
}

export default CreateEscrow;