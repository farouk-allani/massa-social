import { Address, Storage } from '@massalabs/massa-as-sdk';
import { Profile } from '../structs/profile';
import { postsKey, profileKey } from './storage';
import { Args } from '@massalabs/as-types';
import { Post } from '../structs/post';

export function _getProfile(address: Address): Profile {
  const profile = profileKey.get(address.toString(), new Profile());

  return profile;
}

// export function _getPosts(): Array<Post> {
//   const posts = new Args(Storage.get(postsKey))
//     .nextSerializableObjectArray<Post>()
//     .unwrap();

//   return posts;
// }
