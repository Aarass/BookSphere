// class Repo {
//   async fun(args: any) {
//     let session = getSession();
//     let result = await query<BookClub>(session, ``, {});
//     await session.close();

//     if (result.length != 1) {
//       throw "Internal error";
//     }

//     return result[0];
//   }
// }
