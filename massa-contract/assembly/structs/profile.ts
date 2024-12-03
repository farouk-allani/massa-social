import { Args, Result, Serializable } from '@massalabs/as-types';
import { Address } from '@massalabs/massa-as-sdk';

// User Profile structure
export class Profile implements Serializable {
  constructor(
    public address: Address = new Address(''),
    public name: string = '',
    public avatar: string = '',
    public bio: string = '',
  ) {}

  serialize(): StaticArray<u8> {
    return new Args()
      .add(this.address)
      .add(this.name)
      .add(this.bio)
      .add(this.avatar)
      .serialize();
  }

  deserialize(data: StaticArray<u8>, offset: i32): Result<i32> {
    const args = new Args(data, offset);

    this.address = new Address(
      args.nextString().expect('Failed to deserialize address'),
    );
    this.name = args.nextString().expect('Failed to deserialize name');
    this.bio = args.nextString().expect('Failed to deserialize bio');
    this.avatar = args.nextString().expect('Failed to deserialize avatar');

    return new Result(args.offset);
  }
}
