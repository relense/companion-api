import { Errors } from "../utils/errors.js";

async function validateUser(params: { userToken: string }) {
  const user = {
    id: "djiosadioasjdoiasjo",
    role: "CLIENT",
  };
  // const user = await prisma.user.findFirst({
  //   where: {
  //     token: params.userToken,
  //   },
  // });

  if (!user) {
    throw Errors.userNotFound(params.userToken);
  }

  return user;
}

const userService = {
  validateUser,
};

export { userService };
