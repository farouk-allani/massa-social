import { Args, Result, Serializable } from '@massalabs/as-types';
import { Address } from '@massalabs/massa-as-sdk';

export class Post implements Serializable {
  constructor(
    public id: u64 = 0,
    public author: Address = new Address(''),
    public text: string = '',
    public image: string = '',
    public createdAt: u64 = 0,
  ) {}

  serialize(): StaticArray<u8> {
    return new Args()
      .add(this.id)
      .add(this.author) // Serialize the author's profile
      .add(this.text)
      .add(this.image)
      .add(this.createdAt)
      .serialize();
  }

  deserialize(data: StaticArray<u8>, offset: i32): Result<i32> {
    const args = new Args(data, offset);
    this.id = args.nextU64().expect('Failed to deserialize id');
    this.author = new Address(
      args.nextString().expect('Failed to deserialize author'),
    );
    this.text = args.nextString().expect('Failed to deserialize content');
    this.image = args.nextString().expect('Failed to deserialize image');
    const createdAtTimestamp = args.nextU64();
    this.createdAt = createdAtTimestamp.isOk()
      ? createdAtTimestamp.unwrap()
      : 0;

    return new Result(args.offset);
  }
}
