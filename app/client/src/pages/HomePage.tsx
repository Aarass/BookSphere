import { Button } from "@/components/ui/button";
import { Leaderboard } from "@/features/leaderboards/Leaderboard";
import { useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SearchLeaderboard } from "@/features/leaderboards/SearchLeaderboard";
import { RecommendedBooksFavorite } from "@/features/books/RecommendedBooksFavorite";
import { RecommendedBooksClubs } from "@/features/books/RecommendedBooksClubs";

export function HomePage() {
  return (
    <>
      <div className="flex-1 overflow-hidden grid grid-cols-[auto_min-content] gap-4 p-4">
        <div className="flex flex-col gap-y-4 overflow-scroll">
          <RecommendedBooksClubs />
          <RecommendedBooksFavorite />
        </div>
        <div className="grid grid-rows-2 gap-4 overflow-hidden">
          <Leaderboard
            criteria="rating"
            genreId="global"
            title="Best rated books"
          />
          <Leaderboard
            criteria="readers"
            genreId="global"
            title="Books with most readers"
          />

          <Drawer>
            <DrawerTrigger asChild>
              <Button type="button">Search by genre</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Choose criteria and genre</DrawerTitle>
                <DrawerDescription>Leave rest to us</DrawerDescription>
              </DrawerHeader>
              <div className="mx-auto">
                <SearchLeaderboard />
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline" className="mx-auto w-[100px]">
                    Close
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </>
  );
}
