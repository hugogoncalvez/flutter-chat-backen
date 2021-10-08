const { io } = require('../index');
const { comprobarJWT } = require('../jwt/jwt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');

// Mensajes de Sockets
io.on('connection', client => {
  console.log('Cliente conectado');

  const [valido, uid] = comprobarJWT(client.handshake.headers['x-token']);

  // verifica autenticación
  if (!valido) { return client.disconnect(); };

  // Cliente autenticado
  usuarioConectado(uid);

  // igresar al usuario a una sala especifica
  // sala global ( io.emit), mensaje privado => client.id lo genera el socket server automaticamente, sala individual => uid de la BD

  client.join(uid);

  //esacuchar el mensaje personal

  client.on('mensaje-personal', async (payload)=>{  
   await grabarMensaje( payload );
    io.to(payload.para).emit('mensaje-personal', payload);
  });

 


  client.on('disconnect', () => {    
    usuarioDesconectado(uid);
  });

  // client.on('mensaje', ( payload ) => {
  //     console.log('Mensaje', payload);

  //     io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

  // });


});
