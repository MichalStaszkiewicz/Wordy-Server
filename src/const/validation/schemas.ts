import Joi from "joi";

const imageNameSchema = Joi.object({
  imageName: Joi.string().required().description("Image name"),
});

const achievementIdSchema = Joi.object({
  id: Joi.number().required().description("ID of the achievement"),
});
export const achievementCreateSchema = Joi.object({
  name: Joi.string().required().description("Achievement name"),
  description: Joi.string().required().description("Achievement description"),
  type: Joi.string().required().description("Achievement type"),
  goal: Joi.number().required().description("Achievement goal"),
  image: Joi.string().required().description("Achievement image"),
});

// Validation schema for the language name parameter
const languageNameSchema = Joi.object({
  languageName: Joi.string().required().description("Language name"),
});

// Validation schema for the language ID parameter
const languageIdSchema = Joi.object({
  id: Joi.string().required().description("Language ID"),
});

const updateCurrentCourseSchema = Joi.object({
  courseName: Joi.string().required().description("Course name"),
});

const refreshTokenSchema = Joi.object({
  token: Joi.string().required().description("Refresh Token"),
});

// Payload validation schema for user achievements
const userAchievementsSchema = Joi.array().items(
  Joi.object({
    id: Joi.string().required().description("Achievement ID"),
    name: Joi.string().required().description("Achievement name"),
  })
);

// Payload validation schema for adding a new course to the user
const addUserCoursePayloadSchema = Joi.object({
  interfaceLanguage: Joi.string()
    .required()
    .description("Interface language for the course"),
  courseName: Joi.string().required().description("Name of the course"),
});

// Payload validation schema for registerUser route
const registerUserPayloadSchema = Joi.object({
  fullName: Joi.string().required().description("Full name of the user"),
  email: Joi.string().required().description("Email of the user"),
  password: Joi.string().required().description("Password of the user"),
});

// Payload validation schema for loginUser route
const loginUserPayloadSchema = Joi.object({
  email: Joi.string().required().description("Email of the user"),
  password: Joi.string().required().description("Password of the user"),
});

// Payload validation schema for recoverUser route
const recoverUserPayloadSchema = Joi.object({
  email: Joi.string().required().description("Email of the user"),
});

// Payload validation schema for confirmUserResetPasswordToken route
const confirmUserResetPasswordTokenPayloadSchema = Joi.object({
  email: Joi.string().required().description("Email of the user"),
  token: Joi.string().required().description("Reset password token"),
});

// Payload validation schema for updateUserPassword route
const updateUserPasswordPayloadSchema = Joi.object({
  email: Joi.string().required().description("Email of the user"),
  newPassword: Joi.string().required().description("New password for the user"),
});

const updateInterfaceLanguageSchema = Joi.object({
  languageName: Joi.string().required().description("Name of the topic"),
});

const insertKnownWordsSchema = Joi.object({
  wordIdList: Joi.array()
    .items(Joi.number())
    .required()
    .description("wordIdList"),
});

const getKnownWordsByTopicSchema = Joi.object({
  topicName: Joi.string().required().description("Name of the topic"),
});

// Validation schema for the 'params' object in the '/v1/words/{topicName}' route
const wordsByTopicParamsSchema = Joi.object({
  topicName: Joi.string().required().description("Topic of the words"),
});

// Validation schema for the 'params' object in the '/v1/words/flashCards/by/topic/{topicName}' route
const flashcardsByTopicParamsSchema = Joi.object({
  topicName: Joi.string().required().description("Topic of the words"),
});

// Validation schema for the 'params' object in the '/v1/words/flashCards/{topicName}' route
const flashcardsParamsSchema = Joi.object({
  topicName: Joi.string().required().description("Topic Name"),
});

export {
  imageNameSchema,
  achievementIdSchema,
  languageNameSchema,
  languageIdSchema,
  updateCurrentCourseSchema,
  refreshTokenSchema,
  userAchievementsSchema,
  addUserCoursePayloadSchema,
  registerUserPayloadSchema,
  loginUserPayloadSchema,
  recoverUserPayloadSchema,
  confirmUserResetPasswordTokenPayloadSchema,
  updateUserPasswordPayloadSchema,
  updateInterfaceLanguageSchema,
  insertKnownWordsSchema,
  getKnownWordsByTopicSchema,
  wordsByTopicParamsSchema,
  flashcardsByTopicParamsSchema,
  flashcardsParamsSchema,
};
