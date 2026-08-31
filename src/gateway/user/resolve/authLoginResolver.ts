import { UserModel } from "../../../../database/models/user";
import bcrypt from "bcrypt";
import { signToken } from "../../../services/authJwt";
import { MutationAuthLoginArgs } from "../../../generated/graphql";

const normalizeEmail = (email?: string | null) =>
  String(email || "").trim().toLowerCase();

export default async (_, args: MutationAuthLoginArgs) => {
  try {
    const { email, password } = args;
    const normalizedEmail = normalizeEmail(email);
    // #region agent log
    fetch('http://127.0.0.1:7549/ingest/5c6ee3ea-693f-48e7-9dec-c63993115624',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1a6c85'},body:JSON.stringify({sessionId:'1a6c85',location:'authLoginResolver.ts:entry',message:'authLogin called',data:{normalizedEmail,hasPassword:Boolean(password)},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    const candidates = await UserModel.find({ email: normalizedEmail }).lean();
    // #region agent log
    fetch('http://127.0.0.1:7549/ingest/5c6ee3ea-693f-48e7-9dec-c63993115624',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1a6c85'},body:JSON.stringify({sessionId:'1a6c85',location:'authLoginResolver.ts:candidates',message:'user lookup result',data:{count:candidates.length,roles:candidates.map((c)=>({role:c.role,hasPassword:Boolean(c.password),status:c.status}))},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{});
    // #endregion

    if (!candidates.length) {
      return {
        error: {
          message: "User not found",
          code: "USER_NOT_FOUND",
        },
        token: null,
        user: null,
      };
    }

    let user: (typeof candidates)[number] | null = null;
    for (const candidate of candidates) {
      if (!candidate.password || candidate.role === "employee") {
        continue;
      }
      const isMatch = await bcrypt.compare(password, candidate.password);
      if (isMatch) {
        user = candidate;
        break;
      }
    }

    if (!user) {
      // #region agent log
      fetch('http://127.0.0.1:7549/ingest/5c6ee3ea-693f-48e7-9dec-c63993115624',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1a6c85'},body:JSON.stringify({sessionId:'1a6c85',location:'authLoginResolver.ts:noMatch',message:'no matching user after password check',data:{candidateCount:candidates.length},timestamp:Date.now(),hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      return {
        error: {
          message: "Invalid credentials",
          code: "INVALID_PASSWORD",
        },
        token: null,
        user: null,
      };
    }

    if (!user.status) {
      // #region agent log
      fetch('http://127.0.0.1:7549/ingest/5c6ee3ea-693f-48e7-9dec-c63993115624',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1a6c85'},body:JSON.stringify({sessionId:'1a6c85',location:'authLoginResolver.ts:notVerified',message:'user not verified',data:{userId:user._id?.toString(),status:user.status},timestamp:Date.now(),hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      return {
        error: {
          message: "User Not Verified",
          code: "USER_NOT_VERIFIED",
        },
      };
    }

    const token = signToken({
      _id: user._id.toString(),
      name: user.firstName,
      email: user.email,
      role: user.role,
      company: user.company.toString(),
    });

    // #region agent log
    fetch('http://127.0.0.1:7549/ingest/5c6ee3ea-693f-48e7-9dec-c63993115624',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1a6c85'},body:JSON.stringify({sessionId:'1a6c85',location:'authLoginResolver.ts:success',message:'login success',data:{userId:user._id?.toString(),role:user.role,hasToken:Boolean(token)},timestamp:Date.now(),hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    return {
      token,
      user,
      error: null,
    };
  } catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7549/ingest/5c6ee3ea-693f-48e7-9dec-c63993115624',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'1a6c85'},body:JSON.stringify({sessionId:'1a6c85',location:'authLoginResolver.ts:catch',message:'authLogin exception',data:{errorMessage:(error as Error)?.message},timestamp:Date.now(),hypothesisId:'F'})}).catch(()=>{});
    // #endregion
    return {
      error: {
        message: error.message || "Something went wrong",
        code: "INTERNAL_SERVER_ERROR",
      },
      token: null,
      user: null,
    };
  }
};
