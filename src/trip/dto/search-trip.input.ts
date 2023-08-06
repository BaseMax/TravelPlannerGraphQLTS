import { InputType, OmitType, PartialType } from "@nestjs/graphql";
import { CreateTripInput } from "./create-trip.input";

@InputType()
export class SearchTripInput extends PartialType(
  OmitType(CreateTripInput, ["collaborators"] as const)
) {}
