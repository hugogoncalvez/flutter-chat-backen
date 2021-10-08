const {Schema, model} = require ('mongoose');

const UsuarioSchema = Schema({
    nombre:{
        type: String,
        require: true
    },

    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    },
    online:{
        type: Boolean,       
        default: false
    }
});


UsuarioSchema.method('toJSON', function(){
    const {__v, _id, password, ...object} = this.toObject();  // se extrae lo que no se quiere mostart
    object.uid = _id;
    return object;
})

module.exports = model('Usuario', UsuarioSchema);


