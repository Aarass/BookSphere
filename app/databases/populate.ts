import authorService from "../api/src/services/authorService";
import genreService from "../api/src/services/genreService";
import bookService from "../api/src/services/bookService";
import authService from "app/api/src/services/authService";

(async () => {
  try {
    const aaras = await authService.register({
      username: "Aaras",
      password: "password",
      firstName: "Aleksandar",
      lastName: "Prokopovic",
      color: "#000000",
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

    const littlePrince = await bookService.createBook({
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
  } catch (err) {
    console.error(err);
  }
})();
