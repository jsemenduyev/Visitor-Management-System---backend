import { error } from "console";
import { AgreementModel } from "../../../../database/models/agreements";
import { QueryGetAgreementArgs } from "../../../generated/graphql";

export default async(_,args:QueryGetAgreementArgs)=>{
const {agreementId} = args;
const agreement= await AgreementModel.findById(agreementId).lean();
if(!agreement){
throw new error("Agreement not found")
}
return agreement;
}