import {
  createAsyncThunk,
  createSlice,
  current,
  PayloadAction,
} from "@reduxjs/toolkit";
import { AccountStoreState } from "../interfaces/account";
import { Client, ClientFactory } from "@massalabs/massa-web3";
import { IAccount, IProvider } from "@massalabs/wallet-provider";
import { toast } from "react-toastify";
import { SUPPORTED_MASSA_WALLETS } from "../../constants";

const initialState: AccountStoreState = {
  accounts: undefined,
  connectedAccount: undefined,
  accountObserver: undefined,
  networkObserver: undefined,
  massaClient: undefined,
  currentProvider: undefined,
  providers: [],
  isFetching: false,
  chainId: undefined,
  selectedProvider: undefined,
};

// Async thunk for refreshing Massa client
export const refreshMassaClient = createAsyncThunk(
  "account/refreshMassaClient",
  async (_, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as { account: AccountStoreState };
    const { currentProvider, connectedAccount } = state.account;

    if (!currentProvider || !connectedAccount) {
      return rejectWithValue("No provider or connected account found");
    }
    const massaClient = await ClientFactory.fromWalletProvider(
      currentProvider,
      connectedAccount
    );
    dispatch(setMassaClient(massaClient));
    return massaClient;
  }
);

// Async thunk for setting the current provider
export const setProvider = createAsyncThunk(
  "account/setProvider",
  async (provider: IProvider | undefined, { dispatch, getState }) => {
    const state = getState() as { account: AccountStoreState };

    if (state.account.currentProvider?.name() !== provider?.name()) {
      state.account.accountObserver?.unsubscribe();
      state.account.networkObserver?.unsubscribe();
      dispatch(
        setObservers({ accountObserver: undefined, networkObserver: undefined })
      );
    }

    if (!provider) {
      dispatch(setCurrentProvider(undefined));
      dispatch(setConnectedAccount(undefined));
      localStorage.removeItem("provider");
      localStorage.removeItem("massastation_account");
      localStorage.removeItem("bearby_account");
      dispatch(setMassaClient(undefined));
      dispatch(setSelectedProvider(undefined));
      dispatch(setAccounts([]));
      return;
    }

    // Set current provider before any further actions
    await dispatch(setCurrentProvider(provider));

    // Bearby wallet logic
    if (provider.name() === SUPPORTED_MASSA_WALLETS.BEARBY) {
      try {
        await provider.connect();
        const accounts = await provider.accounts();
        const newAccount = accounts[0];
        dispatch(setConnectedAccount(newAccount));

        const accountObserver = provider.listenAccountChanges(
          (newAddress: string) => {
            const currentState = getState() as { account: AccountStoreState };
            handleBearbyAccountChange(
              newAddress,
              currentState.account,
              dispatch
            );
          }
        );

        const networkObserver = provider.listenNetworkChanges(async () => {
          await dispatch(refreshMassaClient());
        });

        dispatch(setAccounts(accounts));
        dispatch(setObservers({ accountObserver, networkObserver }));
        localStorage.setItem("provider", provider.name());
      } catch (error) {
        console.error("Error connecting to Bearby wallet:", error);
        toast.error(`check your Bearby wallet!`);
      }
    } else {
      // Massastation wallet logic
      const accounts = await provider.accounts();
      console.log("accounts", accounts);
      dispatch(setAccounts(accounts));
      const massastationAccount = localStorage.getItem("massastation_account");

      if (!massastationAccount) {
        dispatch(setConnectedAccount(accounts[0]));
        localStorage.setItem("massastation_account", accounts[0].address());
        localStorage.setItem("provider", provider.name());
        return;
      }
      const selectedIndex = accounts.findIndex(
        (account) => account.address() === massastationAccount
      );

      const selectedAccount = accounts[selectedIndex];
      console.log("Selected Account:", selectedAccount);

      dispatch(setConnectedAccount(selectedAccount));

      // Refresh Massa Client after setting accounts and connected account
      await dispatch(refreshMassaClient());

      localStorage.setItem(
        "massastation_account",
        accounts[selectedIndex].address()
      );
      localStorage.setItem("provider", provider.name());
    }
  }
);

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setProviders: (state, action: PayloadAction<IProvider[]>) => {
      state.providers = action.payload;
      if (
        !state.providers.some((p) => p.name() === state.currentProvider?.name())
      ) {
        state.massaClient = undefined;
        state.currentProvider = undefined;
        state.connectedAccount = undefined;
        state.accounts = undefined;
      }
    },
    setCurrentProvider: (
      state,
      action: PayloadAction<IProvider | undefined>
    ) => {
      state.currentProvider = action.payload;
      state.isFetching = false;
    },
    setConnectedAccount: (
      state,
      action: PayloadAction<IAccount | undefined>
    ) => {
      state.connectedAccount = action.payload;
    },
    setMassaClient: (state, action: PayloadAction<Client | undefined>) => {
      // console.log('set massa client')
      state.massaClient = action.payload;
    },
    setAccounts: (state, action: PayloadAction<IAccount[]>) => {
      state.accounts = action.payload;
    },
    setChainId: (state, action: PayloadAction<string>) => {
      state.chainId = action.payload;
    },
    setSelectedProvider: (
      state,
      action: PayloadAction<SUPPORTED_MASSA_WALLETS | undefined>
    ) => {
      state.selectedProvider = action.payload;
    },
    setObservers: (
      state,
      action: PayloadAction<{
        accountObserver?: { unsubscribe: () => void };
        networkObserver?: { unsubscribe: () => void };
      }>
    ) => {
      state.accountObserver = action.payload.accountObserver;
      state.networkObserver = action.payload.networkObserver;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(refreshMassaClient.fulfilled, (state, action) => {
      state.massaClient = action.payload;
    });
    builder.addCase(setProvider.pending, (state) => {
      state.isFetching = true;
    });
    builder.addCase(setProvider.fulfilled, (state) => {
      state.isFetching = false;
    });
    builder.addCase(setProvider.rejected, (state) => {
      state.isFetching = false;
    });
  },
});

export const {
  setProviders,
  setCurrentProvider,
  setConnectedAccount,
  setMassaClient,
  setAccounts,
  setChainId,
  setSelectedProvider,
  setObservers,
} = accountSlice.actions;

export default accountSlice.reducer;

// Function to handle Bearby account change
async function handleBearbyAccountChange(
  newAddress: string,
  state: AccountStoreState,
  dispatch: any
) {
  const { connectedAccount, currentProvider } = state;
  const oldAddress = connectedAccount?.address();

  if (newAddress !== oldAddress) {
    const newAccounts = await currentProvider?.accounts();
    if (newAccounts?.length) {
      const newAccount = newAccounts[0];
      dispatch(setConnectedAccount(newAccount));
    }
  }
}
