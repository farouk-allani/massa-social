import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  Args,
  SmartContract,
  DeserializedResult,
  Serializable,
  OperationStatus,
} from "@massalabs/massa-web3";

export class Profile implements Serializable<Profile> {
  constructor(
    public address: string = "",
    public name: string = "",
    public avatar: string = "",
    public bio: string = ""
  ) {}

  serialize(): Uint8Array {
    const args = new Args()
      .addString(this.address)
      .addString(this.name)
      .addString(this.avatar)
      .addString(this.bio);

    return new Uint8Array(args.serialize());
  }

  deserialize(data: Uint8Array, offset: number): DeserializedResult<Profile> {
    const args = new Args(data, offset);

    this.address = args.nextString();
    this.name = args.nextString();
    this.avatar = args.nextString();
    this.bio = args.nextString();

    return { instance: this, offset: args.getOffset() };
  }
}

export interface ProfileType {
  firstName: string;
  lastName: string;
  // location: string;
  // occupation: string;
  // address: Address;
  address: string;
  name: string;
  avatar: string;
  bio: string;
}
interface UserState {
  mode: "light" | "dark";
  user: Profile | null;
}

const initialState: UserState = {
  mode: "light",
  user: null,
};

export const checkUserProfile = createAsyncThunk<
  Profile | null,
  void,
  { state: RootState }
>("user/checkUserProfile", async (_, { getState }) => {
  const state = getState();
  const { currentWallet, connectedAccount } = state.account;
  if (!currentWallet || !connectedAccount) {
    return null;
  }

  // const walletList = await getWallets();
  // const wallet = walletList.find((provider) => provider.name() === "BEARBY");
  // const accounts = await wallet?.accounts();
  // if (!accounts || accounts.length === 0) {
  //   console.error("No accounts found");
  //   return null;
  // }
  // const provider = accounts[0];

  // console.log("current provider", currentWallet);
  // console.log("connected account", connectedAccount);
  // console.log("accounts", accounts);
  // console.log("provider", provider);

  // const newProvider = Web3Provider.buildnet(connectedAccount as any);

  try {
    const contractAddress =
      "AS17bveA7u7x3Hog6tyXUhVLjSgko5mgDXnG6CUhxEVJVAoa5cXt";
    const args = new Args().addString(connectedAccount.address);
    // const contract = new SmartContract(provider, contractAddress);
    const contract = new SmartContract(connectedAccount, contractAddress);
    const result = await contract.read("getProfile", args);

    if (result.info.error) {
      console.error("Smart contract error:", result.info.error);
      return null;
    }
    // If no data was returned, profile doesn't exist
    if (result.value.length === 0) {
      console.warn("No profile data returned from contract.");
      return null;
    }

    const argsForDeserialization = new Args(result.value);
    const profile = argsForDeserialization.nextSerializable<Profile>(Profile);

    console.log("Profile:", profile);

    if (profile.address === "") {
      console.error("Profile is empty after deserialization:", profile);

      return null;
    }

    return profile;
  } catch (error) {
    console.error("Error checking user profile:", error);
    return null;
  }
});

export const updateUserProfile = createAsyncThunk<
  Profile,
  Profile,
  { state: RootState }
>("user/updateUserProfile", async (profileData, { getState }) => {
  const state = getState();
  const { currentWallet, connectedAccount } = state.account;
  if (!currentWallet || !connectedAccount) {
    throw new Error("No provider or connected account");
  }

  try {
    const contractAddress =
      "AS17bveA7u7x3Hog6tyXUhVLjSgko5mgDXnG6CUhxEVJVAoa5cXt";
    const contract = new SmartContract(connectedAccount, contractAddress);

    // const args = new Args()
    //   .addString(profileData.address)
    //   .addString(profileData.name)
    //   .addString(profileData.avatar)
    //   .addString(profileData.bio);

    // const newProfile = new Profile(
    //   address,
    //   name,
    //   'https://www.google.com',
    //   'Junior full stack dev',
    // );

    // const args = new Args().addSerializable(newProfile);

    // const operationStatus = await operation.waitFinalExecution();

    // if (operationStatus === OperationStatus.Success) {
    //   console.log('Profile updated successfully');

    const newProfile = new Profile(
      connectedAccount.address,
      profileData.name,
      profileData.avatar,
      profileData.bio
    );
    const args = new Args().addSerializable(newProfile).serialize();

    const operation = await contract.call("updateProfile", args);

    const operationStatus = await operation.waitFinalExecution();
    if (operationStatus === OperationStatus.Success) {
      console.log("Profile updated successfully");
    } else {
      console.error("Failed to update profile:", operationStatus);
      throw new Error("Failed to update profile");
    }
    return profileData;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateUserProfile.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(checkUserProfile.fulfilled, (state, action) => {
      if (action.payload) {
        // Profile exists
        state.user = action.payload;
      } else {
        // No profile
        state.user = null;
      }
    });
  },
});

export const { setMode } = userSlice.actions;

export default userSlice.reducer;
