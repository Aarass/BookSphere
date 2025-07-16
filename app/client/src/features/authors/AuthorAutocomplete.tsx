import { Autocomplete } from "@/components/ui/custom/autocomplete";
import { Control, FieldValues } from "react-hook-form";
import { useGetAuthorsQuery } from "./authorsApi";

export function AuthorAutocomplete(props: {
  name: string;
  control: Control<FieldValues, any, FieldValues>;
}) {
  const { data: authors } = useGetAuthorsQuery();

  if (authors === undefined) {
    return null;
  }

  return (
    <Autocomplete
      name={props.name}
      control={props.control}
      entries={authors}
      entryDisplayFn={(author) => author.fullName}
      placeholder="Select Author..."
      required
      errorMessage="Author is required"
    />
  );
}
