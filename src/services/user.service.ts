import { supabase } from "../lib/supabaseClient.js";
import { Errors } from "../utils/errors.js";

async function validateUser(params: { userToken: string }) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(params.userToken);

  if (error || !user) {
    throw Errors.userNotFound(params.userToken);
  }

  return user;
}

const userService = {
  validateUser,
};

export { userService };
