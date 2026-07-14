import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { categoryMuttaion, categoryQuery } from "./src/gateway/category/schema";
import { userMutation, userQuery } from "./src/gateway/user/schema";
import {
  departmentMutation,
  departmentQuery,
} from "./src/gateway/department/schema";
import { deviceMutation, deviceQuery } from "./src/gateway/device/schema";
import { visitorMutation, visitorQuery } from "./src/gateway/visitor/schema";
import {
  PreRegisterMutation,
  PreRegisterQuery,
} from "./src/gateway/preRegisterVisitor/schema";
import {
  officeLocationsMutation,
  officeLocationsQuery,
} from "./src/gateway/locations/schema";
import { companyMutation, companyQuery } from "./src/gateway/company/schema";
import { employeeMutation, employeeQuery } from "./src/gateway/employee/schema";
import {
  deliveryMutation,
  deliveryQuery,
} from "./src/gateway/deliveries/schema";
import {
  integrationMutation,
  integrationQuery,
} from "./src/gateway/integrations/schema";
import { spacesMutation, spacesQuery } from "./src/gateway/spaces/schema";

const query = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    ...userQuery,
    ...categoryQuery,
    ...departmentQuery,
    ...deviceQuery,
    ...visitorQuery,
    ...PreRegisterQuery,
    ...officeLocationsQuery,
    ...companyQuery,
    ...employeeQuery,
    ...deliveryQuery,
    ...integrationQuery,
    ...spacesQuery
  }),
});
const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    ...categoryMuttaion,
    ...userMutation,
    ...departmentMutation,
    ...deviceMutation,
    ...visitorMutation,
    ...PreRegisterMutation,
    ...companyMutation,
    ...employeeMutation,
    ...deliveryMutation,
    ...officeLocationsMutation,
    ...integrationMutation,
    ...spacesMutation
  }),
});

const schema = new GraphQLSchema({
  query,
  mutation,
});
export default schema;
