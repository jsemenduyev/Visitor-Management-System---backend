import SpaceModel from "../../../../database/models/spaces";

export default async (args: any, ctx: any) => {
  const { _id, input } = args;

  const space = await SpaceModel.findByIdAndUpdate(_id, input, { new: true });

  if (!space) {
    return {
      spaces: null,
      error: {
        message: "Space not found",
        code: "NOT_FOUND",
      },
    };
  }

  return {
    spaces: space,
    error: null,
  };
};
