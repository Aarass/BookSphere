import { Toggle } from "@/components/ui/toggle";
import { Book } from "@interfaces/book";
import { Glasses } from "lucide-react";
import {
  useGetBookReadingStatusQuery,
  useSetBookReadingStatusMutation,
} from "./booksApi";
import { SetReadingStatus } from "@interfaces/dtos/bookDto";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function MyReadingStatus(props: { isbn: Book["isbn"] }) {
  const { data, isLoading, isFetching } = useGetBookReadingStatusQuery(
    props.isbn,
  );

  const [setReadingStatus, { isLoading: setting }] =
    useSetBookReadingStatusMutation();

  const disabled = isLoading || isFetching || setting;
  const pressed = data ? data.status : false;

  return (
    <Tooltip delayDuration={700}>
      <TooltipTrigger asChild>
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
  );
}
