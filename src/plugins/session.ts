import genSecretKey from "../utils/genSecretKey";

export const sessionParams = {
    secret: genSecretKey(32),
  }