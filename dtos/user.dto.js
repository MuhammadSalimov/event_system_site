module.exports = class UserDto {
  fullName;
  id;
  isActivated;
  role;
  constructor(model) {
    this.fullName = model.fullName;
    this.id = model.id;
    this.isActivated = model.isActivated;
    this.role = model.role;
  }
};
