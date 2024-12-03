import { Args, bytesToString, stringToBytes } from '@massalabs/as-types';
import {
  Address,
  changeCallStack,
  Context,
  createEvent,
  generateEvent,
  mockScCall,
  resetStorage,
  setDeployContext,
} from '@massalabs/massa-as-sdk';
import {
  constructor,
  createPost,
  getPost,
  getPosts,
  getProfile,
  updatePost,
  updateProfile,
} from '../contracts/social-media';
import { _getProfile } from '../contracts/social-media-internals';
import { Profile } from '../structs/profile';
import { Post } from '../structs/post';

// const contractOwner = 'AU12Yd4kCcsizeeTEK9AZyBnuJNZ1cpp99XfCZgzS77ZKnwTFMpVE';
const user1 = 'AU12Yd4kCcsizeeTEK9AZyBnuJNZ1cpp99XfCZgzS77ZKnwTFMpVE';
const user2 = 'AU1aC6g4NpkLQrhp6mVC1ugaDrAEdPGUyVk57xPmEZgF6bh6dTUf';
const contractAdddress =
  'AU12Yd4kCcsizeeTEK9AZyBnuJNZ1cpp99XfCZgzS77ZKnwTFMpVE';

function switchUser(user: string): void {
  changeCallStack(user + ' , ' + contractAdddress);
}

describe('test user profile', () => {
  beforeAll(() => {
    setDeployContext();

    constructor([]);
  });

  test('get user default profile', () => {
    const args = new Args().add(user1).serialize();

    const profile = getProfile(args);

    generateEvent(createEvent('GetProfile', [user1, bytesToString(profile)]));
  });

  test('update user profile', () => {
    const profile1 = new Profile(
      new Address(user1),
      'Ayoub Amer',
      'fsf',
      'Juniro fill stack dev',
    );

    updateProfile(profile1.serialize());

    const profile = getProfile(new Args().add(user1).serialize());

    expect(bytesToString(profile)).toBe(bytesToString(profile1.serialize()));
  });

  test('create post', () => {
    const args = new Args()
      .add(stringToBytes('hello world'))
      .add(stringToBytes(''))
      .serialize();

    createPost(args);

    const posts = getPosts();

    const deserializedPosts = new Args(
      posts,
    ).nextSerializableObjectArray<Post>();

    expect(deserializedPosts.isOk()).toBe(true);

    const post = deserializedPosts.unwrap()[0];

    expect(post.text).toBe('hello world');
  });

  test('edit post', () => {
    const post = getPost(new Args().add(u64(0)).serialize());

    const deserializedPost = new Args(post).nextSerializable<Post>();

    generateEvent(createEvent('GetPost', [deserializedPost.unwrap().text]));

    expect(deserializedPost.unwrap().text).toBe('hello world');

    const args = new Args()
      .add(u64(0))
      .add(stringToBytes('hello world 2'))
      .add(stringToBytes(''))
      .serialize();

    updatePost(args);

    const post2 = getPost(new Args().add(u64(0)).serialize());

    const deserializedPost2 = new Args(post2).nextSerializable<Post>();

    generateEvent(createEvent('GetPost', [deserializedPost2.unwrap().text]));

    expect(deserializedPost2.unwrap().text).toBe('hello world 2');
  });
});
