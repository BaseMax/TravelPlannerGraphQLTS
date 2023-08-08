import { CreateNoteInput } from "src/note/dto/create-note.input";

export function getFakeNotes(tripId: string): CreateNoteInput[] {
  return [
    {
      tripId: `${tripId}`,
      content: "it is a good idea to go france",
    },

    {
      tripId: `${tripId}`,
      content: "we should consider situation out there",
    },
  ];
}
