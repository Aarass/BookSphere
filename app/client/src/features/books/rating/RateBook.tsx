import { Book } from "@interfaces/book";
import { Star } from "lucide-react";
import {
  useCreateBookRatingMutation,
  useDeleteBookRatingMutation,
  useGetMyBookRatingQuery,
  useUpdateBookRatingMutation,
} from "./ratingApi";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function RateBook(props: { isbn: Book["isbn"] }) {
  const {
    data: rating,
    isLoading,
    isFetching,
    isUninitialized,
  } = useGetMyBookRatingQuery(props.isbn);

  if (isUninitialized) {
    throw new Error(`Developer error. You forgot to start the request.`);
  }

  const [createRating, { isLoading: creating }] = useCreateBookRatingMutation();
  const [updateRating, { isLoading: updating }] = useUpdateBookRatingMutation();
  const [deleteRating, { isLoading: deleting }] = useDeleteBookRatingMutation();

  const isPerformingOperation = creating || updating || deleting;
  const isIdle = !isLoading && !isFetching && !isPerformingOperation;

  function onChange(value: number) {
    if (!isIdle) return;

    if (rating === undefined) {
      alert("Can't fulfill that");
      console.error(
        "Ne mogu da nastavim jer mi server nije dostavio pocetno stanje",
      );
      return;
    }

    if (rating === null) {
      createRating({ isbn: props.isbn, value });
    } else {
      if (value !== rating.value) {
        updateRating({ isbn: props.isbn, value });
      } else {
        deleteRating(props.isbn);
      }
    }
  }

  const stars = [];

  for (let i = 1; i <= 5; i++) {
    let fill = 0;
    if (rating) {
      if (i <= rating.value) {
        fill = 1;
      }
    }

    stars.push(
      <Star
        className="cursor-pointer"
        key={i}
        fill={undefined}
        opacity={isIdle ? 1 : 0.5}
        fillOpacity={fill}
        onClick={() => {
          onChange(i);
        }}
      />,
    );
  }

  return (
    <Tooltip delayDuration={700}>
      <TooltipTrigger className="flex items-center">{stars}</TooltipTrigger>
      <TooltipContent>
        <p>Rate this book</p>
      </TooltipContent>
    </Tooltip>
  );
}
