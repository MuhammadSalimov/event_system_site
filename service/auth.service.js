const UserDto = require("../dtos/user.dto");
const bcrypt = require("bcrypt");
const tokenService = require("./token.service");
const mailService = require("./mail.service");
const BaseError = require("../errors/base.error");
const prisma = require("../utils/connection");
class AuthService {
  async register(body) {
    const { email, password, fullName } = body;
    const existUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existUser) {
      throw BaseError.BadRequest(
        `User with existing email ${email} already registered`
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const data = {
      email,
      fullName,
      password: hashPassword,
      role: email == "salimovmuhammad2322@gmail.com" ? "admin" : "user",
    };
    const user = await prisma.user.create({
      data,
    });

    const userDto = new UserDto(user);

    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/auth/activation/${userDto.id}`
    );

    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { user: userDto, ...tokens };
  }

  async activation(userId) {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw BaseError.BadRequest("User is not defined");
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { isActivated: true },
    });
  }

  async login(email, password) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw BaseError.BadRequest("User is not defined");
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      throw BaseError.BadRequest("Password is incorrect");
    }
    const userDto = new UserDto(user);
    const tokens = tokenService.generateToken({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { user: userDto, ...tokens };
  }

  async logout(refreshToken) {
    return await tokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw BaseError.UnauthorizedError("Bad authorization");
    }

    const userPayload = tokenService.validateRefreshToken(refreshToken);
    const tokenDb = await tokenService.findToken(refreshToken);
    if (!userPayload || !tokenDb) {
      throw BaseError.UnauthorizedError("Bad authorization");
    }

    const user = await prisma.user.findFirst({
      where: { id: userPayload.id },
    });
    const userDto = new UserDto(user);

    const tokens = tokenService.generateToken({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { user: userDto, ...tokens };
  }

  async getUsers() {
    return await prisma.user.findMany();
  }

  async forgotPassword(email) {
    if (!email) {
      throw BaseError.BadRequest("Email is required");
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw BaseError.BadRequest("User with existing email is not found");
    }

    const userDto = new UserDto(user);

    const tokens = tokenService.generateToken({ ...userDto });

    await mailService.sendForgotPasswordMail(
      email,
      `${process.env.CLIENT_URL}/recovery-account/${tokens.accessToken}`
    );
    return 200;
  }

  async recoveryAccount(token, password) {
    if (!token) {
      throw BaseError.BadRequest("Something went wrong with token");
    }

    const userData = tokenService.validateAccessToken(token);
    if (!userData) {
      throw BaseError.BadRequest("Expired access to your account");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: userData.id },
      data: { password: hashPassword },
    });

    return 200;
  }
}

module.exports = new AuthService();
