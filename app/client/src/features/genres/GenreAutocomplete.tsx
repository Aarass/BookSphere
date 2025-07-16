import { Autocomplete } from "@/components/ui/custom/autocomplete";
import { Control, FieldValues } from "react-hook-form";
import { useGetGenresQuery } from "./genresApi";

export function GenreAutocomplete(props: {
  name: string;
  control: Control<FieldValues, any, FieldValues>;
}) {
  const { data: genres } = useGetGenresQuery();

  if (genres === undefined) {
    return null;
  }

  return (
    <Autocomplete
      name={props.name}
      control={props.control}
      entries={genres}
      entryDisplayFn={(genre) => genre.name}
      placeholder="Select Genre..."
    />
  );
}
