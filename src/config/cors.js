const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',
];

function enableCors(app) {
  const corsOptions = {
    origin(origin, callback) {
      // Postman、curl等沒有origin，允許通過
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: Origin ${origin} not allowed`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions)); // 允許所有路由 OPTIONS 預檢
}

module.exports = enableCors;
