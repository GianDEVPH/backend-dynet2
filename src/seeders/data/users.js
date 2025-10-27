// User data seeding configuration for initial user setup and development data.

const bcrypt = require('bcrypt');
const ROLES_LIST = require('./roles_list');
const users = [
  {
    name: 'admin',
    email: 'admin@dynet.nl',
    password: bcrypt.hashSync('123', 10),
    roles: { Admin: ROLES_LIST.Admin },
color: '#e74c3c',
    refreshToken: '',
  },
  {
    name: 'john',
    email: 'technischeplanning@dynet.nl',
    password: bcrypt.hashSync('123', 10),
    roles: { TechnischePlanning: ROLES_LIST.TechnischePlanning },
color: '#3498db',
    refreshToken: '',
  },
  {
    name: 'james',
    email: 'technischeschouwer@dynet.nl',
    password: bcrypt.hashSync('123', 10),
    roles: { TechnischeSchouwer: ROLES_LIST.TechnischeSchouwer },
color: '#9b59b6',
    refreshToken: '',
  },
  {
    name: 'jack',
    email: 'werkvoorbereider@dynet.nl',
    password: bcrypt.hashSync('123', 10),
    roles: { Werkvoorbereider: ROLES_LIST.Werkvoorbereider },
color: '#f39c12',
    refreshToken: '',
  },
  {
    name: 'jane',
    email: 'hasplanning@dynet.nl',
    password: bcrypt.hashSync('123', 10),
    roles: { HASPlanning: ROLES_LIST.HASPlanning },
color: '#2ecc71',
    refreshToken: '',
  },
  {
    name: 'jasper',
    email: 'hasmonteur@dynet.nl',
    password: bcrypt.hashSync('123', 10),
    roles: { HASMonteur: ROLES_LIST.HASMonteur },
color: '#1abc9c',
    refreshToken: '',
  },
  {
    name: 'Anna Johnson',
    email: 'anna.johnson@dynet.nl',
    password: bcrypt.hashSync('123', 10),
    roles: { TechnischeSchouwer: ROLES_LIST.TechnischeSchouwer },
color: '#e67e22',
    refreshToken: '',
  },
  {
    name: 'Mark Brown',
    email: 'mark.brown@dynet.nl',
    password: bcrypt.hashSync('123', 10),
    roles: { TechnischeSchouwer: ROLES_LIST.TechnischeSchouwer },
color: '#34495e',
    refreshToken: '',
  },
  {
    name: 'Sarah Davis',
    email: 'sarah.davis@dynet.nl',
    password: bcrypt.hashSync('123', 10),
    roles: { HASMonteur: ROLES_LIST.HASMonteur },
color: '#f39c12',
    refreshToken: '',
  },
  {
    name: 'Mike Wilson',
    email: 'mike.wilson@dynet.nl',
    password: bcrypt.hashSync('123', 10),
    roles: { HASMonteur: ROLES_LIST.HASMonteur },
color: '#8e44ad',
    refreshToken: '',
  },
];
module.exports = users;
