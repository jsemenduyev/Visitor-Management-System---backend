import SpaceResourceModel from "../../../../database/models/spacesResources";

export default async (args: any, ctx: any) => {
  const { _id, input } = args;

  const resource = await SpaceResourceModel.findByIdAndUpdate(_id, input, {
    new: true,
  });

  if (!resource) {
    return {
      resource: null,
      error: {
        message: "Resource not found",
        code: "NOT_FOUND",
      },
    };
  }

  return {
    resource,
    error: null,
  };
};
