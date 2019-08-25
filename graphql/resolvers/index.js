const Validator = require('../../models/ValidatorModel')

module.exports = {
    Query: {
        validators: () => {
            return Validator.find()
                .then(validators => {
                    return validators.map(validator => {
                        return {
                            ...validator._doc,
                            _id: validator.id
                        }
                    })
                }).catch(err => {
                    throw err
                })
        }
    }
};