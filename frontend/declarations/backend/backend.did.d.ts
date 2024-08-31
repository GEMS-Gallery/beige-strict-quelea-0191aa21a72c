import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Image {
  'id' : bigint,
  'url' : string,
  'title' : string,
  'createdAt' : bigint,
  'likes' : bigint,
  'category' : string,
  'comments' : Array<string>,
}
export interface _SERVICE {
  'addComment' : ActorMethod<[bigint, string], boolean>,
  'getImages' : ActorMethod<[], Array<Image>>,
  'likeImage' : ActorMethod<[bigint], boolean>,
  'uploadImage' : ActorMethod<[string, string, string], bigint>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
