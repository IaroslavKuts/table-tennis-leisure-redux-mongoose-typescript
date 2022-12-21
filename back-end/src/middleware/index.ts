import verifyJWT from "./verifyJWT";
import roleVerifiers from "./verifyRole";

export default { verifyJWT, ...roleVerifiers };
