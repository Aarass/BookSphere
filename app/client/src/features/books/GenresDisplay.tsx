import { Genre } from "@interfaces/genre";
import { Badge } from "@/components/ui/badge";

export function GenresDisplay({ genres }: { genres: Genre[] }) {
  return genres.map((genre) => (
    <Badge variant="secondary" key={genre.id}>
      {genre.name}
    </Badge>
  ));
}
