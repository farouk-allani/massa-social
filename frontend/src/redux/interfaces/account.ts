import { IAccount, IProvider } from "@massalabs/wallet-provider";
import { Client } from "@massalabs/massa-web3";
import { SUPPORTED_MASSA_WALLETS } from "../../constants";

export interface AccountStoreState {
  connectedAccount?: IAccount;
  massaClient?: Client;
  accounts?: IAccount[];
  currentProvider?: IProvider;
  providers: IProvider[];
  isFetching: boolean;
  accountObserver?: {
    unsubscribe: () => void;
  };
  networkObserver?: {
    unsubscribe: () => void;
  };
  chainId?: string;
  selectedProvider?: SUPPORTED_MASSA_WALLETS | undefined;
}
