import {
  Address,
  caller,
  Context,
  createEvent,
  generateEvent,
  Storage,
  timestamp,
} from '@massalabs/massa-as-sdk';
import { Args, stringToBytes } from '@massalabs/as-types';
import { _setOwner, OWNER_KEY } from './utils/ownership-internal';
import { onlyOwner, setOwner } from './utils/ownership';
import { _getProfile } from './social-media-internals';
import { Profile } from '../structs/profile';
import { POST_ID_KEY, postMap, postsKey, profileKey } from './storage';
import { Post } from '../structs/post';

/**
 * This function is meant to be called only one time: when the contract is deployed.
 *
 * @param binaryArgs - Arguments serialized with Args
 */
export function constructor(binaryArgs: StaticArray<u8>): void {
  // If you remove this check, someone could call your constructor function and reset your smart contract.
  assert(Context.isDeployingContract());

  const admin = Context.caller().toString();

  // set the contract owner
  setOwner(new Args().add(admin).serialize());

  // Storage.set(
  //   postsKey,
  //   new Args().addSerializableObjectArray<Post>([]).serialize(),
  // );

  Storage.set(POST_ID_KEY, '0');

  // generate the event for the contract  deployment
  generateEvent(createEvent('ContractDeployed', [admin]));
}

/**
 * change the  contract owner.
 * @param binaryArgs - serialized strings representing the new owner.
 * @remarks This function is only callable by the collection owner.
 */
export function transferOwnership(binaryArgs: StaticArray<u8>): void {
  onlyOwner();

  const args = new Args(binaryArgs);
  const oldOwner = Storage.get(OWNER_KEY);
  const newOwner = args.nextString().unwrap();
  setOwner(new Args().add(newOwner).serialize());
  generateEvent(createEvent('TransferOwnership', [oldOwner, newOwner]));
}

export function getProfile(binaryArgs: StaticArray<u8>): StaticArray<u8> {
  const args = new Args(binaryArgs);

  const userAddress = args.nextString().unwrap();

  const profile = _getProfile(new Address(userAddress));

  return profile.serialize();
}

export function updateProfile(binaryArgs: StaticArray<u8>): void {
  const args = new Args(binaryArgs);
  const profile = args.nextSerializable<Profile>().unwrap();

  const userAddress = profile.address;

  // assert(
  //   caller().toString() == userAddress.toString(),
  //   'Caller is not the profile owner',
  // );

  profileKey.set(userAddress.toString(), profile);

  generateEvent(createEvent('UpdateProfile', [userAddress.toString()]));
}

export function getPosts(): StaticArray<u8> {
  const lastPostId = u64.parse(Storage.get(POST_ID_KEY));
  let posts: Post[] = [];

  for (let i = u64(0); i < lastPostId; i++) {
    const post = postMap.get(i.toString(), new Post());
    posts.push(post);
  }

  return new Args().addSerializableObjectArray<Post>(posts).serialize();
}

export function createPost(binaryArgs: StaticArray<u8>): void {
  const args = new Args(binaryArgs);

  const text = args.nextString().unwrap();
  const image = args.nextString().unwrap();
  const createdAt = timestamp();

  const postId = u64.parse(Storage.get(POST_ID_KEY));

  const post = new Post(postId, caller(), text, image, createdAt);

  postMap.set(postId.toString(), post);

  Storage.set(POST_ID_KEY, (postId + 1).toString());

  generateEvent(
    createEvent('CreatePost', [
      post.id.toString(),
      post.author.toString(),
      post.text,
      post.image,
      post.createdAt.toString(),
    ]),
  );
}

export function getPost(binaryArgs: StaticArray<u8>): StaticArray<u8> {
  const lastPostId = u64.parse(Storage.get(POST_ID_KEY));

  const args = new Args(binaryArgs);
  const postId = args.nextU64().unwrap();

  assert(postId < lastPostId, 'Post not found');

  const post = postMap.get(postId.toString(), new Post());

  return post.serialize();
}

export function updatePost(binaryArgs: StaticArray<u8>): void {
  const args = new Args(binaryArgs);

  const lastPostId = u64.parse(Storage.get(POST_ID_KEY));

  const postId = args.nextU64().unwrap();
  const text = args.nextString().unwrap();
  const image = args.nextString().unwrap();

  assert(postId < lastPostId, 'Post not found');

  let post = postMap.get(postId.toString(), new Post());

  post.text = text;
  post.image = image;

  postMap.set(postId.toString(), post);

  generateEvent(createEvent('UpdatePost', [postId.toString(), text, image]));
}
