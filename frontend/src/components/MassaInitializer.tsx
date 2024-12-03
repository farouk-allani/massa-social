import { ReactNode, useEffect } from "react";
import { setProvider, setProviders } from "../redux/slices/accountSlice";
import { AppDispatch } from "../redux/store";
import { useDispatch } from "react-redux";
import { IProvider, providers } from "@massalabs/wallet-provider";

const MassaInitializer: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();

  async function initAccountStore() {
    const massaProviders = await providers();

    dispatch(setProviders(massaProviders));

    massaProviders.map(async (p: IProvider) => {
      if (localStorage.getItem("provider") === p.name()) {
        dispatch(setProvider(p));
      }
    });
  }

  useEffect(() => {
    initAccountStore();
  }, []);

  return <>{children}</>;
};

export default MassaInitializer;
