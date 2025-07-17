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

export function MyReadingStatus(props: { isbn: Book["isbn"] }) {
  const { data, isLoading, isFetching } = useGetBookReadingStatusQuery(
    props.isbn,
  );

  const [setReadingStatus, { isLoading: setting }] =
    useSetBookReadingStatusMutation();

  const disabled = isLoading || isFetching || setting;

  const reading = data ? data.status === "reading" : false;
  const completed = data ? data.status === "completed" : false;

  return (
    <>
      <Tooltip delayDuration={700}>
        <TooltipTrigger asChild hidden={completed}>
          <Toggle
            className={`cursor-pointer ${reading ? "bg-secondary" : ""}`}
            pressed={reading}
            disabled={disabled}
            onPressedChange={(newStatus) => {
              setReadingStatus({
                isbn: props.isbn,
                dto: {
                  status: newStatus === true ? "reading" : "null",
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
      <Collapsible open={reading || completed}>
        <CollapsibleContent>
          <Tooltip delayDuration={700}>
            <TooltipTrigger asChild>
              <Toggle
                disabled={disabled}
                className={`cursor-pointer ${completed ? "bg-secondary" : ""}`}
                pressed={completed}
                onPressedChange={(newStatus) => {
                  setReadingStatus({
                    isbn: props.isbn,
                    dto: {
                      status: newStatus === true ? "completed" : "null",
                    } satisfies SetReadingStatus,
                  });
                }}
              >
                <BookCheck />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>{completed ? "Unmark" : "Marj"} this book as read</p>
            </TooltipContent>
          </Tooltip>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
