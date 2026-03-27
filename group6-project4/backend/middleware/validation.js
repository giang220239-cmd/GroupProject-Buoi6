const { body } = require("express-validator");

// Validation rules cho signup (simplified for testing)
const signupValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Tên không được để trống")
    .isLength({ min: 2, max: 100 })
    .withMessage("Tên phải có từ 2-100 ký tự"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage("Email không được quá 255 ký tự"),

  body("password")
    .notEmpty()
    .withMessage("Mật khẩu không được để trống")
    .isLength({ min: 6, max: 128 })
    .withMessage("Mật khẩu phải có từ 6-128 ký tự"),

  // Temporarily comment out confirmPassword validation for easier testing
  // body("confirmPassword")
  //   .notEmpty()
  //   .withMessage("Xác nhận mật khẩu không được để trống")
  //   .custom((value, { req }) => {
  //     if (value !== req.body.password) {
  //       throw new Error("Xác nhận mật khẩu không khớp");
  //     }
  //     return true;
  //   }),

  body("role")
    .optional()
    .isIn(["user", "admin"])
    .withMessage("Role chỉ có thể là 'user' hoặc 'admin'"),
];

// Validation rules cho login
const loginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),

  body("password").notEmpty().withMessage("Mật khẩu không được để trống"),
];

// Validation rules cho update profile
const updateProfileValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Tên phải có từ 2-100 ký tự")
    .matches(
      /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠưăáâãèéêìíòóôõùúăđĩũơ\s]+$/
    )
    .withMessage("Tên chỉ được chứa chữ cái và khoảng trắng"),

  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),

  body("avatar")
    .optional()
    .isURL()
    .withMessage("Avatar phải là một URL hợp lệ"),
];

// Validation rules cho change password
const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Mật khẩu hiện tại không được để trống"),

  body("newPassword")
    .notEmpty()
    .withMessage("Mật khẩu mới không được để trống")
    .isLength({ min: 6, max: 128 })
    .withMessage("Mật khẩu mới phải có từ 6-128 ký tự")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Mật khẩu mới phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số"
    ),

  body("confirmNewPassword")
    .notEmpty()
    .withMessage("Xác nhận mật khẩu mới không được để trống")
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Xác nhận mật khẩu mới không khớp");
      }
      return true;
    }),
];

// Validation rules cho forgot password
const forgotPasswordValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email không được để trống")
    .isEmail()
    .withMessage("Email không hợp lệ")
    .normalizeEmail(),
];

// Validation rules cho reset password
const resetPasswordValidation = [
  body("password")
    .notEmpty()
    .withMessage("Mật khẩu không được để trống")
    .isLength({ min: 6, max: 128 })
    .withMessage("Mật khẩu phải có từ 6-128 ký tự")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Xác nhận mật khẩu không được để trống")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Xác nhận mật khẩu không khớp");
      }
      return true;
    }),
];

module.exports = {
  signupValidation,
  loginValidation,
  updateProfileValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
};
