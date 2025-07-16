import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { GenreAutocomplete } from "../genres/GenreAutocomplete";
import { Genre } from "@interfaces/genre";
import { useGetLeaderboardQuery } from "./leaderboardsApi";

export function SearchLeaderboard() {
  const { register, handleSubmit, watch, control } = useForm();

  // useEffect(() => {
  //   const subscription = watch((value, { name, type }) => {
  //     submit(value);
  //   });
  //
  //   return () => subscription.unsubscribe();
  // }, [watch]);
  const tmp = useGetLeaderboardQuery();

  function submit(data: any) {
    const criteria: "rating" | "readers" = data["criteria"];
    const genre: Genre["id"] | "global" = data["genre"]?.id ?? "global";

    console.log(criteria, genre);
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="grid gap-4 p-4 grid-cols-[1fr_1fr]"
    >
      <div className="grid grid-cols-[max-content_max-content_min-content] grid-rows-[min-content_auto] gap-y-1 gap-x-4 items-center">
        <Label htmlFor="criteria">Criteria</Label>
        <Label htmlFor="genre">Genre</Label>
        <div />

        <Controller
          defaultValue="rating"
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

        <Button variant="ghost" size="sm" type="submit">
          <Search />
        </Button>
      </div>
    </form>
  );
}
