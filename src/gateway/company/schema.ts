import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { SignatureTypeEnum } from "./types/SignatureTypeEnum";
import { UpdateCompanyInput } from "./types/UpdateCompany";
import { isAdminOrManager } from "../../middleware/isAuthenticated";
import UpdateCompanyResolver from "./resolver/UpdateCompanyResolver";
import { CompanyType } from "./types/CompanyType";
import GetCompanyDetailResolver from "./resolver/GetCompanyDetailResolver";
import { AgreementType } from "./types/AgreementType";
import CreateAgreementResolver from "./resolver/CreateAgreementResolver";
import getAgreementsResolver from "./resolver/getAgreementsResolver";
import DeleteAgreementResolver from "./resolver/DeleteAgreementResolver";
import GetAgreementResolver from "./resolver/GetAgreementResolver";
import { TabImgInput } from "./types/ImgInput";
import UpdateComapnyTabImgsResolver from "./resolver/UpdateComapnyTabImgsResolver";
import AddtabImgResolver from "./resolver/AddTabImgResolver";

export const companyQuery = {
  getCompanyDetails: {
    type: CompanyType,
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, GetCompanyDetailResolver),
  },
  getAgreements: {
    type: new GraphQLList(AgreementType),
    args: {
      search: {
        type: GraphQLString,
      },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, getAgreementsResolver),
  },
  getAgreement: {
    type: AgreementType,
    args: {
      agreementId: {
        type: GraphQLString,
      },
    },
    resolve: GetAgreementResolver,
  },
};
export const companyMutation = {
  updateCompany: {
    type: GraphQLString,
    args: {
      input: {
        type: UpdateCompanyInput,
      },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, UpdateCompanyResolver),
  },
  createAgreement: {
    type: AgreementType,
    args: {
      id: {
        type: GraphQLString,
      },
      title: {
        type: new GraphQLNonNull(GraphQLString),
      },
      content: {
        type: new GraphQLNonNull(GraphQLString),
      },
      requireSignature: {
        type: GraphQLBoolean,
      },
      signatureType: {
        type: SignatureTypeEnum,
      },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, CreateAgreementResolver),
  },
  deleteAgreement: {
    type: GraphQLString,
    args: {
      id: {
        type: new GraphQLNonNull(GraphQLString),
      },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, DeleteAgreementResolver),
  },
  addTabImg: {
    type: GraphQLString,
    args: {
      url: {
        type: GraphQLString,
      },
      locationId: {
        type: new GraphQLNonNull(GraphQLID),
      },
    },
    resolve: (_, args, ctx) => isAdminOrManager(args, ctx, AddtabImgResolver),
  },
  updateCompanyImgs: {
    type: GraphQLString,
    args: {
      locationId: {
        type: new GraphQLNonNull(GraphQLID),
      },
      imgs: {
        type: new GraphQLList(TabImgInput),
      },
    },
    resolve: (_, args, ctx) =>
      isAdminOrManager(args, ctx, UpdateComapnyTabImgsResolver),
  },
};
