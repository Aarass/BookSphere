import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import { useGetGenresQuery } from "./genresApi";
import { Genre } from "@interfaces/genre";

export function GenresAutocomplete(props: {
  name: string;
  control: Control<FieldValues, any, FieldValues>;
}) {
  // name={props.name}
  // control={props.control}
  // entries={genres}
  // entryDisplayFn={(genre) => genre.name}
  // placeholder="Select Genre..."
  const [open, setOpen] = useState(false);
  const { data: genres } = useGetGenresQuery();

  if (genres === undefined) {
    return null;
  }

  return (
    <Controller
      control={props.control}
      defaultValue={[] as Genre[]}
      name={props.name}
      rules={{
        required: {
          value: true,
          message: "At least one genre must be selected",
        },
      }}
      render={({ field: { onChange, onBlur, value } }) => (
        <Popover
          open={open}
          onOpenChange={(open) => {
            setOpen(open);
            if (!open) {
              onBlur();
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between"
            >
              <div className="flex w-full justify-between items-center">
                <span
                  className={`flex-1 overflow-ellipsis overflow-hidden whitespace-nowrap text-left ${value.length ? "" : "opacity-60"}`}
                >
                  {value.length
                    ? value.map((genre: Genre) => genre.name).join(", ")
                    : "Select Genres..."}
                </span>
                <ChevronsUpDown className="opacity-50 shrink" />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Search..." className="h-9" />
              <CommandList>
                <CommandEmpty>No items found.</CommandEmpty>
                <CommandGroup>
                  {genres.map((genre) => (
                    <CommandItem
                      key={genre.id}
                      value={genre.name}
                      onSelect={() => {
                        const selected = value as Genre[];

                        const index = selected
                          .map((val) => val.id)
                          .findIndex((id) => id === genre.id);

                        let newValue;
                        if (index === -1) {
                          newValue = [...selected, genre];
                        } else {
                          newValue = selected.toSpliced(index, 1);
                        }

                        console.log(...newValue);

                        onChange(newValue);
                      }}
                    >
                      {genre.name}
                      <Check
                        className={cn(
                          "ml-auto",
                          (value as Genre[])
                            .map((val) => val.id)
                            .includes(genre.id)
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    />
  );
}
