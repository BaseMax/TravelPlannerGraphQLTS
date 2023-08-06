import { CreateTripInput } from "src/trip/dto/create-trip.input";
import { Trip } from "src/trip/entities/trip.entity";

export function getFakeTrips(userId: string): CreateTripInput[] {
  return [
    {
      destination: "France",
      fromDate: new Date("Sat Aug 05 2023 06:34:25 GMT+0330"),
      toDate: new Date("Sat dec 07 2023 06:34:25 GMT+0330 "),
      collaborators: ["64cdde0c580b92480b8fe8b0", `${userId}`],
    },
    {
      destination: "Germany",
      fromDate: new Date("Sat june 05 2023 06:34:25 GMT+0330"),
      toDate: new Date("Sat june 07 2023 06:34:25 GMT+0330 "),

      collaborators: [`${userId}`],
    },

    {
      destination: "Netherlands",
      fromDate: new Date("Sat march 05 2023 06:34:25 GMT+0330"),
      toDate: new Date("Sat  april 07 2023 06:34:25 GMT+0330 "),
      collaborators: [`${userId}`],
    },
    {
      destination: "Sweden",
      fromDate: new Date("Sat february 05 2023 06:34:25 GMT+0330"),
      toDate: new Date("Sat july 07 2023 06:34:25 GMT+0330 "),
      collaborators: [`${userId}`],
    },
    {
      destination: "Australia",
      fromDate: new Date("Sat Aug 05 2023 06:34:25 GMT+0330"),
      toDate: new Date("Sat dec 07 2023 06:34:25 GMT+0330 "),
      collaborators: ["64cdde0c580b92480b8fe8b0"],
    },
  ];
}
