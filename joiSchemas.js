const joi = require("joi");

module.exports.lodgeJoiSchema = joi.object({
    lodge: joi.object({
      title: joi.string().required().min(3),
      location: joi.string().required(),
      image: joi.string().required(),
      price: joi.number().required().min(0),
      description: joi.string().required(),
    }).required()
  });

  module.exports.reviewJoiSchema = joi.object({
    review: joi.object({
        rating: joi.number().required().min(1).max(5),
        body: joi.string().required()
    }).required()
});