import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateBookDto } from "@interfaces/dtos/bookDto";
import { Genre } from "@interfaces/genre";
import { AlertCircleIcon, ImagePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { AuthorAutocomplete } from "../authors/AuthorAutocomplete";
import { GenresAutocomplete } from "../genres/GenresAutocomplete";
import { useCreateBookMutation } from "./booksApi";
import { useNavigate } from "react-router";

export function CreateBook() {
  // const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const [createBook, { isLoading }] = useCreateBookMutation();

  const linkValue = watch("link");

  async function submit(formData: any) {
    const dto: CreateBookDto = {
      isbn: formData.isbn,
      title: formData.title,
      description: formData.description,
      imageUrl: formData.link,
      authorId: formData.author.id,
      genreIds: formData.genres.map((g: Genre) => g.id),
    };

    const res = await createBook(dto);
    if (!res.error) {
      navigate("/books");
    }
  }

  const thereIsErrors = Object.values(errors).some(Boolean);

  return (
    <div className="flex flex-1 items-center justify-center">
      <form
        onSubmit={handleSubmit(submit)}
        className="grid gap-4 p-4 grid-cols-[1fr_1fr]"
      >
        {(() => {
          if (thereIsErrors) {
            return (
              <div className="mx-auto min-w-xs col-span-2">
                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    <ul className="list-inside list-disc text-sm">
                      {Object.entries(errors).map(([field, error]) => (
                        <li key={field}>
                          {error?.message?.toString() ??
                            `Unknown problem with ${field}`}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            );
          }

          return null;
        })()}

        <Dialog>
          <div className="relative flex-1">
            <div className="absolute right-0 h-full aspect-(--cover)">
              <DialogTrigger asChild>
                <button
                  type="button"
                  className="w-full h-full relative overflow-hidden rounded-md border border-input shadow-xs outline-none cursor-pointer"
                >
                  {(() => {
                    if (linkValue) {
                      return (
                        <img
                          src={linkValue}
                          className="w-full h-full m-auto object-center object-cover"
                        />
                      );
                    } else {
                      return (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImagePlus size={50} color="var(--input)" />
                        </div>
                      );
                    }
                  })()}
                </button>
              </DialogTrigger>
            </div>
          </div>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Cover Image URL</DialogTitle>
              <DialogDescription>
                Paste url of the cover image
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <div className="grid flex-1 gap-2">
                <div className="flex gap-2">
                  <Input {...register("link")} placeholder="URL" />
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Ok
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div>
          <div className="flex flex-col gap-2 w-3xs">
            <>
              <Label htmlFor="title">Title</Label>
              <Input
                {...register("title", {
                  required: { value: true, message: "Title is required" },
                })}
                id="title"
                placeholder="Title"
              />
            </>

            <>
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                {...register("isbn", {
                  required: { value: true, message: "ISBN is required" },
                })}
                id="isbn"
                placeholder="ISBN"
              />
            </>

            <>
              <Label htmlFor="author">Author</Label>
              <AuthorAutocomplete control={control} name="author" />
            </>

            <>
              <Label htmlFor="genres">Genres</Label>
              <GenresAutocomplete control={control} name="genres" />
            </>

            <>
              <Label htmlFor="description">Description</Label>
              <Textarea
                {...register("description", {
                  required: { value: true, message: "Description is required" },
                })}
                id="description"
                placeholder="Description"
              />
            </>

            <Button
              className="mt-5"
              type="submit"
              disabled={isLoading || thereIsErrors}
            >
              Create
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

// <div>
//   <label>
//     <img
//       className="w-3xs rounded-md border border-input shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer"
//       src={
//         linkValue
//           ? linkValue
//           : "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Plus_symbol.svg/1707px-Plus_symbol.svg.png"
//       }
//     />
//   </label>
//   <Button variant="outline" hidden></Button>
// </div>

// {
//   null;
// <>
//   <Label htmlFor="img">Image url</Label>
//   <Input
//     {...register("img", { required: true })}
//     id="img"
//     placeholder="Image url"
//   />
//   {errors["img"] && (
//     <p className="text-xs text-red-700">Imgage url is required.</p>
//   )}
// </>
// }
