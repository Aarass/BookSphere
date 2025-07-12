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
import { ImagePlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { AuthorAutocomplete } from "../authors/AuthorAutocomplete";
import { GenreAutocomplete } from "../genres/GenreAutocomplete";
import { useCreateBookMutation } from "./booksApi";

export function CreateBook() {
  // const dispatch = useAppDispatch();
  // const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    control,
    clearErrors,
    formState: { errors },
  } = useForm();

  const [createBook, { isLoading }] = useCreateBookMutation();

  const linkValue = watch("link");

  function submit(formData: any) {
    const dto: CreateBookDto = {
      isbn: formData.isbn,
      title: formData.title,
      description: formData.description,
      imageUrl: formData.link,
      authorId: formData.author.id,
      genreIds: formData.genres.map((g: Genre) => g.id),
    };

    createBook(dto);
  }

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="grid gap-4 grid-cols-[1fr_1fr]"
    >
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative flex-1">
            <div className="absolute right-0 h-full aspect-[10/15]">
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
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Cover Image URL</DialogTitle>
            <DialogDescription>Paste url of the cover image</DialogDescription>
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

      <div className="flex flex-col gap-2 min-w-3xs">
        <>
          <Label htmlFor="title">Title</Label>
          <Input
            {...register("title", { required: true })}
            id="title"
            placeholder="Title"
          />
          {errors["title"] && (
            <p className="text-xs text-red-700">Tittle is required.</p>
          )}
        </>

        <>
          <Label htmlFor="isbn">ISBN</Label>
          <Input
            {...register("isbn", { required: true })}
            id="isbn"
            placeholder="ISBN"
          />
          {errors["isbn"] && (
            <p className="text-xs text-red-700">ISBN is required.</p>
          )}
        </>

        <>
          <Label htmlFor="author">Author</Label>
          <AuthorAutocomplete control={control} name="author" />
          {errors["author"] && (
            <p className="text-xs text-red-700">Author is required.</p>
          )}
        </>

        <>
          <Label htmlFor="genres">Genres</Label>
          <GenreAutocomplete control={control} name="genres" />
          {errors["genres"] && (
            <p className="text-xs text-red-700">
              You must specify at least one genre
            </p>
          )}
        </>

        <>
          <Label htmlFor="description">Description</Label>
          <Textarea
            {...register("description", { required: true })}
            id="description"
            placeholder="Description"
          />
          {errors["description"] && (
            <p className="text-xs text-red-700">Description is required.</p>
          )}
        </>

        <Button className="mt-5" type="submit" disabled={isLoading}>
          Create
        </Button>
      </div>
    </form>
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
