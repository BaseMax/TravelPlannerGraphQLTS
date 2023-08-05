import { CreateTripInput } from "src/trip/dto/create-trip.input";
import { Trip } from "src/trip/entities/trip.entity";

export function getFakeTrips(userId: string): CreateTripInput[] {
  return [
    {
      destination: "France",
      dates: [
        new Date("Sat Aug 05 2023 06:34:25 GMT+0330"),
        new Date("Sat dec 07 2023 06:34:25 GMT+0330 "),
      ],
      collaborators: ["64cdde0c580b92480b8fe8b0", `${userId}`],
    },
    {
      destination: "Germany",
      dates: [
        new Date("Sat june 05 2023 06:34:25 GMT+0330"),
        new Date("Sat june 07 2023 06:34:25 GMT+0330 "),
      ],
      collaborators: [`${userId}`],
    },

    {
      destination: "Netherlands",
      dates: [
        new Date("Sat april 05 2023 06:34:25 GMT+0330"),
        new Date("Sat march  07 2023 06:34:25 GMT+0330 "),
      ],
      collaborators: [`${userId}`],
    },
    {
      destination: "Sweden",
      dates: [
        new Date("Sat july 05 2023 06:34:25 GMT+0330"),
        new Date("Sat february 07 2023 06:34:25 GMT+0330 "),
      ],
      collaborators: [`${userId}`],
    },
    {
      destination: "Australia",
      dates: [
        new Date("Sat Aug 05 2023 06:34:25 GMT+0330"),
        new Date("Sat dec 07 2023 06:34:25 GMT+0330 "),
      ],
      collaborators: ["64cdde0c580b92480b8fe8b0"],
    },
  ];
}
