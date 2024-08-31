export const idlFactory = ({ IDL }) => {
  const Image = IDL.Record({
    'id' : IDL.Nat,
    'url' : IDL.Text,
    'title' : IDL.Text,
    'createdAt' : IDL.Int,
    'likes' : IDL.Nat,
    'category' : IDL.Text,
    'comments' : IDL.Vec(IDL.Text),
  });
  return IDL.Service({
    'addComment' : IDL.Func([IDL.Nat, IDL.Text], [IDL.Bool], []),
    'getImages' : IDL.Func([], [IDL.Vec(Image)], ['query']),
    'likeImage' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'uploadImage' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Nat], []),
  });
};
export const init = ({ IDL }) => { return []; };
