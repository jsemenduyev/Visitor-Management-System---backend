import { GraphQLID, GraphQLInt, GraphQLList, GraphQLString } from "graphql";
import { UserPaylaod } from "./types/UserPayload";
import authLoginResolver from "./resolve/authLoginResolver";
import { RoleEnum, UserType } from "./types/UserType";
import meResolver from "./resolve/meResolver";
import { SignUpInputType } from "./types/SignUpInputType";
import SignUpResolver from "./resolve/SignUpResolver";
import verifyOtpResolver from "./resolve/verifyOtpResolver";
import generateResetOtpResolver from "./resolve/generateResetOtpResolver";
import resetPasswordResolver from "./resolve/resetPasswordResolver";
import {
  isAdminOrManager,
  isAUthenticated,
} from "../../middleware/isAuthenticated";
import getUsersResolver from "./resolve/getUsersResolver";
import { UserList } from "./types/UserList";
import { UpdateUserInput } from "./types/UpdateUserInput";
import updateUserResolver from "./resolve/updateUserResolver";
import { UserInput } from "./types/UserInput";
import createUserResolver from "./resolve/createUserResolver";
import employeeLoginResolver from "./resolve/employeeLoginResolver";
import verifyEmployeeResolver from "./resolve/verifyEmployeeResolver";
import bulkUsersResolver from "./resolve/bulkUsersResolver";
import { SortedInput } from "../visitor/types/SortedInput";

export const userQuery = {
  me: {
    type: UserType,
    resolve: meResolver,
  },
  getUsers: {
    type: UserList,
    args: {
      search: {
        type: GraphQLString,
      },
      limit: {
        type: GraphQLInt,
      },
      offset: {
        type: GraphQLInt,
      },
      sorted: {
        type: SortedInput,
      },
      role: {
        type: RoleEnum
      },
      location: {
        type: GraphQLID
      }
    },
    resolve: (_, args, ctx) => isAdminOrManager(args, ctx, getUsersResolver),
  },
};
export const userMutation = {
  signup: {
    type: UserPaylaod,
    args: {
      input: {
        type: SignUpInputType,
      },
    },
    resolve: SignUpResolver,
  },
  verifyOtp: {
    type: UserPaylaod,
    args: {
      email: {
        type: GraphQLString,
      },
      otp: {
        type: GraphQLString,
      },
    },
    resolve: verifyOtpResolver,
  },
  authLogin: {
    type: UserPaylaod,
    args: {
      email: {
        type: GraphQLString,
      },
      password: {
        type: GraphQLString,
      },
    },
    resolve: authLoginResolver,
  },
  generateResetOtp: {
    type: UserPaylaod,
    args: {
      email: {
        type: GraphQLString,
      },
    },
    resolve: generateResetOtpResolver,
  },
  resetPassword: {
    type: UserPaylaod,
    args: {
      email: {
        type: GraphQLString,
      },
      otp: {
        type: GraphQLString,
      },
      password: {
        type: GraphQLString,
      },
    },
    resolve: resetPasswordResolver,
  },
  createUser: {
    type: UserPaylaod,
    args: {
      input: {
        type: UserInput,
      },
    },
    resolve: (_, args, ctx) => isAdminOrManager(args, ctx, createUserResolver),
  },
  createBulkUsers: {
    type: UserList,
    args: {
      input: {
        type: new GraphQLList(UserInput),
      },
    },
    resolve: (_, args, ctx) => isAdminOrManager(args, ctx, bulkUsersResolver),
  },
  updateUser: {
    type: UserPaylaod,
    args: {
      input: {
        type: UpdateUserInput,
      },
    },
    resolve: (_, args, ctx) => isAUthenticated(args, ctx, updateUserResolver),
  },
  employeeLogin: {
    type: UserPaylaod,
    args: {
      email: {
        type: GraphQLString,
      },
    },
    resolve: employeeLoginResolver,
  },
  verifyEmployee: {
    type: UserPaylaod,
    args: {
      email: {
        type: GraphQLString,
      },
      otp: {
        type: GraphQLString,
      },
    },
    resolve: verifyEmployeeResolver,
  },
};
