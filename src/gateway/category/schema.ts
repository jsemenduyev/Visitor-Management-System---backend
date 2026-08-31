import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import createCategoryResolver from "./resolver/createCategoryResolver";
import updateCategoryResolver from "./resolver/updateCategoryResolver";
import { CategoryInput } from "./types/CategoryInput";
import { categoryPayload } from "./types/CategoryPayload";
import { ReorderItemInput, UpdateCategoryInput } from "./types/UpdateCategoryInput";
import { FieldOptionInput, FieldType, VisitorCategoryType } from "./types/VisitorCategory";
import getCategoriesResolver from "./resolver/getCategoriesResolver";
import getFieldResolver from "./resolver/getFieldResolver";
import updateFieldResolver from "./resolver/updateFieldResolver";
import deleteFieldsResolver from "./resolver/deleteFieldsResolver";
import deleteCategoryResolver from "./resolver/deleteCategoryResolver";
import reorderCategoriesResolver from "./resolver/reorderCategoriesResolver";
import reorderFieldsResolver from "./resolver/reorderFieldsResolver";

export const categoryQuery = {
  getCategories: {
    type: new GraphQLList(VisitorCategoryType),
    args: {
      location: {
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    resolve: getCategoriesResolver,
  },
  getField: {
    type: new GraphQLList(FieldType),
    args: {
      categoryId: {
        type: GraphQLID,
      },
    },
    resolve: getFieldResolver,
  },
};
export const categoryMuttaion = {
  createCategory: {
    type: categoryPayload,
    args: {
      input: {
        type: CategoryInput,
      },
    },
    resolve: createCategoryResolver,
  },
  updateCategory: {
    type: categoryPayload,
    args: {
      input: {
        type: UpdateCategoryInput,
      },
    },
    resolve: updateCategoryResolver,
  },
  deleteCategory: {
    type: GraphQLString,
    args: {
      categoryId: {
        type: GraphQLID,
      },
    },
    resolve: deleteCategoryResolver,
  },
  updateField: {
    type: GraphQLString,
    args: {
      categoryId: {
        type: GraphQLID,
      },
      fieldId: {
        type: GraphQLID,
      },
      required: {
        type: GraphQLBoolean,
      },
      enabled: {
        type: GraphQLBoolean,
      },
      clearResponseAfterEachVisit: {
        type: GraphQLBoolean,
      },
      options: {
        type: new GraphQLList(FieldOptionInput),
      },
    },
    resolve: updateFieldResolver,
  },
  deleteField: {
    type: GraphQLString,
    args: {
      categoryId: {
        type: GraphQLID,
      },
      fieldId: {
        type: GraphQLID,
      },
    },
    resolve: deleteFieldsResolver,
  },
  reorderCategories: {
    type: GraphQLString,
    args: {
      items: { type: new GraphQLNonNull(new GraphQLList(ReorderItemInput)) },
    },
    resolve: reorderCategoriesResolver,
  },
  reorderFields: {
    type: GraphQLString,
    args: {
      categoryId: { type: new GraphQLNonNull(GraphQLID) },
      items: { type: new GraphQLNonNull(new GraphQLList(ReorderItemInput)) },
    },
    resolve: reorderFieldsResolver,
  },
};
