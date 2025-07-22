import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, clusterApiUrl, Connection } from '@solana/web3.js';
import { NescrowClient, EscrowStatus } from 'nescrow';
import { useSnackbar } from 'notistack';

// Replace with your actual program ID when deploying to production
// For development, you can use a local program ID
const PROGRAM_ID = new PublicKey(
  process.env.REACT_APP_NESCROW_PROGRAM_ID || 'YOUR_PROGRAM_ID_HERE'
);

// Define the shape of our context
const NescrowContext = createContext(null);

/**
 * Custom hook to access the Nescrow context
 * @returns {Object} The Nescrow context
 */
export function useNescrow() {
  const context = useContext(NescrowContext);
  if (!context) {
    throw new Error('useNescrow must be used within a NescrowProvider');
  }
  return context;
}

/**
 * Provider component for Nescrow functionality
 */
export function NescrowProvider({ children }) {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const { enqueueSnackbar } = useSnackbar();
  
  // State
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');
  const [openEscrows, setOpenEscrows] = useState([]);
  const [myEscrows, setMyEscrows] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [error, setError] = useState(null);

  // Initialize the client
  useEffect(() => {
    try {
      // Use the provided connection or create a fallback for development
      const connectionToUse = connection || new Connection(
        process.env.REACT_APP_SOLANA_RPC_URL || clusterApiUrl('devnet'),
        'confirmed'
      );
      
      const nescrowClient = new NescrowClient(
        connectionToUse, 
        PROGRAM_ID,
        { 
          commitment: 'confirmed',
          preloadCounters: true 
        }
      );
      
      setClient(nescrowClient);
      setError(null);
    } catch (err) {
      console.error('Failed to initialize Nescrow client:', err);
      setError('Failed to initialize Nescrow client. Please check your connection and try again.');
      enqueueSnackbar('Failed to initialize Nescrow client', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [connection, enqueueSnackbar]);

  /**
   * Function to refresh data
   */
  const refreshData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  /**
   * Load open escrows
   */
  useEffect(() => {
    if (!client) return;

    const fetchOpenEscrows = async () => {
      try {
        setLoadingMessage('Loading open escrows...');
        setLoading(true);
        
        const escrows = await client.getOpenEscrows();
        
        // Sort escrows by expiry time (ascending)
        escrows.sort((a, b) => 
          Number(a.account.expiryTime - b.account.expiryTime)
        );
        
        setOpenEscrows(escrows);
        setError(null);
      } catch (error) {
        console.error('Error fetching open escrows:', error);
        setError('Failed to load open escrows. Please try again later.');
        enqueueSnackbar('Error loading open escrows', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchOpenEscrows();
  }, [client, refreshTrigger, enqueueSnackbar]);

  /**
   * Load my escrows when wallet is connected
   */
  useEffect(() => {
    if (!client || !connected || !publicKey) {
      setMyEscrows([]);
      return;
    }

    const fetchMyEscrows = async () => {
      try {
        setLoadingMessage('Loading your escrows...');
        setLoading(true);
        
        const escrows = await client.getEscrowsByCreator(publicKey);
        
        // Sort escrows by status and then by expiry time
        escrows.sort((a, b) => {
          // First sort by status (Open first, then Accepted, etc.)
          if (a.account.status !== b.account.status) {
            return a.account.status - b.account.status;
          }
          
          // Then sort by expiry time (ascending)
          return Number(a.account.expiryTime - b.account.expiryTime);
        });
        
        setMyEscrows(escrows);
        setError(null);
      } catch (error) {
        console.error('Error fetching my escrows:', error);
        setError('Failed to load your escrows. Please try again later.');
        enqueueSnackbar('Error loading your escrows', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchMyEscrows();
  }, [client, publicKey, connected, refreshTrigger, enqueueSnackbar]);

  /**
   * Get the status text for an escrow
   * @param {number} status - The escrow status code
   * @returns {string} The status text
   */
  const getStatusText = useCallback((status) => {
    switch (status) {
      case EscrowStatus.Open:
        return 'Open';
      case EscrowStatus.Accepted:
        return 'Accepted';
      case EscrowStatus.Completed:
        return 'Completed';
      case EscrowStatus.Cancelled:
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }, []);

  /**
   * Check if an escrow is expired
   * @param {Object} escrow - The escrow object
   * @returns {boolean} Whether the escrow is expired
   */
  const isEscrowExpired = useCallback((escrow) => {
    const now = Math.floor(Date.now() / 1000);
    return Number(escrow.expiryTime) < now;
  }, []);

  // Context value
  const value = {
    client,
    loading,
    loadingMessage,
    error,
    openEscrows,
    myEscrows,
    refreshData,
    getStatusText,
    isEscrowExpired,
    programId: PROGRAM_ID,
  };

  return (
    <NescrowContext.Provider value={value}>
      {children}
    </NescrowContext.Provider>
  );
}

export default NescrowContext;