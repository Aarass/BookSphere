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
      <form
        onSubmit={handleSubmit(() => setReady(true))}
        className="grid gap-4 grid-cols-[1fr_1fr]"
      >
        <div className="grid grid-cols-[max-content_max-content_min-content] grid-rows-[min-content_auto] gap-y-1 gap-x-4 items-center">
          <Label htmlFor="criteria">Criteria</Label>
          <Label htmlFor="genre">Genre</Label>
          <div />

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

          <Button
            variant="ghost"
            size="sm"
            type="submit"
            onClick={() => {
              if (refetch.current) {
                refetch.current();
              }
            }}
          >
            <Search />
          </Button>
        </div>
      </form>
      {!ready ? null : (
        <div>
          <Leaderboard
            criteria={criteria}
            genreId={genre?.id ?? "global"}
            setRefetchFunction={(fn) => (refetch.current = fn)}
          />
        </div>
      )}
    </div>
  );
}
