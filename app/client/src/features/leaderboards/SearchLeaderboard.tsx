import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Genre } from "@interfaces/genre";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { GenreAutocomplete } from "../genres/GenreAutocomplete";
import { Leaderboard } from "./Leaderboard";

export function SearchLeaderboard() {
  const refetch = useRef<Function>(null);
  const [ready, setReady] = useState(false);

  const { handleSubmit, control } = useForm({
    defaultValues: {
      criteria: "rating" as "rating" | "readers",
      genre: null as Genre | null,
    },
  });

  //--------------------------------------------------------
  const [firstTime, setFirstTime] = useState(true);
  const criteria = useWatch({ name: "criteria", control });
  const genre = useWatch({ name: "genre", control });
  useEffect(() => {
    if (firstTime) {
      setFirstTime(false);
      return;
    }

    setReady(true);
  }, [criteria, genre?.id]);
  //------------------------

  return (
    <div className="flex flex-col gap-4">
      {!ready ? null : (
        <div>
          <Leaderboard
            criteria={criteria}
            genreId={genre?.id ?? "global"}
            title="Custom leaderboard"
          />
        </div>
      )}
      <form
        onSubmit={handleSubmit(() => setReady(true))}
        className="grid grid-cols-2 grid-rows-[min-content_auto] gap-y-1 gap-x-4 items-center"
      >
        <Label htmlFor="criteria">Criteria</Label>
        <Label htmlFor="genre">Genre</Label>

        <Controller
          control={control}
          name="criteria"
          rules={{
            required: true,
          }}
          render={({ field }) => (
            <Select defaultValue={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-[180px]" id="criteria">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Best rated</SelectItem>
                <SelectItem value="readers">Most popular</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        <div className="w-[180px]">
          <GenreAutocomplete control={control} name="genre" />
        </div>
      </form>
    </div>
  );
}
// grid gap-4 grid-cols-[1fr_1fr]
