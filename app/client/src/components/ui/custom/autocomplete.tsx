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

export function Autocomplete<T extends { id: string }>(
  props: {
    name: string;
    control: Control<FieldValues, any, FieldValues>;
    entries: T[];
    entryDisplayFn: (_: T) => string;
    placeholder: string;
  } & ({ required: true; errorMessage: string } | { required?: undefined }),
) {
  const [open, setOpen] = useState(false);

  return (
    <Controller
      control={props.control}
      name={props.name}
      rules={
        props.required
          ? {
              required: { value: true, message: props.errorMessage },
            }
          : {}
      }
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
          {(() => {
            // console.log(value, ref);
            return null;
          })()}
          <PopoverTrigger asChild className="w-full">
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="max-w-full font-normal justify-between"
            >
              <span className="flex-1 text-left">
                {value ? props.entryDisplayFn(value) : props.placeholder}
              </span>
              <ChevronsUpDown className="opacity-50 shrink" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0">
            <Command>
              <CommandInput placeholder="Search..." className="h-9" />
              <CommandList>
                <CommandEmpty>No items found.</CommandEmpty>
                <CommandGroup>
                  {props.entries.map((entry) => (
                    <CommandItem
                      key={entry.id}
                      value={props.entryDisplayFn(entry)}
                      onSelect={() => {
                        const newValue = entry.id === value?.id ? null : entry;
                        setOpen(false);
                        // setValue(newValue);
                        onChange(newValue);
                      }}
                    >
                      {props.entryDisplayFn(entry)}
                      <Check
                        className={cn(
                          "ml-auto",
                          value?.id === entry.id ? "opacity-100" : "opacity-0",
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
