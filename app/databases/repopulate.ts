import authorService from "../api/src/services/authorService";
import genreService from "../api/src/services/genreService";
import bookService from "../api/src/services/bookService";
import ratingService from "../api/src/services/ratingService";
import authService from "app/api/src/services/authService";
import { getClient } from "app/api/src/drivers/redis";
import { getSession } from "app/api/src/drivers/neo4j";
import bookClubService from "app/api/src/services/bookClubService";
import roomService from "app/api/src/services/roomService";

(async () => {
  try {
    const redis = getClient();
    await redis.flushDb();
    const neo4j = getSession();
    await neo4j.run(`MATCH (n) DETACH DELETE n`);

    redis.quit();
    neo4j.close();

    const aaras = await authService.register({
      username: "Aaras",
      password: "password",
      firstName: "Aleksandar",
      lastName: "Prokopovic",
      color: "#000000",
    });

    const mix = await authService.register({
      username: "mihail0o",
      password: "password",
      firstName: "Mihailo",
      lastName: "Petrovic",
      color: "#FF0000",
    });

    const meda = await authService.register({
      username: "meda016",
      password: "password",
      firstName: "Dusan",
      lastName: "Pavlovic",
      color: "#00FF00",
    });

    const antoine = await authorService.createAuthor({
      fullName: "Antoine de Saint-Exupéry",
    });
    const frankHerbert = await authorService.createAuthor({
      fullName: "Frank Herbert",
    });
    const williamShakespeare = await authorService.createAuthor({
      fullName: "William Shakespeare",
    });
    const leoTolstoy = await authorService.createAuthor({
      fullName: "Leo Tolstoy",
    });
    const fyodorDostoevsky = await authorService.createAuthor({
      fullName: "Fyodor Dostoevsky",
    });
    const janeAusten = await authorService.createAuthor({
      fullName: "Jane Austen",
    });
    const charlesDickens = await authorService.createAuthor({
      fullName: "Charles Dickens",
    });
    const homer = await authorService.createAuthor({
      fullName: "Homer",
    });
    const franzKafka = await authorService.createAuthor({
      fullName: "Franz Kafka",
    });
    const markTwain = await authorService.createAuthor({
      fullName: "Mark Twain",
    });
    const ernestHemingway = await authorService.createAuthor({
      fullName: "Ernest Hemingway",
    });
    const virginiaWoolf = await authorService.createAuthor({
      fullName: "Virginia Woolf",
    });
    const harukiMurakami = await authorService.createAuthor({
      fullName: "Haruki Murakami",
    });
    const stephenKing = await authorService.createAuthor({
      fullName: "Stephen King",
    });
    const jkRowling = await authorService.createAuthor({
      fullName: "J.K. Rowling",
    });
    const margaretAtwood = await authorService.createAuthor({
      fullName: "Margaret Atwood",
    });
    const pauloCoelho = await authorService.createAuthor({
      fullName: "Paulo Coelho",
    });
    const neilGaiman = await authorService.createAuthor({
      fullName: "Neil Gaiman",
    });
    const elenaFerrante = await authorService.createAuthor({
      fullName: "Elena Ferrante",
    });
    const colleenHoover = await authorService.createAuthor({
      fullName: "Colleen Hoover",
    });
    const sallyRooney = await authorService.createAuthor({
      fullName: "Sally Rooney",
    });

    const scienceFantasy = await genreService.createGenre({
      name: "Science fantasy",
    });
    const childrensLiterature = await genreService.createGenre({
      name: "Children's Literature",
    });
    const fantasy = await genreService.createGenre({
      name: "Fantasy",
    });
    const scienceFiction = await genreService.createGenre({
      name: "Science Fiction",
    });
    const horror = await genreService.createGenre({
      name: "Horror",
    });
    const thriller = await genreService.createGenre({
      name: "Thriller",
    });
    const crimeFiction = await genreService.createGenre({
      name: "Crime Fiction",
    });
    const romance = await genreService.createGenre({
      name: "Romance",
    });
    const historicalFiction = await genreService.createGenre({
      name: "Historical Fiction",
    });
    const drama = await genreService.createGenre({
      name: "Drama",
    });
    const psychologicalFiction = await genreService.createGenre({
      name: "Psychological Fiction",
    });
    const autobiography = await genreService.createGenre({
      name: "Autobiography",
    });
    const philosophicalLiterature = await genreService.createGenre({
      name: "Philosophical Literature",
    });

    const prince = await bookService.createBook({
      isbn: "0-7567-5189-6",
      title: "The Little Prince",
      description:
        "The story follows a young prince who visits various planets, including Earth, and addresses themes of loneliness, friendship, love, and loss.",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/sr/b/b6/Littleprincecover.JPG",
      authorId: antoine.id,
      genreIds: [scienceFantasy.id, childrensLiterature.id],
    });

    await bookService.createBook({
      isbn: "ISBN 978-1-947808-03-4",
      title: "Romeo and Juliet",
      description: `The Tragedy of Romeo and Juliet, often shortened to Romeo and Juliet, is a tragedy written by William Shakespeare about the romance between two young Italians from feuding families. It was among Shakespeare's most popular plays during his lifetime and, along with Hamlet, is one of his most frequently performed. Today, the title characters are regarded as archetypal young lovers. `,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/5/55/Romeo_and_juliet_brown.jpg",
      authorId: williamShakespeare.id,
      genreIds: [drama.id, romance.id],
    });

    await bookService.createBook({
      isbn: "978-1-4000-7998-8",
      title: "War and Peace",
      description: `War and Peace (Russian: Война и мир, romanized: Voyna i mir; pre-reform Russian: Война и миръ; IPA: [vɐjˈna i ˈmʲir]) is a literary work by the Russian author Leo Tolstoy. Set during the Napoleonic Wars, the work comprises both a fictional narrative and chapters in which Tolstoy discusses history and philosophy. An early version was published serially beginning in 1865, after which the entire book was rewritten and published in 1869. It is regarded, with Anna Karenina, as Tolstoy's finest literary achievement, and it remains an internationally praised classic of world literature.`,
      imageUrl: "https://m.media-amazon.com/images/I/91FXycpulgL.jpg",
      authorId: leoTolstoy.id,
      genreIds: [historicalFiction.id, drama.id],
    });

    await bookService.createBook({
      isbn: "978-1-84022-430-6",
      title: "Crime and Punishment",
      description: `Crime and Punishment is a novel by the Russian author Fyodor Dostoevsky. It was first published in the literary journal The Russian Messenger in twelve monthly installments during 1866. It was later published in a single volume. It is the second of Dostoevsky's full-length novels following his return from ten years of exile in Siberia. Crime and Punishment is considered the first great novel of his mature period of writing and is often cited as one of the greatest works of world literature`,
      imageUrl:
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1657562532i/17879.jpg",
      authorId: fyodorDostoevsky.id,
      genreIds: [psychologicalFiction.id, philosophicalLiterature.id],
    });

    await bookService.createBook({
      isbn: "978-1-9075-9027-6",
      title: "The Old Man and the Sea",
      description: `The Old Man and the Sea is a 1952 novella by the American author Ernest Hemingway. Written between December 1950 and February 1951, it was the last major fictional work Hemingway published during his lifetime. It tells the story of Santiago, an aging fisherman, and his long struggle to catch a giant marlin. `,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/The_Old_Man_and_the_Sea_%281952%29_front_cover%2C_first_edition.jpg/800px-The_Old_Man_and_the_Sea_%281952%29_front_cover%2C_first_edition.jpg",
      authorId: ernestHemingway.id,
      genreIds: [drama.id, philosophicalLiterature.id],
    });

    await bookService.createBook({
      isbn: "0-06-250217-4",
      title: "The Alchemist",
      description: `The Alchemist (Portuguese: O Alquimista) is a novel by Brazilian author Paulo Coelho which was first published in 1988. Originally written in Portuguese, it became a widely translated international bestseller. The story follows the shepherd boy Santiago in his journey across North Africa to the Egyptian pyramids after he dreams of finding treasure there. `,
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/c/c4/TheAlchemist.jpg",
      authorId: pauloCoelho.id,
      genreIds: [philosophicalLiterature.id, drama.id],
    });

    await bookService.createBook({
      isbn: "978-1-60945-078-6",
      title: "My Brilliant Friend",
      description: `My Brilliant Friend (Italian: L'amica geniale) is a 2011 novel by Italian author Elena Ferrante. It is the first of four volumes in Ferrante's critically acclaimed Neapolitan Novels series. The novel, translated into English by Ann Goldstein in 2012, explores themes of female friendship, social class, and personal identity against the backdrop of post-war Naples.`,
      imageUrl:
        "https://m.media-amazon.com/images/I/81WoMfvp-2L._UF1000,1000_QL80_.jpg",
      authorId: elenaFerrante.id,
      genreIds: [drama.id, romance.id],
    });

    const dune = await bookService.createBook({
      isbn: "978-0-240-80772-0",
      title: "Dune",
      description:
        'It tells the story of young Paul Atreides, whose family accepts the stewardship of the planet Arrakis. While the planet is an inhospitable and sparsely populated desert wasteland, it is the only source of melange, or "spice", a drug that extends life and enhances mental abilities.',
      imageUrl:
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg",
      authorId: frankHerbert.id,
      genreIds: [scienceFantasy.id],
    });

    await bookClubService.createBookClub({
      tittle: "The Book Nook",
      description:
        "A cozy corner for book lovers to relax, read, and share stories in good company",
    });

    await bookClubService.createBookClub({
      tittle: "Lit & Lattes",
      description: "Books, coffee, and conversation",
    });

    const club = await bookClubService.createBookClub({
      tittle: "Anti Social Social Club",
      description: "Club for anti-social people",
    });

    bookClubService.joinBookClub(club.id, aaras.id);
    bookClubService.joinBookClub(club.id, meda.id);
    bookClubService.joinBookClub(club.id, mix.id);

    await roomService.createRoom(club.id, {
      tittle: "Unread Messages",
      description: "A silent thread for loud thoughts",
    });

    await bookService.setReadingStatus(prince.isbn, aaras.id, {
      status: "reading",
    });
    await bookService.setReadingStatus(prince.isbn, mix.id, {
      status: "reading",
    });

    await bookService.setReadingStatus(dune.isbn, meda.id, {
      status: "reading",
    });
    await bookService.setReadingStatus(dune.isbn, meda.id, { status: "null" });
    await bookService.setReadingStatus(dune.isbn, aaras.id, {
      status: "reading",
    });

    await ratingService.createRating(prince.isbn, mix.id, { value: 3 });
    await ratingService.createRating(prince.isbn, meda.id, { value: 3 });

    await ratingService.createRating(dune.isbn, aaras.id, { value: 3 });
    await ratingService.createRating(dune.isbn, mix.id, { value: 4 });
    // Rating/Commenting/Reading Operations need some time to be sent to the leaderboard
    await new Promise((resolve) => setTimeout(resolve, 200));

    // console.time("leaderboard");
    // const globalLeaderboard = await leaderboardService.getBooksFromLeaderboard(
    //   "rating",
    //   "global",
    //   {}
    // );
    // console.log("Global");
    // console.log("----------------------------------------------------------");
    // globalLeaderboard.forEach((entry) => console.log(entry));
    // console.log("----------------------------------------------------------");

    // const scienceFantasyLeaderboard =
    //   await leaderboardService.getBooksFromLeaderboard(
    //     "rating",
    //     scienceFantasy.id,
    //     {}
    //   );
    // console.log("Science");
    // console.log("----------------------------------------------------------");
    // scienceFantasyLeaderboard.forEach((entry) => console.log(entry));
    // console.log("----------------------------------------------------------");

    // const childrensLiteratureLeaderboard =
    //   await leaderboardService.getBooksFromLeaderboard(
    //     "rating",
    //     childrensLiterature.id,
    //     {}
    //   );
    // console.log("Childrens");
    // console.log("----------------------------------------------------------");
    // childrensLiteratureLeaderboard.forEach((entry) => console.log(entry));
    // console.log("----------------------------------------------------------");
    // console.timeEnd("leaderboard");

    // await bookService.deleteBook(prince.isbn);

    // const stats = await bookService.getStats(dune.isbn);
    // console.log("Stats: ", stats);
  } catch (err) {
    console.error(err);
  } finally {
    setTimeout(() => {
      process.exit();
    }, 500);
  }
})();
