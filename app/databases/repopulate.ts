import authorService from "../api/src/services/authorService";
import genreService from "../api/src/services/genreService";
import bookService from "../api/src/services/bookService";
import ratingService from "../api/src/services/ratingService";
import authService from "app/api/src/services/authService";
import { getClient } from "app/api/src/drivers/redis";
import { getSession } from "app/api/src/drivers/neo4j";
import leaderboardService from "app/api/src/services/leaderboardService";

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
    const frank = await authorService.createAuthor({
      fullName: "Frank Herbert",
    });

    const scienceFantasy = await genreService.createGenre({
      name: "Science fantasy",
    });
    const childrensLiterature = await genreService.createGenre({
      name: "Children's Literature",
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

    const dune = await bookService.createBook({
      isbn: "978-0-240-80772-0",
      title: "Dune",
      description:
        'It tells the story of young Paul Atreides, whose family accepts the stewardship of the planet Arrakis. While the planet is an inhospitable and sparsely populated desert wasteland, it is the only source of melange, or "spice", a drug that extends life and enhances mental abilities.',
      imageUrl:
        "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1555447414i/44767458.jpg",
      authorId: frank.id,
      genreIds: [scienceFantasy.id],
    });

    await bookService.setReadingStatus(prince.isbn, aaras.id, { status: true });
    await bookService.setReadingStatus(prince.isbn, mix.id, { status: true });

    await bookService.setReadingStatus(dune.isbn, meda.id, { status: true });
    await bookService.setReadingStatus(dune.isbn, meda.id, { status: false });
    await bookService.setReadingStatus(dune.isbn, aaras.id, { status: true });

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
