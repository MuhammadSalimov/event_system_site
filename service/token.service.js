const jwt = require("jsonwebtoken");
const prisma = require("../utils/connection");

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
      expiresIn: "30d",
    });

    return { accessToken, refreshToken };
  }

  async saveToken(userId, refreshToken) {
    const existToken = await prisma.tokenModel.findFirst({
      where: { userId },
    });

    if (existToken) {
      const newData = await prisma.tokenModel.update({
        where: {
          id: existToken.id,
        },
        data: { refreshToken: refreshToken },
      });
      return newData;
    }
    const token = await prisma.tokenModel.create({
      data: { userId: userId, refreshToken },
    });
    return token;
  }

  async removeToken(refreshToken) {
    const findToken = await prisma.tokenModel.findFirst({
      where: { refreshToken },
    });
    return await prisma.tokenModel.delete({
      where: {
        id: findToken.id,
      },
    });
  }

  async findToken(refreshToken) {
    return await prisma.tokenModel.findFirst({
      where: {
        refreshToken,
      },
    });
  }

  validateRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_KEY);
    } catch (error) {
      return null;
    }
  }

  validateAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_KEY);
    } catch (error) {
      return null;
    }
  }
}

module.exports = new TokenService();
