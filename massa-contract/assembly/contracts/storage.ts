import { Profile } from '../structs/profile';
import { Post } from '../structs/post';
// import { PersistentMap } from '@massalabs/massa-as-sdk/assembly/collections';
import { PersistentMap } from '../libraries/PersistentMap';
import { bytesToString, stringToBytes } from '@massalabs/as-types';

export const profileKey = new PersistentMap<string, Profile>('profile');
export const postMap = new PersistentMap<string, Post>('post');
export const POST_ID_KEY = 'postId';
export const postsKey = stringToBytes('posts');
