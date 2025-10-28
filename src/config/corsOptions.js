const allowedOrigins = [
  'https://tool.dynet.nl',   // jouw frontend domein
  'http://localhost:3000'    // voor lokaal testen
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

module.exports = corsOptions;
