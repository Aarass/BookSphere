import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Book } from "@interfaces/book";
import { SetReadingStatus } from "@interfaces/dtos/bookDto";
import { BookCheck, Glasses } from "lucide-react";
import {
  useGetBookReadingStatusQuery,
  useSetBookReadingStatusMutation,
} from "./booksApi";
import { useState } from "react";

export function MyReadingStatus(props: { isbn: Book["isbn"] }) {
  const { data, isLoading, isFetching } = useGetBookReadingStatusQuery(
    props.isbn,
  );

  const [setReadingStatus, { isLoading: setting }] =
    useSetBookReadingStatusMutation();

  const disabled = isLoading || isFetching || setting;
  const pressed = data ? data.status : false;

  const [read, setRead] = useState(false);

  return (
    <>
      <Tooltip delayDuration={700}>
        <TooltipTrigger asChild hidden={read}>
          <Toggle
            className={`cursor-pointer ${pressed ? "bg-secondary" : ""}`}
            pressed={pressed}
            disabled={disabled}
            onPressedChange={(newStatus) => {
              setReadingStatus({
                isbn: props.isbn,
                dto: {
                  status: newStatus,
                } satisfies SetReadingStatus,
              });
            }}
          >
            <Glasses />
          </Toggle>
        </TooltipTrigger>
        <TooltipContent>
          <p>Tell people that you are reading this book</p>
        </TooltipContent>
      </Tooltip>
      <Collapsible open={pressed}>
        <CollapsibleContent>
          <Tooltip delayDuration={700}>
            <TooltipTrigger asChild>
              <Toggle
                className={`cursor-pointer ${read ? "bg-secondary" : ""}`}
                pressed={read}
                onPressedChange={setRead}
              >
                <BookCheck />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mark this book as read</p>
            </TooltipContent>
          </Tooltip>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
