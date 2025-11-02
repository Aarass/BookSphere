import { api } from "@/app/store";
import type { Book } from "@interfaces/book";
import type {
  AddBookNoteDto,
  BookNoteDto,
  DeleteBookNoteDto,
  GetSpecificBookNoteDto,
  NoteDto,
  UpdateBookNoteDto,
} from "@interfaces/dtos/bookNotesDto";
import { toast } from "sonner";

export const apiWithComments = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query<BookNoteDto, Book["isbn"]>({
      query: (isbn) => `/books/${isbn}/note`,
      transformResponse: (bookNote: BookNoteDto) => {
        const notes = bookNote.notes;

        notes.sort((a, b) => a.page - b.page);

        return {
          ...bookNote,
          notes: notes,
        };
      },
      providesTags: (_result, _error, isbn) => [
        {
          type: "BookNote",
          id: `LIST ${isbn}`,
        },
        {
          type: "BookNote",
          id: `LIST`,
        },
      ],
    }),
    getSpecificNote: builder.query<
      NoteDto,
      Omit<GetSpecificBookNoteDto, "userId">
    >({
      query: (payload) => `/books/${payload.isbn}/note/${payload.noteId}`,
      providesTags: (_result, _error, payload) => [
        {
          type: "BookNote",
          id: `LIST NOTE ${payload.isbn} ${payload.noteId}`,
        },
        {
          type: "BookNote",
          id: `LIST NOTE`,
        },
      ],
    }),
    createNote: builder.mutation<BookNoteDto, Omit<AddBookNoteDto, "userId">>({
      query: (payload) => ({
        url: `/books/${payload.isbn}/note`,
        method: "POST",
        body: { page: payload.page, description: payload.description },
        responseHandler: "text",
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          toast("Successfully added the note");
        } catch {
          toast("There was an error while trying to add a note");
        }
      },
      invalidatesTags: (_result, _error, isbn) => [
        {
          type: "BookNote",
          id: `LIST ${isbn}`,
        },
        {
          type: "BookNote",
          id: `LIST`,
        },
      ],
    }),
    updateNote: builder.mutation<
      BookNoteDto,
      Omit<UpdateBookNoteDto, "userId">
    >({
      query: (payload) => ({
        url: `/books/${payload.isbn}/note`,
        method: "PUT",
        body: {
          noteId: payload.noteId,
          page: payload.page,
          description: payload.description,
        },
        responseHandler: "text",
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          toast("Successfully updated the note");
        } catch {
          toast("There was an error while trying to update a note");
        }
      },
      invalidatesTags: (_result, _error, isbn) => [
        {
          type: "BookNote",
          id: `LIST ${isbn}`,
        },
        {
          type: "BookNote",
          id: `LIST`,
        },
      ],
    }),
    deleteNote: builder.mutation<
      BookNoteDto,
      Omit<DeleteBookNoteDto, "userId">
    >({
      query: (payload) => ({
        url: `/books/${payload.isbn}/note/${payload.noteId}`,
        method: "DELETE",
        responseHandler: "text",
      }),
      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          await queryFulfilled;
          toast("Successfully deleted the note");
        } catch {
          toast("There was an error while trying to delete a note");
        }
      },
      invalidatesTags: (_result, _error, isbn) => [
        {
          type: "BookNote",
          id: `LIST ${isbn}`,
        },
        {
          type: "BookNote",
          id: `LIST`,
        },
      ],
    }),
  }),
});

export const {
  useGetNotesQuery,
  useGetSpecificNoteQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = apiWithComments;
