import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { OfficeLocation } from "../../locations/type/OfficeLocation";
import ErrorType from "../../category/types/Error";
import { SpacesResource } from "./SpacesResource";
import GetSpaceCategoryResourcesResolver from "../resolver/GetSpaceCategoryResourcesResolver";

export const SpacesCategory = new GraphQLObjectType({
  name: "SpacesCategoryType",
  fields: () => ({
    _id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    icon: {
      type: GraphQLString,
    },
    location: {
      type: OfficeLocation,
    },
    resources: {
      type: new GraphQLList(SpacesResource),
      resolve: GetSpaceCategoryResourcesResolver,
    },
  }),
});

export const SpacesCategoryPayload=new GraphQLObjectType({
  name:"SpacesCategoryPayload",
  fields:()=>({
    category:{
      type:SpacesCategory
    },
    error:{
      type:ErrorType
    }
  })
})

export const SpacesCategoryInput = new GraphQLInputObjectType({
  name: "SpacesCategoryInputType",
  fields: () => ({
    name: {
      type: GraphQLString,
    },
    icon: {
      type: GraphQLString,
    },
    location: {
      type: GraphQLID,
    },
  }),
});
