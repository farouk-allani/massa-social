import { Address } from '@massalabs/massa-as-sdk';
import { Profile } from '../structs/profile';
import { profileKey } from './storage';

export function _getProfile(address: Address): Profile {
  const profile = profileKey.get(address.toString(), new Profile());

  return profile;
}
