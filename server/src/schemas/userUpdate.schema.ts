import {Joi} from 'celebrate';
export default{

        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required().email(),
            senha: Joi.string(),
            telefone: Joi.string().required(),
            cpf: Joi.string().required()
        })
}